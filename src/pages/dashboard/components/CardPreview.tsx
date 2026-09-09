import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Maximize, Minimize, Minus, Plus, RotateCcw } from 'lucide-react';
import type { Format } from '@/data/formats';

/**
 * Frei drehbare 3D-Vorschau der Postkarte bzw. des Briefs.
 *
 * Aufbau: Vorder- und Rückseite liegen als Ebenen übereinander, die Rückseite
 * um 180° vorgedreht. `backface-visibility: hidden` blendet die jeweils
 * abgewandte Seite aus. Dazu vier schmale Flächen als Papierkante, damit die
 * Karte von der Seite nicht verschwindet.
 *
 * Alle Innenmaße stehen in `cqi` (Prozent der Kartenbreite) — dadurch bleibt
 * das Layout in jeder Größe maßstabsgetreu, auch im Vollbild.
 */

/** Grad Drehung pro Pixel Mauszug. */
const DRAG_SENSITIVITY = 0.5;

/** Papierdicke in Prozent der Kartenbreite. */
const PAPIER_DICKE_CQI = 0.45;

/** Weiter als so darf die Karte nicht gekippt werden, sonst steht sie kopf. */
const MAX_NEIGUNG = 55;

const ZOOM_MIN = 0.6;
const ZOOM_MAX = 2.2;
const ZOOM_SCHRITT = 0.15;

type Props = {
  format: Format;
  /** Text mit bereits ersetzten Platzhaltern */
  previewText: string;
  designType: 'template' | 'upload';
  frontImage: string | null;
  backImage: string | null;
};

export default function CardPreview({
  format,
  previewText,
  designType,
  frontImage,
  backImage,
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-8);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const last = useRef({ x: 0, y: 0 });
  const buehne = useRef<HTMLDivElement>(null);

  const klemmen = (wert: number) => Math.max(-MAX_NEIGUNG, Math.min(MAX_NEIGUNG, wert));

  const onPointerDown = (e: PointerEvent) => {
    setIsDragging(true);
    last.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    setRotY((prev) => prev + (e.clientX - last.current.x) * DRAG_SENSITIVITY);
    setRotX((prev) => klemmen(prev - (e.clientY - last.current.y) * DRAG_SENSITIVITY));
    last.current = { x: e.clientX, y: e.clientY };
  };

  const onPointerUp = (e: PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  /**
   * Zoom per Mausrad.
   *
   * React hängt `wheel` passiv ein, dort verpufft preventDefault — die Seite
   * würde beim Zoomen mitscrollen. Deshalb der eigene Zuhörer mit
   * `passive: false`.
   */
  useEffect(() => {
    const el = buehne.current;
    if (!el) return;
    const beiRad = (e: globalThis.WheelEvent) => {
      e.preventDefault();
      setZoom((z) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z - e.deltaY * 0.0015)));
    };
    el.addEventListener('wheel', beiRad, { passive: false });
    return () => el.removeEventListener('wheel', beiRad);
  }, []);

  // Auf die nächstgelegene halbe Umdrehung schnappen — die Karte dreht dabei
  // immer den kürzesten Weg weiter, statt zurückzuspringen.
  const seiteZeigen = useCallback(
    (seite: 'front' | 'back') => {
      const runden = Math.round(rotY / 360);
      setRotY(seite === 'front' ? runden * 360 : runden * 360 + 180);
      setRotX(-8);
    },
    [rotY],
  );

  const zuruecksetzen = () => {
    setRotY(0);
    setRotX(-8);
    setZoom(1);
  };

  const normalized = ((rotY % 360) + 360) % 360;
  const isFrontVisible = normalized < 90 || normalized > 270;

  // Tastatur: Pfeile drehen, +/− zoomen, R setzt zurück, Esc verlässt Vollbild.
  const onKeyDown = (e: ReactKeyboardEvent) => {
    const schritt = e.shiftKey ? 45 : 15;
    const tasten: Record<string, () => void> = {
      ArrowLeft: () => setRotY((v) => v - schritt),
      ArrowRight: () => setRotY((v) => v + schritt),
      ArrowUp: () => setRotX((v) => klemmen(v + schritt)),
      ArrowDown: () => setRotX((v) => klemmen(v - schritt)),
      '+': () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_SCHRITT)),
      '-': () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_SCHRITT)),
      r: zuruecksetzen,
      R: zuruecksetzen,
      f: () => seiteZeigen('front'),
      b: () => seiteZeigen('back'),
    };
    const aktion = tasten[e.key];
    if (aktion) {
      e.preventDefault();
      aktion();
    }
  };

  // Vollbild per Escape verlassen und dabei den Hintergrund nicht scrollen lassen.
  useEffect(() => {
    if (!isFullscreen) return;
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    document.addEventListener('keydown', beiTaste);
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.body.style.overflow = vorher;
    };
  }, [isFullscreen]);

  // Im Vollbild bekommt die Bühne den Fokus, damit die Pfeiltasten sofort greifen.
  useEffect(() => {
    if (isFullscreen) buehne.current?.focus();
  }, [isFullscreen]);

  const panel = (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-gray-100/95 dark:bg-[#0f0f0f]/95 backdrop-blur-md p-4 md:p-12 flex flex-col'
          : 'section-glass p-6 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 flex flex-col h-full'
      }
    >
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-[#a3a3a3]">
          Live Vorschau {isFullscreen && '— Vollbild'}
        </h3>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <div className="flex gap-2">
            <SeitenSchalter aktiv={isFrontVisible} onClick={() => seiteZeigen('front')}>
              Vorderseite
            </SeitenSchalter>
            <SeitenSchalter aktiv={!isFrontVisible} onClick={() => seiteZeigen('back')}>
              Rückseite
            </SeitenSchalter>
          </div>

          <div className="flex items-center gap-1">
            <RundKnopf
              onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_SCHRITT))}
              title="Verkleinern"
              disabled={zoom <= ZOOM_MIN}
            >
              <Minus size={15} strokeWidth={2.5} />
            </RundKnopf>
            <RundKnopf
              onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_SCHRITT))}
              title="Vergrößern"
              disabled={zoom >= ZOOM_MAX}
            >
              <Plus size={15} strokeWidth={2.5} />
            </RundKnopf>
            <RundKnopf onClick={zuruecksetzen} title="Ansicht zurücksetzen">
              <RotateCcw size={15} strokeWidth={2.5} />
            </RundKnopf>
            <RundKnopf
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Vollbild verlassen (Esc)' : 'Vollbild'}
            >
              {isFullscreen ? <Minimize size={15} strokeWidth={2.5} /> : <Maximize size={15} strokeWidth={2.5} />}
            </RundKnopf>
          </div>
        </div>
      </div>

      <div
        ref={buehne}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="img"
        aria-label={`3D-Vorschau: ${format.name}, ${isFrontVisible ? 'Vorderseite' : 'Rückseite'}. Mit den Pfeiltasten drehen.`}
        className="flex-1 flex items-center justify-center bg-gray-100/50 dark:bg-black/20 rounded-2xl p-4 overflow-hidden min-h-[400px] lg:min-h-[520px] outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40"
        style={{ perspective: '1400px' }}
      >
        <div
          className="relative shadow-2xl cursor-grab active:cursor-grabbing touch-none"
          style={{
            aspectRatio: format.ratio,
            // Querformat an der Breite ausrichten, Hochformat an der Höhe.
            width: format.ratio >= 1 ? (isFullscreen ? '70%' : '100%') : 'auto',
            height: format.ratio >= 1 ? 'auto' : isFullscreen ? '70%' : '100%',
            maxHeight: '100%',
            maxWidth: '100%',
            transformStyle: 'preserve-3d',
            transform: `scale(${zoom}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <Vorderseite
            format={format}
            designType={designType}
            frontImage={frontImage}
            previewText={previewText}
          />
          <Rueckseite
            format={format}
            previewText={previewText}
            designType={designType}
            backImage={backImage}
          />
          <Papierkante />
        </div>
      </div>

      <div className="text-center mt-4 text-xs text-gray-400 dark:text-[#8a8a8a] leading-relaxed">
        Ziehen zum Drehen · Mausrad zoomt · Pfeiltasten drehen, <kbd>R</kbd> setzt zurück
        <br />
        Maßstab: {format.name} · {Math.round(zoom * 100)} %
      </div>
    </div>
  );

  // Im Vollbild direkt in den Body: <main> bildet einen eigenen Stapelkontext,
  // die Vorschau läge sonst hinter der Sidebar statt darüber.
  return isFullscreen ? createPortal(panel, document.body) : panel;
}

/* ------------------------------ Bedienelemente ---------------------------- */

function SeitenSchalter({
  aktiv,
  onClick,
  children,
}: {
  aktiv: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold rounded-full transition-colors border-2 ${
        aktiv
          ? 'bg-black text-[#EBEBEB] border-black dark:bg-[#EBEBEB] dark:text-[#141414] dark:border-[#EBEBEB]'
          : 'bg-transparent border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]'
      }`}
    >
      {children}
    </button>
  );
}

function RundKnopf({
  onClick,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  title: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className="w-9 h-9 flex items-center justify-center rounded-full bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black disabled:cursor-not-allowed transition-colors dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] dark:disabled:hover:bg-transparent dark:disabled:hover:text-[#EBEBEB]"
    >
      {children}
    </button>
  );
}

/* --------------------------------- Karte ---------------------------------- */

const PAPIER = '#fdfbf7';
const FLAECHE = 'absolute inset-0 w-full h-full overflow-hidden rounded-md';
const HANDSCHRIFT = "font-['Caveat'] text-blue-900 whitespace-pre-wrap overflow-hidden";

/**
 * Die vier Schnittkanten des Papiers. Ohne sie wird die Karte beim Drehen
 * für einen Moment unsichtbar, weil zwei unendlich dünne Ebenen aufeinander
 * liegen.
 */
function Papierkante() {
  const d = `${PAPIER_DICKE_CQI}cqi`;
  const halb = `${PAPIER_DICKE_CQI / 2}cqi`;
  const kante = 'absolute bg-[#e8e2d6]';
  return (
    <>
      <div
        className={kante}
        style={{ inset: `0 0 auto 0`, height: d, transform: `rotateX(90deg) translateZ(${halb})`, transformOrigin: 'top' }}
      />
      <div
        className={kante}
        style={{ inset: `auto 0 0 0`, height: d, transform: `rotateX(-90deg) translateZ(${halb})`, transformOrigin: 'bottom' }}
      />
      <div
        className={kante}
        style={{ inset: `0 auto 0 0`, width: d, transform: `rotateY(-90deg) translateZ(${halb})`, transformOrigin: 'left' }}
      />
      <div
        className={kante}
        style={{ inset: `0 0 0 auto`, width: d, transform: `rotateY(90deg) translateZ(${halb})`, transformOrigin: 'right' }}
      />
    </>
  );
}

function Vorderseite({
  format,
  designType,
  frontImage,
  previewText,
}: {
  format: Format;
  designType: 'template' | 'upload';
  frontImage: string | null;
  previewText: string;
}) {
  return (
    <div
      className={FLAECHE}
      style={{
        backfaceVisibility: 'hidden',
        containerType: 'inline-size',
        background: PAPIER,
        transform: `translateZ(${PAPIER_DICKE_CQI / 2}cqi)`,
      }}
    >
      {designType === 'upload' && frontImage ? (
        <img src={frontImage} className="w-full h-full object-cover" alt="Vorderseite" />
      ) : designType === 'template' ? (
        <div className="w-full h-full bg-blue-50/50 flex flex-col items-center justify-center border-4 border-blue-100/50">
          <div className="w-16 h-16 bg-blue-100 rounded-full mb-2 flex items-center justify-center text-blue-400">
            🎨
          </div>
          <span className="text-blue-400 font-bold text-sm">Vorgefertigtes Design</span>
        </div>
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 font-bold">Vorderseite</span>
        </div>
      )}

      {/* Beim Brief steht der Text vorne, bei der Postkarte hinten. */}
      {format.type === 'letter' && (
        <div className="absolute inset-0" style={{ containerType: 'size' }}>
          <div
            className={`w-full h-full ${HANDSCHRIFT}`}
            style={{ padding: '6cqi', fontSize: 'min(4cqi, 6.8cqh)', lineHeight: '1.5' }}
          >
            {previewText}
          </div>
        </div>
      )}
    </div>
  );
}

function Rueckseite({
  format,
  previewText,
  designType,
  backImage,
}: {
  format: Format;
  previewText: string;
  designType: 'template' | 'upload';
  backImage: string | null;
}) {
  return (
    <div
      className={`${FLAECHE} flex`}
      style={{
        backfaceVisibility: 'hidden',
        containerType: 'inline-size',
        background: PAPIER,
        transform: `rotateY(180deg) translateZ(${PAPIER_DICKE_CQI / 2}cqi)`,
      }}
    >
      {format.type === 'postcard' ? (
        <>
          {/* Die Schrift richtet sich nach Breite UND Höhe der Schreibhälfte.
              Bei DIN Lang ist die fast quadratisch — nur an der Breite gemessen
              liefe der Text unten aus der Karte. Der Größen-Container muss das
              äußere Element sein, ein Element kann sich nicht selbst abfragen. */}
          <div
            className="w-1/2 h-full border-r-2 border-dashed border-gray-400"
            style={{ containerType: 'size' }}
          >
            <div
              className={`w-full h-full ${HANDSCHRIFT}`}
              style={{ padding: '8cqi', fontSize: 'min(8.5cqi, 6.5cqh)', lineHeight: '1.5' }}
            >
              {previewText}
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
            {/* Vier Linien für die Empfängeradresse */}
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
        </>
      ) : (
        // Brief: Rückseite trägt nur das optionale Motiv.
        <div className="w-full h-full relative flex items-center justify-center bg-gray-50">
          {designType === 'upload' && backImage ? (
            <img src={backImage} className="w-full h-full object-cover" alt="Rückseite" />
          ) : (
            <span className="text-gray-400">Rückseite (leer)</span>
          )}
        </div>
      )}
    </div>
  );
}
