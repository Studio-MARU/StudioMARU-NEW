/**
 * Bestellbare Papierformate nach Vorgaben der Österreichischen Post.
 *
 * `ratio`  – Breite geteilt durch Höhe; steuert die Live-Vorschau.
 * `type`   – bestimmt das Layout der Rückseite:
 *            `postcard` = Text links, Adressfeld rechts
 *            `letter`   = Text auf der Vorderseite, Rückseite leer
 */

export type FormatType = 'postcard' | 'letter';

export type Format = {
  id: string;
  name: string;
  ratio: number;
  type: FormatType;
  /** Gesamtfläche einer Seite in cm² — Grundlage für die Textlänge. */
  flaecheCm2: number;
};

export const FORMATS: Format[] = [
  { id: 'A6', name: 'A6 Postkarte (148x105mm)', ratio: 1.414, type: 'postcard', flaecheCm2: 155 },
  { id: 'DIN_LANG', name: 'DIN Lang (220x110mm)', ratio: 2, type: 'postcard', flaecheCm2: 242 },
  { id: 'C5', name: 'C5 Brief (229x162mm)', ratio: 1.414, type: 'letter', flaecheCm2: 371 },
  { id: 'C4', name: 'C4 Maxi-Brief (324x229mm)', ratio: 1.414, type: 'letter', flaecheCm2: 742 },
];

/**
 * Wie viele Zeichen handgeschrieben auf das Format passen.
 *
 * Erfahrungswert: rund 1,5 Zeichen pro Quadratzentimeter beschreibbarer
 * Fläche. Bei der Postkarte steht nur die linke Hälfte der Rückseite zur
 * Verfügung, die rechte gehört Adresse und Frankierung.
 */
export function textLimit(format: Format): number {
  const beschreibbar = format.type === 'postcard' ? format.flaecheCm2 / 2 : format.flaecheCm2;
  return Math.round(beschreibbar * 1.5);
}
