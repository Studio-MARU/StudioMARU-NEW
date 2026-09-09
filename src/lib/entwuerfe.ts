import type { Empfaenger } from './iauto';

/**
 * Entwürfe von Projekten.
 *
 * Gespeichert wird im localStorage des Browsers — es gibt noch keinen Server.
 * Das heißt: Entwürfe liegen nur auf diesem Gerät und in diesem Browser. Wer
 * den Rechner wechselt, sieht sie nicht. Sobald ein Backend da ist, wird nur
 * dieses Modul ersetzt.
 */

const SCHLUESSEL = 'studio-maru.entwuerfe';

/**
 * `entwurf`   — in Arbeit, noch nichts geschrieben worden
 * `kampagne`  — tatsächlich beauftragt und verschickt
 *
 * Der Unterschied ist rein redaktionell: Auch eine Kampagne bleibt
 * bearbeitbar, sie ist nur als bereits gelaufen gekennzeichnet.
 */
export type Status = 'entwurf' | 'kampagne';

export type Entwurf = {
  id: string;
  projektname: string;
  formatId: string;
  designArt: 'template' | 'upload';
  vorlage: string;
  empfaenger: Empfaenger[];
  status: Status;
  /** ISO-Datum, an dem daraus eine echte Kampagne wurde */
  beauftragtAm?: string;
  /** ISO-Zeitstempel der letzten Änderung */
  geaendert: string;
};

function lesen(): Entwurf[] {
  try {
    const roh = localStorage.getItem(SCHLUESSEL);
    if (!roh) return [];
    const daten = JSON.parse(roh);
    if (!Array.isArray(daten)) return [];
    // Projekte, die vor der Status-Unterscheidung gespeichert wurden,
    // gelten als Entwurf.
    return (daten as Entwurf[]).map((e) => ({ ...e, status: e.status ?? 'entwurf' }));
  } catch {
    // Kaputter oder gesperrter Speicher darf das Portal nicht lahmlegen.
    return [];
  }
}

function schreiben(entwuerfe: Entwurf[]): boolean {
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(entwuerfe));
    return true;
  } catch {
    return false;
  }
}

/** Neueste zuerst. */
export function alleEntwuerfe(): Entwurf[] {
  return lesen().sort((a, b) => b.geaendert.localeCompare(a.geaendert));
}

/** Legt an oder überschreibt anhand der id. Gibt false zurück, wenn der Speicher voll ist. */
export function entwurfSichern(entwurf: Omit<Entwurf, 'geaendert'>): boolean {
  const bestand = lesen().filter((e) => e.id !== entwurf.id);
  return schreiben([...bestand, { ...entwurf, geaendert: new Date().toISOString() }]);
}

export function entwurfLoeschen(id: string): void {
  schreiben(lesen().filter((e) => e.id !== id));
}

export function entwurfHolen(id: string): Entwurf | undefined {
  return lesen().find((e) => e.id === id);
}

/** Macht aus einem Entwurf eine gelaufene Kampagne — oder wieder zurück. */
export function statusSetzen(id: string, status: Status): void {
  const bestand = lesen();
  const treffer = bestand.find((e) => e.id === id);
  if (!treffer) return;
  treffer.status = status;
  treffer.beauftragtAm = status === 'kampagne' ? new Date().toISOString() : undefined;
  treffer.geaendert = new Date().toISOString();
  schreiben(bestand);
}
