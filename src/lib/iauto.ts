import type { Format } from '@/data/formats';

/**
 * Übergabe an die IAuto-Software von Unnatek.
 *
 * ACHTUNG — Annahme, nicht bestätigt: Das Format hier ist eine CSV mit einer
 * Zeile je Empfänger (Semikolon getrennt, UTF-8 mit BOM, damit Excel die
 * Umlaute richtig liest). Das ist der bei Schreibrobotern übliche Weg, aber
 * die Import-Maske der IAuto-Software wurde noch nicht geprüft.
 *
 * Alles Formatspezifische steckt bewusst nur in dieser Datei. Sollte IAuto
 * stattdessen SVG-Pfade, HPGL oder PDF erwarten, wird hier getauscht — der
 * Rest des Portals bleibt unberührt.
 */

export type Empfaenger = {
  id: string;
  vorname: string;
  nachname: string;
  strasse: string;
  plz: string;
  ort: string;
  land: string;
};

export type Auftrag = {
  projektname: string;
  format: Format;
  /** Text mit Platzhaltern wie [Vorname] */
  vorlage: string;
  empfaenger: Empfaenger[];
};

export const LEERER_EMPFAENGER = (): Empfaenger => ({
  id: crypto.randomUUID(),
  vorname: '',
  nachname: '',
  strasse: '',
  plz: '',
  ort: '',
  land: 'Österreich',
});

/** Ersetzt die Platzhalter für einen konkreten Empfänger. */
export function textFuer(vorlage: string, e: Empfaenger): string {
  return vorlage
    .replace(/\[Vorname\]/g, e.vorname || '[Vorname]')
    .replace(/\[Nachname\]/g, e.nachname || '[Nachname]')
    .replace(/\[Ort\]/g, e.ort || '[Ort]');
}

const SPALTEN = [
  'Vorname',
  'Nachname',
  'Strasse',
  'PLZ',
  'Ort',
  'Land',
  'Format',
  'Breite_mm',
  'Hoehe_mm',
  'Text',
] as const;

/** Maße je Format — die IAuto-Software braucht sie in Millimetern. */
const MASSE: Record<string, [number, number]> = {
  A6: [148, 105],
  DIN_LANG: [220, 110],
  C5: [229, 162],
  C4: [324, 229],
};

function feld(wert: string): string {
  // Semikolon, Anführungszeichen und Zeilenumbrüche müssen maskiert werden,
  // sonst zerreißt eine mehrzeilige Nachricht die Tabelle.
  const s = wert.replace(/"/g, '""');
  return /[";\n\r]/.test(s) ? `"${s}"` : s;
}

export function alsCsv(auftrag: Auftrag): string {
  const [breite, hoehe] = MASSE[auftrag.format.id] ?? [0, 0];
  const zeilen = [SPALTEN.join(';')];

  for (const e of auftrag.empfaenger) {
    zeilen.push(
      [
        e.vorname,
        e.nachname,
        e.strasse,
        e.plz,
        e.ort,
        e.land,
        auftrag.format.id,
        String(breite),
        String(hoehe),
        textFuer(auftrag.vorlage, e),
      ]
        .map(feld)
        .join(';'),
    );
  }

  // BOM voran, sonst zeigt Excel "Ã¼" statt "ü".
  return '﻿' + zeilen.join('\r\n') + '\r\n';
}

export function dateinameFuer(projektname: string): string {
  const sauber = projektname
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' })[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const datum = new Date().toISOString().slice(0, 10);
  return `${sauber || 'projekt'}_${datum}.csv`;
}

/** Löst den Download aus, ohne die Datei irgendwohin zu senden. */
export function csvHerunterladen(auftrag: Auftrag): void {
  const blob = new Blob([alsCsv(auftrag)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = dateinameFuer(auftrag.projektname);
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Wandelt Tabellenzeilen in Empfänger.
 *
 * Erwartete Spaltenfolge: Vorname, Nachname, Straße, PLZ, Ort, Land.
 * Eine Kopfzeile wird erkannt und übersprungen, ebenso leere Zeilen.
 */
export function empfaengerAusZeilen(zeilen: string[][]): Empfaenger[] {
  return zeilen
    .map((teile) => {
      const [vorname = '', nachname = '', strasse = '', plz = '', ort = '', land = ''] = teile.map(
        (t) => (t ?? '').trim(),
      );
      return {
        ...LEERER_EMPFAENGER(),
        vorname,
        nachname,
        strasse,
        plz,
        ort,
        land: land || 'Österreich',
      };
    })
    .filter((e) => e.vorname || e.nachname)
    .filter((e) => !/^(vorname|first ?name)$/i.test(e.vorname));
}

/**
 * Liest eine eingefügte Empfängerliste (Zwischenablage).
 *
 * Erlaubt sind Tabulator, Semikolon und Komma als Trenner — je nachdem,
 * woraus kopiert wurde. Aus Excel kommen Tabulatoren.
 */
export function empfaengerAusText(eingabe: string): Empfaenger[] {
  const zeilen = eingabe
    .split(/\r?\n/)
    .map((z) => z.trim())
    .filter(Boolean)
    .map((zeile) => zeile.split(/\t|;|,(?=\s*\S)/));
  return empfaengerAusZeilen(zeilen);
}
