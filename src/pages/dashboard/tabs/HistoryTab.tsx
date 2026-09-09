import { useEffect, useState } from 'react';
import { Download, History, Lock, Pencil } from 'lucide-react';
import { alleEntwuerfe, type Entwurf } from '@/lib/entwuerfe';
import { csvHerunterladen } from '@/lib/iauto';
import { FORMATS } from '@/data/formats';
import { TabHeader, TabPanel } from '../components/TabPanel';
import { StatusSchild } from './NewProjectTab';

export default function HistoryTab({ onEdit }: { onEdit: (id: string) => void }) {
  const [kampagnen, setKampagnen] = useState<Entwurf[]>([]);

  useEffect(() => {
    setKampagnen(alleEntwuerfe().filter((p) => p.status === 'kampagne'));
  }, []);

  return (
    <TabPanel>
      <TabHeader
        title="Gelaufene Kampagnen"
        subtitle={'Was bereits geschrieben und verschickt wurde. Entwürfe stehen unter „Vorlagen & Entwürfe“.'}
      />

      {kampagnen.length === 0 ? (
        <Leer />
      ) : (
        <div className="space-y-4">
          {kampagnen.map((projekt) => (
            <Zeile key={projekt.id} projekt={projekt} onEdit={onEdit} />
          ))}
        </div>
      )}

      {kampagnen.length > 0 && (
        <p className="mt-8 flex items-start gap-2 text-sm text-gray-500 dark:text-[#a3a3a3]">
          <Lock size={14} className="shrink-0 mt-0.5" />
          Gelaufene Kampagnen lassen sich nicht löschen — sie halten fest, was tatsächlich
          verschickt wurde. Über „Bearbeiten" bleiben sie zugänglich; zum Zurücknehmen dort auf
          „Zurück auf Entwurf" stellen.
        </p>
      )}
    </TabPanel>
  );
}

function Leer() {
  return (
    <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 text-center">
      <History className="w-12 h-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-gray-900 dark:text-[#EBEBEB] mb-2">
        Noch keine Kampagne gelaufen
      </h3>
      <p className="text-gray-500 dark:text-[#a3a3a3]">
        Sobald ein Projekt verschickt ist, im Editor auf „Als gelaufene Kampagne markieren" —
        dann erscheint es hier.
      </p>
    </div>
  );
}

function Zeile({ projekt, onEdit }: { projekt: Entwurf; onEdit: (id: string) => void }) {
  const format = FORMATS.find((f) => f.id === projekt.formatId);
  const datum = (iso: string) =>
    new Date(iso).toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const exportieren = () =>
    csvHerunterladen({
      projektname: projekt.projektname,
      format: format ?? FORMATS[0],
      vorlage: projekt.vorlage,
      empfaenger: projekt.empfaenger,
    });

  return (
    <div className="section-glass p-6 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3 className="text-lg font-bold text-gray-900 dark:text-[#EBEBEB] truncate">
            {projekt.projektname}
          </h3>
          <StatusSchild status={projekt.status} />
        </div>

        <p className="text-sm text-gray-500 dark:text-[#a3a3a3]">
          {format?.name.split(' (')[0] ?? projekt.formatId} · {projekt.empfaenger.length} Empfänger
          {projekt.beauftragtAm
            ? ` · verschickt ${datum(projekt.beauftragtAm)}`
            : ` · geändert ${datum(projekt.geaendert)}`}
        </p>

        <p className="mt-2 text-sm text-gray-600 dark:text-[#c9c9c9] truncate">
          {projekt.vorlage.split('\n').filter(Boolean)[0]}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(projekt.id)}
          className="flex items-center gap-2 px-5 py-3 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-black text-[#EBEBEB] hover:bg-gray-900 dark:bg-[#EBEBEB] dark:text-[#141414] dark:hover:bg-white"
        >
          <Pencil size={14} /> Bearbeiten
        </button>
        <button
          onClick={exportieren}
          title="Für IAuto exportieren"
          aria-label={`${projekt.projektname} exportieren`}
          className="w-11 h-11 flex items-center justify-center rounded-full border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] transition-colors"
        >
          <Download size={15} />
        </button>
      </div>
    </div>
  );
}
