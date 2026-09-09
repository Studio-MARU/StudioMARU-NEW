import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import { Info, Instagram, Search, User } from 'lucide-react';
import SearchModal from '@/components/SearchModal';
import BeispielDialog from '@/components/BeispielDialog';
import { MotivVorderseite } from '@/components/MotivKarte';
import IconPill, { IconDivider } from '@/components/ui/IconPill';
import PillButton from '@/components/ui/PillButton';
import { BirdWing, BirdWingMobile, FrogBird, FrogBirdMobile } from '@/components/Illustrations';
import { primaryActions, site } from '@/config/site';
import { beispiele, type Beispiel } from '@/data/examples';

/**
 * Startseite: Der Aufmacher füllt wie bisher den Bildschirm, darunter geht es
 * scrollend weiter — erst die Arbeiten, dann "Wer sind wir".
 *
 * Die Icon-Leiste steht im Aufmacher an ihrem Platz. Sobald sie beim Scrollen
 * oben hinausläuft, erscheint sie fixiert am oberen Rand — an derselben
 * waagrechten Position und in derselben Breite, damit sie bedienbar bleibt.
 */
export default function LandingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [ausgewaehlt, setAusgewaehlt] = useState<Beispiel | null>(null);

  const leisteDesktop = useRef<HTMLDivElement>(null);
  const leisteMobil = useRef<HTMLDivElement>(null);
  const leisteWeg = useLeisteAusgeblendet([leisteDesktop, leisteMobil]);

  const suchen = () => setIsSearchOpen(true);

  return (
    // overflow-x-clip statt -hidden: `hidden` würde hier einen eigenen
    // Scroll-Container aufmachen und die Seite doppelt scrollen lassen.
    <div className="relative bg-[#EBEBEB] overflow-x-clip selection:bg-black selection:text-white">
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <FixierteLeiste sichtbar={leisteWeg} onSearch={suchen} />

      <DesktopLayout onSearch={suchen} leisteRef={leisteDesktop} />
      <MobileLayout onSearch={suchen} leisteRef={leisteMobil} />

      <Arbeiten onSelect={setAusgewaehlt} />
      <WerSindWir />
      <Fuss />

      <AnimatePresence>
        {ausgewaehlt && (
          <BeispielDialog beispiel={ausgewaehlt} onClose={() => setAusgewaehlt(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Meldet, ob die Leiste im Aufmacher oben aus dem Bild gelaufen ist.
 *
 * Beobachtet werden beide Fassungen (Desktop und Mobil); sichtbar ist immer
 * nur eine, die andere liefert nie einen Treffer.
 */
function useLeisteAusgeblendet(refs: Array<React.RefObject<HTMLDivElement | null>>) {
  const [weg, setWeg] = useState(false);

  useEffect(() => {
    const elemente = refs.map((r) => r.current).filter((e): e is HTMLDivElement => e !== null);
    if (!elemente.length) return;

    const sichtbarkeit = new Map<Element, boolean>();
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) sichtbarkeit.set(e.target, e.isIntersecting);
        setWeg(![...sichtbarkeit.values()].some(Boolean));
      },
      // Erst wenn die Leiste ganz oben hinaus ist, übernimmt die fixierte.
      { threshold: 0, rootMargin: '-8px 0px 0px 0px' },
    );

    elemente.forEach((e) => beobachter.observe(e));
    return () => beobachter.disconnect();
  }, [refs]);

  return weg;
}

/* ------------------------------ Icon-Leiste ------------------------------ */

/** Der Inhalt der Leiste — einmal beschrieben, dreifach verwendet. */
function IconLeiste({ variante, onSearch }: { variante: 'desktop' | 'mobil'; onSearch: () => void }) {
  const groesse = variante === 'desktop' ? 22 : 24;
  const rahmen =
    variante === 'desktop'
      ? 'flex items-center gap-4 bg-[#EBEBEB] border-2 border-black px-5 py-3 rounded-full'
      : 'flex items-center gap-2.5 bg-[#EBEBEB] border-2 border-black px-7 py-3.5 rounded-full z-20 shrink-0';

  // Auf dem Handy hat die Leiste keine Tooltips — dort stört das Antippen.
  const beschriftung = (text: string) => (variante === 'desktop' ? text : undefined);

  return (
    <div className={rahmen}>
      <IconPill label={beschriftung('Instagram')} href={site.contact.instagram}>
        <Instagram size={groesse} strokeWidth={2} />
      </IconPill>
      <IconPill label={beschriftung('Suche')} onClick={onSearch}>
        <Search size={groesse} strokeWidth={2} />
      </IconPill>
      <IconPill label={beschriftung('Kundenportal')} to="/login">
        <User size={groesse} strokeWidth={2} />
      </IconPill>
      {variante === 'desktop' ? (
        <IconDivider />
      ) : (
        <IconDivider className="w-[1.5px] h-7 bg-black mx-1" />
      )}
      <IconPill label={beschriftung('Über uns')} to="/about">
        <Info size={groesse} strokeWidth={2} />
      </IconPill>
    </div>
  );
}

/**
 * Die fixierte Zweitfassung.
 *
 * Sie sitzt in derselben Spalte wie der Aufmacher (max-w-7xl px-12 bzw.
 * max-w-[450px] px-6) — dadurch stimmen linke Kante und Breite ohne Messen
 * mit der Leiste im Aufmacher überein.
 */
function FixierteLeiste({ sichtbar, onSearch }: { sichtbar: boolean; onSearch: () => void }) {
  return (
    // Gleiche Bewegung wie die Home-Pille auf den Unterseiten: von oben
    // hereinfahren, nach oben hinaus verschwinden.
    <motion.div
      aria-hidden={!sichtbar}
      initial={false}
      animate={{ y: sichtbar ? 0 : -100, opacity: sichtbar ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 inset-x-0 z-50 pt-4 pointer-events-none"
    >
      <div className="hidden md:block max-w-7xl mx-auto px-12">
        <div className="inline-flex pointer-events-auto">
          <IconLeiste variante="desktop" onSearch={onSearch} />
        </div>
      </div>
      <div className="md:hidden max-w-[450px] mx-auto px-6">
        <div className="flex justify-end pr-4">
          <div className="pointer-events-auto">
            <IconLeiste variante="mobil" onSearch={onSearch} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------- Desktop ------------------------------- */

function DesktopLayout({
  onSearch,
  leisteRef,
}: {
  onSearch: () => void;
  leisteRef: React.RefObject<HTMLDivElement | null>;
}) {
  const bereich = useRef<HTMLDivElement>(null);
  const knopfBewegung = useKnopfBewegung(bereich);

  return (
    <div ref={bereich} className="hidden md:flex relative w-full h-screen items-center justify-center">
      {/* Die Breite steckt in .illu-fluegel / .illu-frosch (src/index.css) —
          dort ist gerechnet, wie groß die Zeichnung sein darf, ohne den
          Inhalt zu überlappen. */}
      <BirdWing className="illu-fluegel absolute left-0 top-1/2 pointer-events-none z-0" />
      <FrogBird className="illu-frosch absolute right-0 bottom-0 pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-12 flex flex-row items-start justify-between gap-16">
        {/* Titel, Icon-Leiste und Slogan */}
        <div className="flex flex-col gap-16 max-w-3xl pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center flex-wrap gap-6">
              <h1 className="text-8xl lg:text-[7.5rem] font-bold tracking-tighter leading-none text-[#1a1a1a] whitespace-nowrap">
                STUDIO MARU
              </h1>

              <div ref={leisteRef}>
                <IconLeiste variante="desktop" onSearch={onSearch} />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl text-black leading-snug max-w-2xl font-medium"
            >
              {site.tagline} <br />
              <span className="text-2xl text-black/70 mt-3 flex items-start gap-2">
                <span className="mt-[3px] font-mono text-[22px] leading-none">&gt;</span>
                <span className="-mt-[1px]">
                  {site.subline[0]}
                  <br />
                  {site.subline[1]}
                </span>
              </span>
            </motion.p>
          </motion.div>
        </div>

        {/* Aktions-Buttons rechts */}
        <motion.div style={knopfBewegung} className="flex flex-col gap-4 z-10 pt-10">
          {primaryActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.05 + 0.25, type: 'spring', stiffness: 300, damping: 24 }}
            >
              <PillButton
                to={action.external ? undefined : action.href}
                href={action.external ? action.href : undefined}
                className="w-[24rem]"
              >
                {action.label}
              </PillButton>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Beim Wegscrollen fahren die Aktions-Buttons nach oben hinaus und blenden
 * aus; beim Zurückscrollen kommen sie wieder herein. Gebunden an den
 * Fortschritt des Aufmachers, damit die Bewegung sichtbar ist, bevor der
 * Bereich das Bild verlässt.
 */
function useKnopfBewegung(bereich: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: bereich, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 0.45], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  return { y, opacity };
}

/* -------------------------------- Mobile -------------------------------- */

function MobileLayout({
  onSearch,
  leisteRef,
}: {
  onSearch: () => void;
  leisteRef: React.RefObject<HTMLDivElement | null>;
}) {
  const bereich = useRef<HTMLDivElement>(null);
  const knopfBewegung = useKnopfBewegung(bereich);

  return (
    <div
      ref={bereich}
      className="flex flex-col md:hidden w-full px-6 pt-4 pb-16 relative min-h-[100dvh] z-10 max-w-[450px] mx-auto overflow-hidden"
    >
      <BirdWingMobile className="absolute left-0 top-[-7.5rem] w-52 pointer-events-none z-0" />

      {/* Icon-Leiste oben rechts */}
      <div className="flex justify-end items-start w-full relative z-20 mb-8 mt-14 pr-4 pt-0">
        <div ref={leisteRef}>
          <IconLeiste variante="mobil" onSearch={onSearch} />
        </div>
      </div>

      {/* Titel und Slogan */}
      <div className="flex flex-col mt-4 z-20 relative w-full">
        <h1 className="text-[3.6rem] leading-[0.9] font-bold tracking-tighter text-[#1a1a1a] -mt-[11px]">
          STUDIO MARU
        </h1>
        <p className="text-[20px] text-black font-medium leading-snug mt-8 z-20 relative">
          {site.tagline}
        </p>

        <div className="relative mt-4 min-h-[160px] w-[354px]">
          <span className="text-[16px] leading-[1.3] text-black/80 font-medium w-full max-w-[340px] md:w-[400px] z-20 relative flex items-start gap-1.5">
            <span className="mt-[2px] font-mono text-[14px] leading-none">&gt;</span>
            <span>
              {site.subline[0]}
              <br />
              {site.subline[1]}
            </span>
          </span>
          <FrogBirdMobile className="absolute right-[-4rem] top-[-11.5rem] w-[18rem] pointer-events-none z-10 max-w-[280px]" />
        </div>
      </div>

      {/* Aktions-Buttons */}
      <motion.div
        style={knopfBewegung}
        className="flex flex-col gap-[clamp(16px,4vw,20px)] w-full z-20 -mt-6"
      >
        {primaryActions.map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i * 0.05 + 0.25, type: 'spring', stiffness: 300, damping: 24 }}
          >
            <PillButton
              size="mobile"
              to={action.external ? undefined : action.href}
              href={action.external ? action.href : undefined}
              className="w-full"
            >
              {action.label}
            </PillButton>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------- Abschnitte ------------------------------ */

function Arbeiten({ onSelect }: { onSelect: (b: Beispiel) => void }) {
  return (
    <Abschnitt id="arbeiten" eyebrow="Unsere Arbeiten" titel="Vier, die angekommen sind">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {beispiele.map((beispiel, i) => (
          <motion.div
            key={beispiel.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: (i % 2) * 0.1 }}
            className="group"
          >
            <button
              onClick={() => onSelect(beispiel)}
              className="w-full text-left rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
              aria-label={`${beispiel.titel} öffnen`}
            >
              <div className="aspect-[4/3] rounded-[2rem] bg-white border border-gray-100 overflow-hidden relative mb-6 shadow-sm">
                <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-700">
                  <MotivVorderseite beispiel={beispiel} />
                </div>
                <div className="absolute bottom-8 left-8">
                  <span className="px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[10px] uppercase tracking-widest font-bold border border-gray-200 shadow-sm text-gray-600">
                    {beispiel.branche}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center gap-4 px-2">
                <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                  {beispiel.titel}
                </h3>
                <span className="text-sm text-gray-400 font-medium shrink-0">
                  {beispiel.anlass}
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </Abschnitt>
  );
}

function WerSindWir() {
  return (
    <Abschnitt id="wer-sind-wir" eyebrow="Wer sind wir" titel="Briefe, die jemand aufhebt">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-xl md:text-2xl font-medium leading-snug text-black"
        >
          {site.about.intro}
        </motion.p>

        <div className="flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
          >
            <h3 className="text-lg font-bold mb-2 text-[#1a1a1a]">Unsere Vision</h3>
            <p className="text-gray-700 leading-relaxed">{site.about.vision}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-2 text-[#1a1a1a]">Unser Ansatz</h3>
            <p className="text-gray-700 leading-relaxed">{site.about.approach}</p>
            <VomAbisPunkt />
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        className="mt-16 pt-12 border-t border-black/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
      >
        <div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight text-[#1a1a1a]">
            Reden wir über deine Briefe?
          </p>
          <p className="mt-2 text-gray-600">
            Ein Erstgespräch kostet nichts und dauert eine halbe Stunde.
          </p>
        </div>
        <PillButton href={site.contact.calendly} className="w-full sm:w-auto shrink-0">
          Kostenloses Erstgespräch
        </PillButton>
      </motion.div>
    </Abschnitt>
  );
}

/** "Vom ersten Buchstaben bis zum letzten Punkt" als Zeichen. */
function VomAbisPunkt() {
  return (
    <span
      className="mt-5 text-gray-700 text-2xl leading-none flex items-center gap-3"
      aria-label="Vom ersten Buchstaben bis zum letzten Punkt"
    >
      A
      <svg
        width="60"
        height="24"
        viewBox="0 0 60 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="0" y1="12" x2="56" y2="12" />
        <polyline points="48 6 56 12 48 18" />
      </svg>
      &bull;
    </span>
  );
}

/** Pause zwischen zwei Rad-Ereignissen, ab der eine neue Geste beginnt. */
const NEUE_GESTE_MS = 260;
/** So weit muss in dieser neuen Geste gescrollt werden. */
const SCHWELLE_PX = 70;
/** Ab diesem Abstand vom Seitenende klappt das Impressum wieder zu. */
const ZUKLAPPEN_AB_PX = 160;

function Fuss() {
  const [zeigen, setZeigen] = useState(false);

  /**
   * Das Impressum liegt zusammengeklappt unmittelbar unter dem Fuß und klappt
   * erst beim zweiten Scrollen auf.
   *
   * Entscheidend ist die Unterscheidung nach Gesten, nicht nach Zeit: Auf dem
   * Mac läuft der Schwung nach dem Anschlag noch lange nach, eine reine
   * Zeitsperre würde ihn irgendwann durchlassen. Deshalb zählt nur eine Geste,
   * die *beginnt*, während man bereits ganz unten steht. Die Geste, die einen
   * ans Ende gebracht hat, ist damit ausgeschlossen — samt ihrem Nachlauf.
   *
   * Scrollt man wieder ein Stück nach oben, klappt es zu und der Ablauf
   * beginnt von vorn — das Ganze wiederholt sich also bei jedem Herunterscrollen.
   */
  useEffect(() => {
    const amEnde = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    let letztesRad = 0;
    let gesteZaehlt = false;
    let gesammelt = 0;

    const beiRad = (e: WheelEvent) => {
      const jetzt = performance.now();
      if (jetzt - letztesRad > NEUE_GESTE_MS) {
        gesteZaehlt = amEnde();
        gesammelt = 0;
      }
      letztesRad = jetzt;
      if (!gesteZaehlt || e.deltaY <= 0) return;
      gesammelt += e.deltaY;
      if (gesammelt > SCHWELLE_PX) setZeigen(true);
    };

    let beruehrungY = 0;
    let wischZaehlt = false;
    const beiStart = (e: TouchEvent) => {
      wischZaehlt = amEnde();
      beruehrungY = e.touches[0].clientY;
    };
    const beiZug = (e: TouchEvent) => {
      if (wischZaehlt && beruehrungY - e.touches[0].clientY > 40) setZeigen(true);
    };

    const beiTaste = (e: KeyboardEvent) => {
      if (['End', 'PageDown', 'ArrowDown', ' '].includes(e.key) && amEnde()) setZeigen(true);
    };

    // Weit genug weg vom Ende: wieder zuklappen, damit es beim nächsten
    // Herunterscrollen erneut aufgeht.
    const beiScroll = () => {
      const abstand =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (abstand > ZUKLAPPEN_AB_PX) {
        setZeigen(false);
        gesteZaehlt = false;
        gesammelt = 0;
      }
    };

    window.addEventListener('scroll', beiScroll, { passive: true });
    window.addEventListener('wheel', beiRad, { passive: true });
    window.addEventListener('touchstart', beiStart, { passive: true });
    window.addEventListener('touchmove', beiZug, { passive: true });
    window.addEventListener('keydown', beiTaste);
    return () => {
      window.removeEventListener('scroll', beiScroll);
      window.removeEventListener('wheel', beiRad);
      window.removeEventListener('touchstart', beiStart);
      window.removeEventListener('touchmove', beiZug);
      window.removeEventListener('keydown', beiTaste);
    };
  }, []);

  return (
    <footer className="border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Namenszeile links, Zeichen rechts außen. */}
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            © {new Date().getFullYear()} {site.company.legalName} · {site.company.city}
          </span>
          {/* Kein mix-blend-multiply: Das PNG hat einen echten Alphakanal,
              der Blendmodus hätte das Zeichen nur aufgehellt. */}
          <img src="/maru-zeichen.png" alt="Studio Maru" className="h-8 w-auto shrink-0" />
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: zeigen ? 'auto' : 0, opacity: zeigen ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 0.9, 0.26, 1] }}
        className="overflow-hidden"
        aria-hidden={!zeigen}
      >
        <div className="flex justify-center pb-14 pt-2">
          <a
            href="/impressum"
            tabIndex={zeigen ? 0 : -1}
            className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a] hover:text-gray-500 transition-colors underline underline-offset-4"
          >
            Impressum
          </a>
        </div>
      </motion.div>
    </footer>
  );
}

function Abschnitt({
  id,
  eyebrow,
  titel,
  children,
}: {
  id: string;
  eyebrow: string;
  titel: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-20 md:py-28 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 md:mb-16"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-px bg-gray-400" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500">
              {eyebrow}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter leading-none text-[#1a1a1a]">
            {titel}
          </h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}
