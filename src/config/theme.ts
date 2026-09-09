/**
 * Die wiederkehrenden Design-Bausteine als benannte Klassen-Strings.
 *
 * Warum hier und nicht direkt im JSX? Weil dieselbe Kombination aus
 * ~15 Tailwind-Klassen sonst an 20 Stellen dupliziert steht und eine
 * Design-Änderung 20 Edits bräuchte.
 *
 * Die `dark:`-Klassen greifen nur im Kundenportal — die Variante ist in
 * src/index.css an `.dark-mode-active` gebunden. Auf den öffentlichen
 * Seiten sind sie wirkungslos.
 */

/** Der Grundton der Seite — helles Grau statt reinem Weiß. */
export const PAPER = '#EBEBEB';

/** Text-/Icon-Farbe auf schwarzem Grund (nie reines Weiß). */
export const INK_INVERSE = '#EBEBEB';

/* ------------------------------ Pill-Buttons ----------------------------- */

/** Gemeinsame Basis aller Pill-Buttons. */
export const pillBase =
  'rounded-full flex items-center justify-center font-bold uppercase transition-colors';

/**
 * Schwarzer Rahmen, transparent — füllt sich bei Hover/Tap schwarz.
 * Dunkel dreht sich das um: heller Rahmen, füllt sich hell.
 */
export const pillOutline = [
  'bg-transparent border-2 border-black text-black',
  'hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB]',
  'dark:border-[#EBEBEB] dark:text-[#EBEBEB]',
  'dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] dark:active:bg-[#EBEBEB] dark:active:text-[#141414]',
].join(' ');

/** Umgekehrt: gefüllt. */
export const pillSolid = [
  'bg-black text-[#EBEBEB] hover:bg-gray-900',
  'dark:bg-[#EBEBEB] dark:text-[#141414] dark:hover:bg-white',
].join(' ');

/** Standardgröße der großen Aktions-Buttons. */
export const pillLarge = 'px-8 py-5 text-sm tracking-[0.15em]';

/** Kompakte Variante (Dashboard-Navigation). */
export const pillCompact = 'px-6 py-4 text-xs tracking-[0.15em]';

/* -------------------------- Flächen im Portal --------------------------- */

/** Milchglas-Karte — die Fläche selbst kommt aus `.section-glass`. */
export const glassCard =
  'section-glass rounded-3xl shadow-sm border border-white/50 dark:border-white/10';

/** Erhobene Fläche: Eingabefelder, Platzhalter, Bildkacheln. */
export const surfaceRaised = 'bg-white/50 dark:bg-white/[0.06]';

/** Rahmen innerhalb einer Karte. */
export const borderSubtle = 'border-white/50 dark:border-white/10';

/* --------------------------------- Text ---------------------------------- */

/** Überschriften. */
export const textStrong = 'text-gray-900 dark:text-[#EBEBEB]';

/** Fließtext. */
export const textBody = 'text-gray-700 dark:text-[#c9c9c9]';

/** Nebeninformation, Datumsangaben, Beschriftungen. */
export const textMuted = 'text-gray-500 dark:text-[#a3a3a3]';
