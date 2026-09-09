import { useEffect, useState } from 'react';
import { FileText, Pencil, Plus } from 'lucide-react';
import { alleEntwuerfe, type Entwurf } from '@/lib/entwuerfe';
import { FORMATS } from '@/data/formats';
import { TabHeader, TabPanel } from '../components/TabPanel';

/** Platzhalter, bis echte Vorlagen-Bilder vorliegen. */
const VORLAGEN_ANZAHL = 6;

/**
 * Zwei Dinge unter einem Dach: die eigenen, noch unfertigen Entwürfe und die
 * vorgefertigten Designs. Gelaufene Kampagnen stehen bewusst nicht hier,
 * sondern in der Historie.
 */
export default function TemplatesTab({
  onEdit,
  onNeu,
}: {
  onEdit: (id: string) => void;
  onNeu: () => void;
}) {
  const [entwuerfe, setEntwuerfe] = useState<Entwurf[]>([]);

  useEffect(() => {
    setEntwuerfe(alleEntwuerfe().filter((e) => e.status !== 'kampagne'));
  }, []);

  return (
    <TabPanel>
      <TabHeader
        title="Vorlagen & Entwürfe"
        subtitle="Angefangene Projekte zum Weiterarbeiten und vorgefertigte Designs."
      />

      <section className="mb-16">
        <Ueberschrift titel="Deine Entwürfe" anzahl={entwuerfe.length} />

        {entwuerfe.length === 0 ? (
          <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 text-center">
            <FileText className="w-10 h-10 text-gray-300 dark:text-white/20 mx-auto mb-4" />
            <h3 className="font-bold text-gray-900 dark:text-[#EBEBEB] mb-2">
              Noch kein Entwurf gespeichert
            </h3>
            <p className="text-gray-500 dark:text-[#a3a3a3] mb-6">
              Angefangene Projekte landen hier, sobald du sie speicherst.
            </p>
            <button
              onClick={onNeu}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]"
            >
              <Plus size={15} /> Neues Projekt beginnen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {entwuerfe.map((entwurf) => {
              const format = FORMATS.find((f) => f.id === entwurf.formatId);
              return (
                <button
                  key={entwurf.id}
                  onClick={() => onEdit(entwurf.id)}
                  className="section-glass p-6 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 text-left hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-[#EBEBEB] truncate">
                      {entwurf.projektname}
                    </h3>
                    <span className="shrink-0 text-gray-400 dark:text-[#8a8a8a] group-hover:text-black dark:group-hover:text-[#EBEBEB] transition-colors">
                      <Pencil size={15} />
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-[#a3a3a3]">
                    {format?.name.split(' (')[0] ?? entwurf.formatId} · {entwurf.empfaenger.length}{' '}
                    Empfänger · geändert{' '}
                    {new Date(entwurf.geaendert).toLocaleDateString('de-AT', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-[#c9c9c9] truncate">
                    {entwurf.vorlage.split('\n').filter(Boolean)[0]}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <Ueberschrift titel="Design-Vorlagen" anzahl={VORLAGEN_ANZAHL} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: VORLAGEN_ANZAHL }, (_, i) => i + 1).map((i) => (
            <div
              key={i}
              className="section-glass p-4 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 group cursor-pointer hover:shadow-md transition-all"
            >
              <div className="bg-gray-100 dark:bg-white/[0.04] rounded-2xl h-48 mb-4 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-blue-50/50 dark:bg-blue-400/[0.07] flex flex-col items-center justify-center border-4 border-blue-100/50 dark:border-blue-400/15 group-hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-400/20 rounded-full mb-2 flex items-center justify-center text-blue-400">
                    🎨
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-[#EBEBEB]">Design Vorlage {i}</h3>
              <p className="text-sm text-gray-500 dark:text-[#a3a3a3]">Für A6 Postkarte</p>
            </div>
          ))}
        </div>
      </section>
    </TabPanel>
  );
}

function Ueberschrift({ titel, anzahl }: { titel: string; anzahl: number }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <span className="text-xs uppercase tracking-[0.3em] font-bold text-gray-500 dark:text-[#a3a3a3]">
        {titel}
      </span>
      <span className="text-xs font-bold text-gray-400 dark:text-[#8a8a8a] tabular-nums">
        {anzahl}
      </span>
      <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
    </div>
  );
}
