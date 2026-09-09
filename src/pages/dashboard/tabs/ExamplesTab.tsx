import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import BeispielDialog from '@/components/BeispielDialog';
import { WendeKarte } from '@/components/MotivKarte';
import { beispiele, type Beispiel } from '@/data/examples';
import { FORMATS } from '@/data/formats';
import { TabHeader, TabPanel } from '../components/TabPanel';

export default function ExamplesTab() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Beispiel | null>(null);

  return (
    <TabPanel>
      <TabHeader
        title="Beispiele"
        subtitle="Lassen Sie sich von erfolgreichen Kampagnen unserer Kunden inspirieren."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {beispiele.map((beispiel) => {
          const format = FORMATS.find((f) => f.id === beispiel.formatId);
          return (
            <div
              key={beispiel.id}
              className="section-glass p-6 rounded-3xl shadow-sm border border-white/50 dark:border-white/10 flex flex-col"
            >
              {/* Karte zeigt bei Hover die Rückseite; der Knopf darunter öffnet
                  die Detailansicht mit beiden Seiten nebeneinander. */}
              <WendeKarte beispiel={beispiel} className="h-64 xl:h-80 mb-6" />

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Etikett>{beispiel.branche}</Etikett>
                <Etikett>{beispiel.anlass}</Etikett>
                {format && <Etikett>{format.name.split(' (')[0]}</Etikett>}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-[#EBEBEB] mb-2">
                {beispiel.titel}
              </h3>
              <p className="text-gray-600 dark:text-[#c9c9c9] text-sm">{beispiel.beschreibung}</p>

              {beispiel.ergebnis && (
                <p className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 text-sm font-medium text-gray-800 dark:text-[#EBEBEB]">
                  {beispiel.ergebnis}
                </p>
              )}

              <button
                onClick={() => setAusgewaehlt(beispiel)}
                className="mt-6 w-full px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]"
              >
                Projekt ansehen
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {ausgewaehlt && (
          <BeispielDialog beispiel={ausgewaehlt} onClose={() => setAusgewaehlt(null)} />
        )}
      </AnimatePresence>
    </TabPanel>
  );
}

function Etikett({ children }: { children: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/[0.06] text-gray-600 dark:bg-white/10 dark:text-[#c9c9c9]">
      {children}
    </span>
  );
}
