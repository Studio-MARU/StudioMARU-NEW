import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import BeispielDialog from '@/components/BeispielDialog';
import { MotivVorderseite } from '@/components/MotivKarte';
import { beispiele, type Beispiel } from '@/data/examples';

export default function Portfolio() {
  const [ausgewaehlt, setAusgewaehlt] = useState<Beispiel | null>(null);

  return (
    <div className="min-h-screen bg-[#EBEBEB] py-24 px-6 md:px-[10%] font-sans">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-px bg-gray-300" />
          <h2 className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400">
            Unsere Arbeiten
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {beispiele.map((beispiel, index) => (
            <ProjektKachel
              key={beispiel.id}
              beispiel={beispiel}
              index={index}
              onSelect={() => setAusgewaehlt(beispiel)}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {ausgewaehlt && (
          <BeispielDialog beispiel={ausgewaehlt} onClose={() => setAusgewaehlt(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjektKachel({
  beispiel,
  index,
  onSelect,
}: {
  beispiel: Beispiel;
  index: number;
  onSelect: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <button
        onClick={onSelect}
        className="w-full text-left cursor-pointer rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/40"
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
        <div className="flex justify-between items-center gap-4 px-4">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900">{beispiel.titel}</h3>
          <span className="text-sm text-gray-400 font-medium shrink-0">{beispiel.anlass}</span>
        </div>
      </button>
    </motion.div>
  );
}
