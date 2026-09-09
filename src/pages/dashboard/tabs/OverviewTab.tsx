import { Download, FileText, MessageSquare } from 'lucide-react';
import { TabHeader, TabPanel } from '../components/TabPanel';

/** Dokumente zum Download in der rechten Spalte. */
const DOCUMENTS = ['Angebot_v2.pdf', 'Moodboard.pdf'];

/** Projektphasen mit Status. */
const PHASES = [
  { state: 'done', title: 'Phase 1: Discovery & Strategie', note: 'Abgeschlossen am 12. März' },
  { state: 'active', title: 'Phase 2: Visual Identity Design', note: 'In Bearbeitung (Feedback erwartet)' },
  { state: 'upcoming', title: 'Phase 3: Rollout & Guidelines', note: 'Geplant für April' },
] as const;

const PROGRESS_PERCENT = 65;

export default function OverviewTab({ onOpenMessenger }: { onOpenMessenger: () => void }) {
  return (
    <TabPanel>
      <TabHeader
        title="Willkommen zurück!"
        subtitle="Hier finden Sie alle aktuellen Dokumente und Projektfortschritte."
      />

      {/* Feste Breite für die rechte Spalte statt eines Drittels: so passt
          „Nachricht senden" bei jeder Fensterbreite in eine Zeile, und die
          Projektkarte bekommt den gesamten Rest. */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_22rem] gap-6">
        <div className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 dark:border-white/10">
          <h2 className="text-xl font-bold mb-8 text-gray-900 dark:text-[#EBEBEB]">
            Aktuelles Projekt: Rebranding 2026
          </h2>

          <div className="space-y-8">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium text-gray-700 dark:text-[#c9c9c9]">Fortschritt</span>
                <span className="font-bold text-black dark:text-[#EBEBEB]">{PROGRESS_PERCENT}%</span>
              </div>
              <div className="w-full bg-white/50 dark:bg-white/10 rounded-full h-3 border border-white/50 dark:border-white/10 overflow-hidden">
                <div
                  className="bg-black dark:bg-[#EBEBEB] h-full rounded-full relative overflow-hidden"
                  style={{ width: `${PROGRESS_PERCENT}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 dark:bg-black/20 w-full h-full animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {PHASES.map((phase, i) => (
                <PhaseRow key={phase.title} phase={phase} index={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-glass p-6 rounded-3xl shadow-sm border border-white/50 dark:border-white/10">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-[#EBEBEB]">Dokumente</h2>
            <div className="space-y-3">
              {DOCUMENTS.map((doc) => (
                <button
                  key={doc}
                  className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-[0.15em]">{doc}</span>
                  </div>
                  <Download className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Diese Karte ist bewusst invertiert — im dunklen Modus bleibt sie
              dunkel, bekommt aber einen Rahmen, damit sie sich abhebt. */}
          <div className="bg-black dark:bg-white/[0.06] dark:border dark:border-white/10 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-lg font-bold mb-2 relative z-10">Fragen zum Projekt?</h2>
            <p className="text-sm text-gray-400 dark:text-[#a3a3a3] mb-6 relative z-10">
              Wir sind jederzeit für Sie erreichbar.
            </p>
            <button
              onClick={onOpenMessenger}
              className="w-full bg-[#EBEBEB] text-black flex items-center justify-center gap-2 px-8 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] hover:bg-white transition-colors relative z-10"
            >
              <MessageSquare className="w-4 h-4" />
              Nachricht senden
            </button>
          </div>
        </div>
      </div>
    </TabPanel>
  );
}

function PhaseRow({ phase, index }: { phase: (typeof PHASES)[number]; index: number }) {
  const marker = {
    done: (
      <div className="w-10 h-10 rounded-full bg-green-100/80 border border-green-200 dark:bg-green-500/15 dark:border-green-500/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 shadow-sm">
        ✓
      </div>
    ),
    active: (
      <div className="w-10 h-10 rounded-full bg-blue-100/80 border border-blue-200 dark:bg-blue-500/15 dark:border-blue-500/30 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
        <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
      </div>
    ),
    upcoming: (
      <div className="w-10 h-10 rounded-full bg-white/60 border border-white dark:bg-white/[0.06] dark:border-white/15 flex items-center justify-center text-gray-400 dark:text-[#8a8a8a] shrink-0 shadow-sm">
        {index + 1}
      </div>
    ),
  }[phase.state];

  return (
    <div className={`flex items-center gap-4${phase.state === 'upcoming' ? ' opacity-50' : ''}`}>
      {marker}
      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-[#EBEBEB]">{phase.title}</p>
        <p className="text-xs text-gray-500 dark:text-[#a3a3a3] mt-0.5">{phase.note}</p>
      </div>
    </div>
  );
}
