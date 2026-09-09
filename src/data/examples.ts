/**
 * Beispielprojekte für den Portal-Reiter "Beispiele" und die Portfolio-Seite.
 *
 * Die Vorderseite zeigt, was vorhanden ist — in dieser Reihenfolge:
 *   1. `bildVorne`  echtes Foto oder Scan
 *   2. `cover`      gezeichnetes Motiv
 *   3. sonst nur die Grundfarbe
 *
 * Die Rückseite zeigt `bildHinten`, falls es einen Scan gibt, sonst wird der
 * handgeschriebene Text auf Papier gerendert (siehe MotivKarte).
 */

export type Beispiel = {
  id: string;
  titel: string;
  /** Branche des Kunden — erscheint als Etikett */
  branche: string;
  /** Wofür die Karte eingesetzt wurde */
  anlass: string;
  /** Format-ID aus src/data/formats.ts */
  formatId: string;
  /** Der handgeschriebene Text auf der Karte */
  text: string;
  /** Grundton, wenn kein Foto vorliegt */
  farbe: string;
  /** Gezeichnetes Motiv der Vorderseite (weiße Linien, transparent) */
  cover?: string;
  /** Foto oder Scan der Vorderseite — hat Vorrang vor `cover` */
  bildVorne?: string;
  /** Scan der Rückseite — ohne ihn wird der Text gerendert */
  bildHinten?: string;
  beschreibung: string;
  /** Ergebnis in einem Satz — bewusst als Erfahrungswert formuliert */
  ergebnis?: string;
};

export const beispiele: Beispiel[] = [
  {
    id: 'almis-berghotel',
    titel: "Almi's Berghotel",
    branche: 'Hotellerie',
    anlass: 'Nach dem Aufenthalt',
    formatId: 'A6',
    text: 'Liebe Anna,\n\nschön, dass du bei uns warst!\nBeim nächsten Mal laden wir dich\nauf Kaffee & Kuchen ein.\n\nDeine Almi',
    farbe: '#5b6b4a',
    beschreibung:
      'Eine persönliche Postkarte an Gäste nach einer Alpenüberquerung. Die handgeschriebene Nachricht lädt zu Kaffee & Kuchen ein und stärkt die Kundenbindung auf eine sehr persönliche Art.',
    ergebnis: 'Deutlich mehr Wiederbuchungen als über den bisherigen E-Mail-Newsletter.',
    bildVorne: '/almis-front.png',
    bildHinten: '/almis-back.png',
  },
  {
    id: 'tiroler-weinhof',
    titel: 'Tiroler Weinhof',
    branche: 'Direktvermarktung',
    anlass: 'Beileger zur Bestellung',
    formatId: 'A6',
    text: 'Liebe/r [Vorname],\n\ndieser Jahrgang hat uns Nerven\ngekostet — dafür schmeckt er umso\nbesser. Lass ihn vor dem Öffnen\neine Stunde stehen.\n\nAuf dein Wohl!\nFamilie Tiroler',
    farbe: '#6b3a4a',
    bildVorne: '/covers/tiroler-weinhof.jpg',
    beschreibung:
      'Jeder Weinkiste liegt eine handgeschriebene Karte bei. Statt eines gedruckten Dankesschreibens bekommt der Kunde einen echten Gruß vom Hof — mit einem Tipp, der zeigt, dass jemand mitgedacht hat.',
    ergebnis: 'Aus Erstbestellern wurden spürbar häufiger Stammkunden.',
  },
  {
    id: 'atelier-nord',
    titel: 'Atelier Nord',
    branche: 'Architektur',
    anlass: 'Einladung zur Eröffnung',
    formatId: 'DIN_LANG',
    text: 'Liebe/r [Vorname],\n\nwir haben zwei Jahre daran gebaut.\nAm 14. Juni öffnen wir die Türen —\nund würden uns freuen,\nwenn du dabei bist.\n\nAtelier Nord',
    farbe: '#2f4858',
    bildVorne: '/covers/atelier-nord.jpg',
    beschreibung:
      'Einladung zur Eröffnung eines Neubaus. Das schmale DIN-Lang-Format nimmt die Proportion des Gebäudes auf. Handgeschrieben, weil eine Einladung, die jemand selbst geschrieben hat, schwerer wiegt als eine gedruckte.',
    ergebnis: 'Rücklaufquote weit über der einer vergleichbaren E-Mail-Einladung.',
  },
  {
    id: 'praxis-lechner',
    titel: 'Praxis Dr. Lechner',
    branche: 'Gesundheit',
    anlass: 'Genesungswünsche',
    formatId: 'C5',
    text: 'Liebe/r [Vorname],\n\nder Eingriff ist gut verlaufen.\nGönnen Sie sich die Ruhe, die\nes jetzt braucht — und melden\nSie sich, wenn etwas unklar ist.\n\nHerzlich,\nIhr Praxisteam',
    farbe: '#3f5f52',
    bildVorne: '/covers/praxis-lechner.jpg',
    beschreibung:
      'Ein handgeschriebener Brief einige Tage nach dem Eingriff. Kein Marketing, sondern Nachsorge — genau deshalb wird er aufgehoben und weitererzählt.',
    ergebnis: 'Auffällig viele Weiterempfehlungen im persönlichen Umfeld der Patienten.',
  },
];
