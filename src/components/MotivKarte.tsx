import type { Beispiel } from '@/data/examples';
import { FORMATS } from '@/data/formats';

/**
 * Stellt ein Beispielprojekt als Karte dar — Vorder- und Rückseite.
 *
 * Liegen echte Scans vor, werden die gezeigt. Sonst wird die Karte aus ihren
 * Daten gerendert: vorne ein ruhiges Farbfeld mit dem Namen des Kunden,
 * hinten der handgeschriebene Text neben dem Adressfeld.
 *
 * Alle Maße in `cqi` (Prozent der Kartenbreite), damit die Karte in jeder
 * Größe gleich aussieht.
 */

const PAPIER = '#fdfbf7';

export function MotivVorderseite({ beispiel }: { beispiel: Beispiel }) {
  const motiv = beispiel.bildVorne ?? beispiel.cover;

  // Wie eine gedruckte Postkarte: Das Motiv füllt die ganze Fläche, der Name
  // steht oben als Beschriftung über einem sanften Verlauf, damit er auf
  // jedem Motiv lesbar bleibt — auch auf einem hellen Foto.
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: beispiel.farbe, containerType: 'inline-size' }}
    >
      {motiv && (
        <img
          src={motiv}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Abdunklung nur im oberen Bereich — sie trägt die Beschriftung. */}
      <div
        className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/45 to-transparent pointer-events-none"
        style={{ height: '38cqi' }}
      />

      <div className="absolute inset-x-0 top-0 text-center" style={{ paddingTop: '7cqi' }}>
        <span
          className="font-bold uppercase text-white block leading-none"
          style={{ fontSize: '3.4cqi', letterSpacing: '0.26em' }}
        >
          {beispiel.titel}
        </span>
        <div
          className="mx-auto bg-white/50"
          style={{ width: '13cqi', height: '1px', marginTop: '3.5cqi' }}
        />
      </div>
    </div>
  );
}

export function MotivRueckseite({ beispiel }: { beispiel: Beispiel }) {
  if (beispiel.bildHinten) {
    return (
      <img
        src={beispiel.bildHinten}
        alt={`${beispiel.titel} — Rückseite`}
        className="w-full h-full object-cover"
      />
    );
  }

  const format = FORMATS.find((f) => f.id === beispiel.formatId) ?? FORMATS[0];
  const text = beispiel.text.replace(/\[Vorname\]/g, 'Anna');

  // Beim Brief füllt der Text die ganze Seite, bei der Postkarte nur die linke Hälfte.
  if (format.type === 'letter') {
    return (
      <div
        className="w-full h-full overflow-hidden"
        style={{ background: PAPIER, containerType: 'size' }}
      >
        <div
          className="w-full h-full font-['Caveat'] text-blue-900 whitespace-pre-wrap overflow-hidden"
          style={{ padding: '7cqi', fontSize: 'min(4.2cqi, 7cqh)', lineHeight: 1.5 }}
        >
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex" style={{ background: PAPIER, containerType: 'inline-size' }}>
      {/* Die Schrift muss sich an Breite UND Höhe der Schreibhälfte orientieren.
          Bei DIN Lang ist diese Hälfte fast quadratisch — nur an der Breite
          gemessen liefe der Text unten aus der Karte.

          Der Größen-Container ist bewusst das äußere Element: Ein Element kann
          seinen eigenen Container nicht abfragen, cqi/cqh würden sonst gegen
          die ganze Karte rechnen. */}
      <div className="w-1/2 h-full border-r-2 border-dashed border-gray-400" style={{ containerType: 'size' }}>
        <div
          className="w-full h-full font-['Caveat'] text-blue-900 whitespace-pre-wrap overflow-hidden"
          style={{ padding: '8cqi', fontSize: 'min(8.5cqi, 6.5cqh)', lineHeight: 1.5 }}
        >
          {text}
        </div>
      </div>
      <div className="w-1/2 h-full relative flex flex-col justify-end" style={{ padding: '4cqi' }}>
        <div
          className="absolute border-2 border-gray-300 flex items-center justify-center"
          style={{ top: '4cqi', right: '4cqi', width: '12cqi', height: '16cqi' }}
        >
          <span className="text-gray-400 text-center" style={{ fontSize: '2cqi' }}>
            Frankierung
          </span>
        </div>
        <div
          className="w-4/5 ml-auto flex flex-col justify-between"
          style={{ height: '20cqi', marginBottom: '4cqi' }}
        >
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-gray-400" />
          <div className="w-full h-px bg-gray-400" />
        </div>
      </div>
    </div>
  );
}

/**
 * Beide Seiten übereinander — die Rückseite erscheint bei Hover, Tap oder
 * Tastaturfokus. Der Hinweis oben rechts verschwindet dabei.
 */
export function WendeKarte({ beispiel, className = '' }: { beispiel: Beispiel; className?: string }) {
  return (
    <div
      tabIndex={0}
      className={`relative overflow-hidden rounded-2xl outline-none group cursor-pointer bg-gray-200 dark:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-black/40 dark:focus-visible:ring-white/40 ${className}`}
      aria-label={`${beispiel.titel} — Vorder- und Rückseite`}
    >
      <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0">
        <MotivVorderseite beispiel={beispiel} />
      </div>
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100">
        <MotivRueckseite beispiel={beispiel} />
      </div>
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full pointer-events-none transition-opacity duration-500 group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0">
        Tap / Hover
      </div>
    </div>
  );
}
