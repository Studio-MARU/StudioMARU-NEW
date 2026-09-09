/**
 * Liest Empfängerlisten aus Dateien — .xlsx, .csv und .txt.
 *
 * Warum ohne Fremdbibliothek: Die gängigen Excel-Pakete sind groß und die auf
 * npm verfügbare Fassung von SheetJS hat offene Sicherheitslücken. Eine
 * .xlsx-Datei ist im Kern ein ZIP mit XML darin — beides kann der Browser
 * selbst, mit DecompressionStream und DOMParser.
 *
 * Grenzen, bewusst so: Gelesen wird nur das erste Arbeitsblatt, und zwar die
 * gespeicherten Werte. Formeln werden nicht gerechnet — Excel legt aber zu
 * jeder Formel den zuletzt berechneten Wert mit ab, und genau der wird
 * genommen. Passwortgeschützte Dateien gehen nicht.
 */

export type Tabelle = string[][];

/* ------------------------------- ZIP lesen ------------------------------- */

const ENDE_ZENTRALVERZEICHNIS = 0x06054b50;
const ZENTRALEINTRAG = 0x02014b50;

type ZipEintrag = { name: string; offset: number; komprimiert: boolean; groesse: number };

/**
 * Läuft das Zentralverzeichnis am Dateiende ab und merkt sich, wo jeder
 * Eintrag liegt. Das ist der vorgesehene Weg — die lokalen Kopfzeilen am
 * Anfang enthalten nicht immer verlässliche Längenangaben.
 */
function zipEintraege(sicht: DataView): ZipEintrag[] {
  const laenge = sicht.byteLength;
  // Das Schlussstück ist höchstens 22 Byte plus Kommentar (max. 65535).
  let ende = -1;
  for (let i = laenge - 22; i >= Math.max(0, laenge - 22 - 65535); i--) {
    if (sicht.getUint32(i, true) === ENDE_ZENTRALVERZEICHNIS) {
      ende = i;
      break;
    }
  }
  if (ende < 0) throw new Error('Keine gültige Excel-Datei (ZIP-Ende fehlt).');

  const anzahl = sicht.getUint16(ende + 10, true);
  let pos = sicht.getUint32(ende + 16, true);
  const eintraege: ZipEintrag[] = [];

  for (let i = 0; i < anzahl; i++) {
    if (sicht.getUint32(pos, true) !== ZENTRALEINTRAG) break;
    const verfahren = sicht.getUint16(pos + 10, true);
    // Die komprimierte Länge steht nur hier verlässlich — im lokalen Kopf ist
    // sie oft 0, weil beim Schreiben noch unbekannt.
    const groesse = sicht.getUint32(pos + 20, true);
    const nameLaenge = sicht.getUint16(pos + 28, true);
    const extraLaenge = sicht.getUint16(pos + 30, true);
    const kommentarLaenge = sicht.getUint16(pos + 32, true);
    const offset = sicht.getUint32(pos + 42, true);
    const name = new TextDecoder().decode(
      new Uint8Array(sicht.buffer, sicht.byteOffset + pos + 46, nameLaenge),
    );
    eintraege.push({ name, offset, komprimiert: verfahren === 8, groesse });
    pos += 46 + nameLaenge + extraLaenge + kommentarLaenge;
  }
  return eintraege;
}

async function eintragLesen(sicht: DataView, eintrag: ZipEintrag): Promise<string> {
  const p = eintrag.offset;
  const nameLaenge = sicht.getUint16(p + 26, true);
  const extraLaenge = sicht.getUint16(p + 28, true);
  const datenAb = p + 30 + nameLaenge + extraLaenge;

  // Genau die komprimierten Bytes ausschneiden. Bis zum Dateiende zu lesen
  // und den Entpacker selbst aufhören zu lassen geht nicht: Node bricht mit
  // "trailing junk" ab, und Browser liefern dabei still verstümmelten Text.
  const roh = new Uint8Array(sicht.buffer, sicht.byteOffset + datenAb, eintrag.groesse);

  if (!eintrag.komprimiert) return new TextDecoder().decode(roh);

  const strom = new Blob([roh]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Response(strom).text();
}

/* ------------------------------ XLSX lesen ------------------------------- */

/** Spaltenbuchstaben in einen Index: A→0, B→1, AA→26 */
function spaltenIndex(zelle: string): number {
  const buchstaben = zelle.replace(/\d+$/, '');
  let n = 0;
  for (const c of buchstaben) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}

async function xlsxLesen(datei: File): Promise<Tabelle> {
  const sicht = new DataView(await datei.arrayBuffer());
  const eintraege = zipEintraege(sicht);

  const blatt =
    eintraege.find((e) => /^xl\/worksheets\/sheet1\.xml$/.test(e.name)) ??
    eintraege.find((e) => /^xl\/worksheets\/.*\.xml$/.test(e.name));
  if (!blatt) throw new Error('In der Datei ist kein Arbeitsblatt zu finden.');

  // Texte liegen zentral in sharedStrings.xml, die Zellen verweisen per Index.
  const textEintrag = eintraege.find((e) => e.name === 'xl/sharedStrings.xml');
  const texte: string[] = [];
  if (textEintrag) {
    const xml = new DOMParser().parseFromString(await eintragLesen(sicht, textEintrag), 'text/xml');
    for (const si of xml.getElementsByTagName('si')) {
      // Ein Eintrag kann in mehrere <t> zerfallen, wenn Teile anders formatiert sind.
      texte.push([...si.getElementsByTagName('t')].map((t) => t.textContent ?? '').join(''));
    }
  }

  const xml = new DOMParser().parseFromString(await eintragLesen(sicht, blatt), 'text/xml');
  const zeilen: Tabelle = [];

  for (const row of xml.getElementsByTagName('row')) {
    const werte: string[] = [];
    for (const c of row.getElementsByTagName('c')) {
      const spalte = spaltenIndex(c.getAttribute('r') ?? '');
      const typ = c.getAttribute('t');
      let wert = '';
      if (typ === 's') {
        const index = Number(c.getElementsByTagName('v')[0]?.textContent ?? -1);
        wert = texte[index] ?? '';
      } else if (typ === 'inlineStr') {
        wert = [...c.getElementsByTagName('t')].map((t) => t.textContent ?? '').join('');
      } else {
        wert = c.getElementsByTagName('v')[0]?.textContent ?? '';
      }
      // Leere Zellen werden in der Datei ausgelassen — Lücken auffüllen.
      while (werte.length < spalte) werte.push('');
      werte[spalte] = wert.trim();
    }
    if (werte.some((w) => w !== '')) zeilen.push(werte);
  }

  return zeilen;
}

/* ------------------------------- CSV lesen ------------------------------- */

/**
 * Erkennt den Trenner selbst: Semikolon, Tabulator oder Komma — je nachdem,
 * was in der ersten Zeile am häufigsten vorkommt. Deutsche Excel-Versionen
 * schreiben Semikolon, englische Komma.
 */
export function csvLesen(text: string): Tabelle {
  const ohneBom = text.replace(/^﻿/, '');
  const ersteZeile = ohneBom.split(/\r?\n/)[0] ?? '';
  const trenner = ([';', '\t', ','] as const)
    .map((t) => ({ t, n: ersteZeile.split(t).length }))
    .sort((a, b) => b.n - a.n)[0].t;

  const zeilen: Tabelle = [];
  let feld = '';
  let zeile: string[] = [];
  let inAnfuehrung = false;

  for (let i = 0; i < ohneBom.length; i++) {
    const z = ohneBom[i];
    if (inAnfuehrung) {
      if (z === '"') {
        if (ohneBom[i + 1] === '"') {
          feld += '"';
          i++;
        } else inAnfuehrung = false;
      } else feld += z;
      continue;
    }
    if (z === '"') inAnfuehrung = true;
    else if (z === trenner) {
      zeile.push(feld.trim());
      feld = '';
    } else if (z === '\n') {
      zeile.push(feld.trim());
      if (zeile.some((f) => f !== '')) zeilen.push(zeile);
      zeile = [];
      feld = '';
    } else if (z !== '\r') feld += z;
  }
  zeile.push(feld.trim());
  if (zeile.some((f) => f !== '')) zeilen.push(zeile);

  return zeilen;
}

/* -------------------------------- Einstieg ------------------------------- */

export async function dateiLesen(datei: File): Promise<Tabelle> {
  const name = datei.name.toLowerCase();

  if (name.endsWith('.xlsx')) return xlsxLesen(datei);
  if (name.endsWith('.csv') || name.endsWith('.txt')) return csvLesen(await datei.text());

  if (name.endsWith('.xls')) {
    throw new Error(
      'Das alte .xls-Format wird nicht gelesen. In Excel bitte als .xlsx oder .csv speichern.',
    );
  }
  throw new Error(`„${datei.name}" wird nicht unterstützt. Erlaubt sind .xlsx, .csv und .txt.`);
}
