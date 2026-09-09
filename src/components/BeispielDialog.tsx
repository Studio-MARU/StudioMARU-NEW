import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { MotivRueckseite, MotivVorderseite } from '@/components/MotivKarte';
import type { Beispiel } from '@/data/examples';
import { FORMATS } from '@/data/formats';

/**
 * Detailansicht eines Beispielprojekts — zeigt beide Kartenseiten
 * nebeneinander. Wird von der Portfolio-Seite und vom Portal-Reiter
 * "Beispiele" gemeinsam genutzt.
 *
 * Die `dark:`-Klassen greifen nur im Portal; auf der öffentlichen Seite
 * sind sie wirkungslos.
 */
export default function BeispielDialog({
  beispiel,
  onClose,
}: {
  beispiel: Beispiel;
  onClose: () => void;
}) {
  const format = FORMATS.find((f) => f.id === beispiel.formatId);

  // Escape schließt, und der Hintergrund soll derweil nicht mitscrollen.
  useEffect(() => {
    const beiTaste = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', beiTaste);
    const vorher = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', beiTaste);
      document.body.style.overflow = vorher;
    };
  }, [onClose]);

  // Direkt in den Body gerendert: Im Portal-Layout liegt <main> in einem
  // eigenen Stapelkontext, der Dialog verschwände sonst hinter der Sidebar.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12 bg-gray-900/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={beispiel.titel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#EBEBEB] dark:bg-[#1a1a1a] w-full max-w-5xl max-h-[90vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center gap-4 bg-white dark:bg-white/[0.04]">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-[#EBEBEB]">
              {beispiel.titel}
            </h3>
            <p className="text-sm text-gray-500 dark:text-[#a3a3a3] uppercase tracking-widest font-bold mt-1">
              {beispiel.branche} · {beispiel.anlass}
              {format && ` · ${format.name.split(' (')[0]}`}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-[#EBEBEB] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <p className="text-gray-700 dark:text-[#c9c9c9] text-lg mb-8 max-w-3xl">
            {beispiel.beschreibung}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Seite titel="Vorderseite" ratio={format?.ratio ?? 1.414}>
              <MotivVorderseite beispiel={beispiel} />
            </Seite>
            <Seite titel="Rückseite" ratio={format?.ratio ?? 1.414}>
              <MotivRueckseite beispiel={beispiel} />
            </Seite>
          </div>

          {beispiel.ergebnis && (
            <p className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 text-gray-800 dark:text-[#EBEBEB] font-medium max-w-3xl">
              {beispiel.ergebnis}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

function Seite({ titel, ratio, children }: { titel: string; ratio: number; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-[#8a8a8a] mb-3">
        {titel}
      </p>
      <div
        className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm bg-white"
        style={{ aspectRatio: ratio }}
      >
        {children}
      </div>
    </div>
  );
}
