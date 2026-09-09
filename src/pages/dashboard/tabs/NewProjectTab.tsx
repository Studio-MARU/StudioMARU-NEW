import { useMemo, useState } from 'react';
import { AlertTriangle, Check, Download, Maximize, Plus, Save, Trash2, Upload } from 'lucide-react';
import { FORMATS, textLimit } from '@/data/formats';
import { site } from '@/config/site';
import { entwurfHolen, entwurfSichern, type Status } from '@/lib/entwuerfe';
import {
  csvHerunterladen,
  empfaengerAusText,
  empfaengerAusZeilen,
  LEERER_EMPFAENGER,
  textFuer,
  type Empfaenger,
} from '@/lib/iauto';
import { dateiLesen } from '@/lib/tabelle';
import CardPreview from '../components/CardPreview';
import FileDropzone from '../components/FileDropzone';
import { TabHeader, TabPanel } from '../components/TabPanel';

const STANDARDTEXT =
  'Liebe/r [Vorname],\n\nvielen Dank für das tolle Projekt!\n\nHerzliche Grüße,\nStudio Maru';

const FELD =
  'w-full p-3 rounded-xl bg-white/50 border border-white/50 focus:ring-black focus:border-black transition-all dark:bg-white/[0.06] dark:border-white/15 dark:text-[#EBEBEB] dark:placeholder:text-[#8a8a8a]';

/** Ein Beispielempfänger, solange die Liste leer ist — damit die Vorschau nie leer wirkt. */
const BEISPIEL: Empfaenger = {
  id: 'vorschau',
  vorname: 'Max',
  nachname: 'Mustermann',
  strasse: 'Musterweg 1',
  plz: '6020',
  ort: 'Innsbruck',
  land: 'Österreich',
};

export default function NewProjectTab({
  onBack,
  bearbeiteId,
}: {
  onBack: () => void;
  /** Gesetzt, wenn aus "Projekte" ein gespeichertes Projekt geöffnet wurde */
  bearbeiteId?: string | null;
}) {
  return (
    <div className="w-full h-full">
      <MobilHinweis onBack={onBack} />
      <div className="hidden md:block w-full h-full">
        {/* key erzwingt einen frischen Formularzustand beim Wechsel des
            Projekts — sonst blieben Felder des vorigen stehen. */}
        <Formular key={bearbeiteId ?? 'neu'} bearbeiteId={bearbeiteId} />
      </div>
    </div>
  );
}

function MobilHinweis({ onBack }: { onBack: () => void }) {
  return (
    <div className="md:hidden flex flex-col items-center justify-center min-h-[50vh] text-center px-4 space-y-4">
      <div className="w-20 h-20 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
        <Maximize className="text-black dark:text-[#EBEBEB] w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-[#EBEBEB]">
        Desktop benötigt
        <br />
        für die Erstellung
      </h2>
      <p className="text-gray-600 dark:text-[#a3a3a3] max-w-xs">
        Ein neues Projekt kann detailliert nur über die Desktop-Version gestartet werden. Bitte
        loggen Sie sich an einem Computer ein.
      </p>
      <button
        onClick={onBack}
        className="mt-6 border-2 border-black px-6 py-3 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent text-black hover:bg-black hover:text-white dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]"
      >
        Zurück zur Übersicht
      </button>
    </div>
  );
}

function Formular({ bearbeiteId }: { bearbeiteId?: string | null }) {
  // Ein bestehendes Projekt wird beim ersten Rendern geladen, sonst leer.
  const geladen = bearbeiteId ? entwurfHolen(bearbeiteId) : undefined;

  const [projektId] = useState(() => geladen?.id ?? crypto.randomUUID());
  const [projektname, setProjektname] = useState(geladen?.projektname ?? 'Neues Projekt');
  const [formatId, setFormatId] = useState(geladen?.formatId ?? FORMATS[0].id);
  const [designArt, setDesignArt] = useState<'template' | 'upload'>(
    geladen?.designArt ?? 'template',
  );
  const [vorlage, setVorlage] = useState(geladen?.vorlage ?? STANDARDTEXT);
  const [empfaenger, setEmpfaenger] = useState<Empfaenger[]>(geladen?.empfaenger ?? []);
  const [status, setStatus] = useState<Status>(geladen?.status ?? 'entwurf');
  const [vorschauIndex, setVorschauIndex] = useState(0);
  const [bildVorne, setBildVorne] = useState<string | null>(null);
  const [bildHinten, setBildHinten] = useState<string | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);

  const format = FORMATS.find((f) => f.id === formatId) ?? FORMATS[0];

  // Ohne Empfänger zeigt die Vorschau den Beispielempfänger.
  const gezeigt = empfaenger[vorschauIndex] ?? empfaenger[0] ?? BEISPIEL;
  const vorschauText = textFuer(vorlage, gezeigt);

  // Für die Warnung zählt der längste Text über alle Empfänger, nicht der
  // gerade angezeigte — sonst rutscht eine lange Adresse unbemerkt durch.
  const laengster = useMemo(() => {
    const liste = empfaenger.length ? empfaenger : [BEISPIEL];
    return Math.max(...liste.map((e) => textFuer(vorlage, e).length));
  }, [vorlage, empfaenger]);

  const limit = textLimit(format);
  const zuLang = laengster > limit;

  const bildLesen = (datei: File, seite: 'vorne' | 'hinten') => {
    const leser = new FileReader();
    leser.onload = (e) => {
      const url = e.target?.result as string;
      if (seite === 'vorne') setBildVorne(url);
      else setBildHinten(url);
    };
    leser.readAsDataURL(datei);
  };

  const kurzMelden = (text: string) => {
    setMeldung(text);
    setTimeout(() => setMeldung(null), 3500);
  };

  const speichern = (neuerStatus: Status = status) => {
    const ok = entwurfSichern({
      id: projektId,
      projektname,
      formatId,
      designArt,
      vorlage,
      empfaenger,
      status: neuerStatus,
      beauftragtAm:
        neuerStatus === 'kampagne'
          ? (geladen?.beauftragtAm ?? new Date().toISOString())
          : undefined,
    });
    if (ok) setStatus(neuerStatus);
    kurzMelden(
      !ok
        ? 'Speichern nicht möglich: Der Browser-Speicher ist voll oder gesperrt.'
        : neuerStatus === 'kampagne'
          ? 'Als gelaufene Kampagne gespeichert — zu finden unter „Historie".'
          : 'Gespeichert — zu finden unter „Historie", dort jederzeit weiter bearbeitbar.',
    );
  };

  const exportieren = () => {
    if (!empfaenger.length) {
      kurzMelden('Für den Export braucht es mindestens einen Empfänger.');
      return;
    }
    csvHerunterladen({ projektname, format, vorlage, empfaenger });
    kurzMelden(`${empfaenger.length} Empfänger exportiert.`);
  };

  const anfragen = () => {
    const betreff = `Projektanfrage: ${empfaenger.length || '?'}× ${format.name}`;
    const koerper = [
      'Hallo Studio Maru,',
      '',
      `Projekt:   ${projektname}`,
      `Format:    ${format.name}`,
      `Empfänger: ${empfaenger.length}`,
      `Design:    ${designArt === 'template' ? 'Vorgefertigt' : 'Individuell (Upload)'}`,
      '',
      'Text:',
      vorlage,
      '',
      'Die Empfängerliste hänge ich als CSV an.',
      '',
      'Viele Grüße',
    ].join('\n');
    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(koerper)}`;
  };

  return (
    <TabPanel>
      <TabHeader
        title={geladen ? projektname : 'Neues Projekt starten'}
        subtitle={
          geladen
            ? 'Gespeichertes Projekt — Änderungen überschreiben es beim Speichern.'
            : 'Text schreiben, Empfänger einfügen, für die Schreibmaschine exportieren.'
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <Karte>
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#EBEBEB]">Grunddaten</h2>

            <div>
              <Beschriftung>Projektname</Beschriftung>
              <input
                type="text"
                value={projektname}
                onChange={(e) => setProjektname(e.target.value)}
                className={FELD}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Beschriftung>Format</Beschriftung>
                <select
                  value={formatId}
                  onChange={(e) => setFormatId(e.target.value)}
                  className={FELD}
                >
                  {FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Beschriftung>Menge</Beschriftung>
                <div className={`${FELD} flex items-center justify-between`}>
                  <span className="font-bold tabular-nums">{empfaenger.length}</span>
                  <span className="text-xs text-gray-500 dark:text-[#a3a3a3]">
                    aus der Empfängerliste
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Beschriftung>Design</Beschriftung>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <Wahl aktiv={designArt === 'template'} onClick={() => setDesignArt('template')}>
                  Vorgefertigt
                </Wahl>
                <Wahl aktiv={designArt === 'upload'} onClick={() => setDesignArt('upload')}>
                  Individuell (Upload)
                </Wahl>
              </div>

              {designArt === 'upload' && (
                <div className="grid grid-cols-2 gap-4">
                  <FileDropzone
                    label="Vorderseite"
                    image={bildVorne}
                    onDrop={(f) => bildLesen(f, 'vorne')}
                  />
                  <FileDropzone
                    label={
                      format.type === 'postcard'
                        ? 'Rückseite (bei Postkarte ungenutzt)'
                        : 'Rückseite (Optional)'
                    }
                    image={bildHinten}
                    onDrop={(f) => bildLesen(f, 'hinten')}
                  />
                </div>
              )}
            </div>
          </Karte>

          <Karte>
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-bold text-gray-900 dark:text-[#EBEBEB]">Dein Text</h2>
              <div className="flex gap-2">
                {['[Vorname]', '[Nachname]', '[Ort]'].map((p) => (
                  <Platzhalter key={p} onClick={() => setVorlage((v) => v + p)}>
                    {p.replace(/[[\]]/g, '')}
                  </Platzhalter>
                ))}
              </div>
            </div>

            <textarea
              rows={6}
              value={vorlage}
              onChange={(e) => setVorlage(e.target.value)}
              className={`${FELD} resize-none ${zuLang ? 'border-amber-500 dark:border-amber-500' : ''}`}
              placeholder="Dein handgeschriebener Text..."
            />

            <div className="flex items-start justify-between gap-3 text-xs -mt-2">
              {zuLang ? (
                <span className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle size={13} />
                  Zu lang für {format.name} — der Text wird auf der Karte abgeschnitten.
                </span>
              ) : (
                <span className="text-gray-500 dark:text-[#a3a3a3]">Passt auf {format.name}.</span>
              )}
              <span
                className={`shrink-0 tabular-nums ${zuLang ? 'font-bold text-amber-700 dark:text-amber-400' : 'text-gray-400 dark:text-[#8a8a8a]'}`}
              >
                {laengster} / {limit}
              </span>
            </div>
          </Karte>

          <EmpfaengerListe
            empfaenger={empfaenger}
            setEmpfaenger={setEmpfaenger}
            vorschauIndex={vorschauIndex}
            setVorschauIndex={setVorschauIndex}
          />

          <Karte>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <StatusSchild status={status} />
              <button
                onClick={() => speichern(status === 'kampagne' ? 'entwurf' : 'kampagne')}
                className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-[#a3a3a3] hover:text-black dark:hover:text-[#EBEBEB] underline underline-offset-4 transition-colors"
              >
                {status === 'kampagne' ? 'Zurück auf Entwurf' : 'Als gelaufene Kampagne markieren'}
              </button>
            </div>

            <button
              onClick={() => speichern()}
              className="w-full flex items-center justify-center gap-2 bg-black text-[#EBEBEB] hover:bg-gray-900 dark:bg-[#EBEBEB] dark:text-[#141414] dark:hover:bg-white px-8 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] transition-colors"
            >
              <Save size={16} /> Projekt speichern
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Nebenknopf onClick={exportieren}>
                <Download size={15} /> Für IAuto exportieren
              </Nebenknopf>
              <Nebenknopf onClick={anfragen}>Anfrage per E-Mail</Nebenknopf>
            </div>

            {meldung && (
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-[#c9c9c9]">
                <Check size={15} className="shrink-0" />
                {meldung}
              </p>
            )}

            <p className="text-xs text-gray-500 dark:text-[#a3a3a3] leading-relaxed">
              Entwürfe liegen nur in diesem Browser, nicht auf einem Server. Der Export erzeugt
              eine CSV-Datei mit einer Zeile je Empfänger — das Format ist noch nicht mit der
              IAuto-Software abgeglichen.
            </p>
          </Karte>
        </div>

        <div className="xl:sticky xl:top-6">
          <CardPreview
            format={format}
            previewText={vorschauText}
            designType={designArt}
            frontImage={bildVorne}
            backImage={bildHinten}
          />
        </div>
      </div>
    </TabPanel>
  );
}

/* ---------------------------- Empfängerliste ---------------------------- */

function EmpfaengerListe({
  empfaenger,
  setEmpfaenger,
  vorschauIndex,
  setVorschauIndex,
}: {
  empfaenger: Empfaenger[];
  setEmpfaenger: (e: Empfaenger[]) => void;
  vorschauIndex: number;
  setVorschauIndex: (i: number) => void;
}) {
  const [einfuegenOffen, setEinfuegenOffen] = useState(false);
  const [rohtext, setRohtext] = useState('');
  const [fehler, setFehler] = useState<string | null>(null);

  const uebernehmen = () => {
    const neue = empfaengerAusText(rohtext);
    if (neue.length) {
      setEmpfaenger([...empfaenger, ...neue]);
      setRohtext('');
      setEinfuegenOffen(false);
      setFehler(null);
    } else {
      setFehler('In der Eingabe war keine verwertbare Zeile.');
    }
  };

  const dateiWaehlen = async (datei: File) => {
    setFehler(null);
    try {
      const neue = empfaengerAusZeilen(await dateiLesen(datei));
      if (!neue.length) {
        setFehler(`In „${datei.name}" standen keine Empfänger. Erste Spalte = Vorname?`);
        return;
      }
      setEmpfaenger([...empfaenger, ...neue]);
    } catch (e) {
      setFehler(e instanceof Error ? e.message : 'Die Datei konnte nicht gelesen werden.');
    }
  };

  const aendern = (id: string, feld: keyof Empfaenger, wert: string) =>
    setEmpfaenger(empfaenger.map((e) => (e.id === id ? { ...e, [feld]: wert } : e)));

  return (
    <Karte>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <h2 className="text-xl font-bold text-gray-900 dark:text-[#EBEBEB]">
          Empfänger{' '}
          <span className="text-gray-400 dark:text-[#8a8a8a] font-medium tabular-nums">
            {empfaenger.length}
          </span>
        </h2>
        <div className="flex gap-2 flex-wrap">
          <label className="cursor-pointer text-[10px] uppercase tracking-widest font-bold bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] px-4 py-2 rounded-full transition-colors inline-flex items-center gap-1.5">
            <Upload size={12} /> Excel / CSV
            <input
              type="file"
              accept=".xlsx,.csv,.txt"
              className="sr-only"
              onChange={(e) => {
                const datei = e.target.files?.[0];
                if (datei) dateiWaehlen(datei);
                // Zurücksetzen, damit dieselbe Datei erneut gewählt werden kann
                e.target.value = '';
              }}
            />
          </label>
          <Platzhalter onClick={() => setEinfuegenOffen(!einfuegenOffen)}>Einfügen</Platzhalter>
          <Platzhalter onClick={() => setEmpfaenger([...empfaenger, LEERER_EMPFAENGER()])}>
            + Zeile
          </Platzhalter>
        </div>
      </div>

      {fehler && (
        <p className="flex items-start gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          {fehler}
        </p>
      )}

      {einfuegenOffen && (
        <div className="space-y-2">
          <textarea
            rows={4}
            value={rohtext}
            onChange={(e) => setRohtext(e.target.value)}
            className={`${FELD} resize-none font-mono text-xs`}
            placeholder={'Vorname; Nachname; Straße; PLZ; Ort; Land\nAnna; Huber; Dorfweg 3; 6020; Innsbruck; Österreich'}
          />
          <p className="text-xs text-gray-500 dark:text-[#a3a3a3]">
            Eine Zeile je Empfänger, Spaltenfolge wie oben. Semikolon, Komma oder Tabulator als
            Trenner — Zellen direkt aus Excel kopieren funktioniert ebenso.
          </p>
          <Nebenknopf onClick={uebernehmen}>
            <Plus size={15} /> Übernehmen
          </Nebenknopf>
        </div>
      )}

      {empfaenger.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-[#a3a3a3]">
          Noch keine Empfänger. Die Vorschau zeigt so lange Max Mustermann.
        </p>
      ) : (
        <div className="max-h-64 lg:max-h-[22rem] overflow-y-auto -mx-2 px-2 space-y-2">
          {empfaenger.map((e, i) => (
            <div
              key={e.id}
              className={`grid grid-cols-[1fr_1fr_auto] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 items-center rounded-xl p-2 transition-colors ${
                i === vorschauIndex ? 'bg-black/[0.06] dark:bg-white/10' : ''
              }`}
            >
              <input
                value={e.vorname}
                onChange={(ev) => aendern(e.id, 'vorname', ev.target.value)}
                placeholder="Vorname"
                className={`${FELD} !p-2 text-sm`}
              />
              <input
                value={e.nachname}
                onChange={(ev) => aendern(e.id, 'nachname', ev.target.value)}
                placeholder="Nachname"
                className={`${FELD} !p-2 text-sm`}
              />
              {/* Der Ort erscheint erst ab lg — schmaler wäre die Zeile zu eng.
                  Eingelesene Werte bleiben in beiden Fällen erhalten. */}
              <input
                value={e.ort}
                onChange={(ev) => aendern(e.id, 'ort', ev.target.value)}
                placeholder="Ort"
                className={`${FELD} !p-2 text-sm hidden lg:block`}
              />
              <div className="flex gap-1">
                <MiniKnopf
                  onClick={() => setVorschauIndex(i)}
                  titel="In der Vorschau zeigen"
                  aktiv={i === vorschauIndex}
                >
                  {i + 1}
                </MiniKnopf>
                <MiniKnopf
                  onClick={() => setEmpfaenger(empfaenger.filter((x) => x.id !== e.id))}
                  titel="Empfänger entfernen"
                >
                  <Trash2 size={13} />
                </MiniKnopf>
              </div>
            </div>
          ))}
        </div>
      )}
    </Karte>
  );
}

/* ------------------------------- Bausteine ------------------------------- */

function Karte({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-glass p-6 md:p-8 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 space-y-5">
      {children}
    </div>
  );
}

/**
 * Zeigt an, ob das Projekt noch ein Entwurf ist oder schon wirklich
 * verschickt wurde. Dieselbe Kennzeichnung erscheint in der Projektliste.
 */
export function StatusSchild({ status }: { status: Status }) {
  const ist = status === 'kampagne';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
        ist
          ? 'bg-black text-[#EBEBEB] dark:bg-[#EBEBEB] dark:text-[#141414]'
          : 'bg-black/[0.07] text-gray-600 dark:bg-white/10 dark:text-[#c9c9c9]'
      }`}
    >
      {ist ? 'Gelaufene Kampagne' : 'Entwurf'}
    </span>
  );
}

function Beschriftung({ children }: { children: string }) {
  return (
    <label className="block text-sm font-bold text-gray-700 dark:text-[#c9c9c9] mb-2">
      {children}
    </label>
  );
}

function Wahl({
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
      className={`flex-1 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors border-2 ${
        aktiv
          ? 'bg-black text-[#EBEBEB] border-black dark:bg-[#EBEBEB] dark:text-[#141414] dark:border-[#EBEBEB]'
          : 'bg-transparent border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]'
      }`}
    >
      {children}
    </button>
  );
}

function Platzhalter({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="text-[10px] uppercase tracking-widest font-bold bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] px-4 py-2 rounded-full transition-colors"
    >
      {children}
    </button>
  );
}

function Nebenknopf({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]"
    >
      {children}
    </button>
  );
}

function MiniKnopf({
  onClick,
  titel,
  aktiv,
  children,
}: {
  onClick: () => void;
  titel: string;
  aktiv?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={titel}
      aria-label={titel}
      className={`w-8 h-8 shrink-0 flex items-center justify-center rounded-full border-2 text-[11px] font-bold tabular-nums transition-colors ${
        aktiv
          ? 'bg-black text-[#EBEBEB] border-black dark:bg-[#EBEBEB] dark:text-[#141414] dark:border-[#EBEBEB]'
          : 'border-black/25 text-gray-600 hover:border-black hover:text-black dark:border-white/25 dark:text-[#a3a3a3] dark:hover:border-[#EBEBEB] dark:hover:text-[#EBEBEB]'
      }`}
    >
      {children}
    </button>
  );
}
