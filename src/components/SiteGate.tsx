import { useState, type FormEvent, type ReactNode } from 'react';
import { BirdWing, FrogBird } from '@/components/Illustrations';
import { site } from '@/config/site';

const STORAGE_KEY = 'site_access';

/**
 * Vorschalt-Seite mit Zugangscode ("Coming Soon").
 *
 * Reiner Sichtschutz: Der Code steht im ausgelieferten JavaScript.
 * Siehe Kommentar bei `site.gate` in src/config/site.ts.
 * Zum Abschalten: `site.gate.enabled = false`.
 */
export default function SiteGate({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(
    () => !site.gate.enabled || sessionStorage.getItem(STORAGE_KEY) === 'true',
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code === site.gate.code) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsUnlocked(true);
    } else {
      setError('Falscher Code. Bitte erneut versuchen.');
    }
  };

  if (isUnlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#EBEBEB] text-black flex items-center justify-center p-6 relative overflow-hidden selection:bg-black selection:text-white">
      <BirdWing className="absolute left-0 top-1/2 -translate-y-[53%] w-72 md:w-[40rem] pointer-events-none z-0 -translate-x-8 opacity-40" />
      <FrogBird className="absolute right-0 bottom-0 w-80 md:w-[45rem] pointer-events-none z-0 opacity-40" />

      <div className="relative z-10 section-glass p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/50 bg-white/60 max-w-2xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
          {site.gate.heading}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10">{site.gate.subheading}</p>

        <form onSubmit={handleSubmit} className="max-w-xs mx-auto flex flex-col gap-4">
          <div>
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              placeholder="Zugangscode"
              className="w-full px-5 py-4 rounded-full border-2 border-black bg-white/50 text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black transition-all text-center tracking-widest text-xl font-mono"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 font-medium text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-[#EBEBEB] font-bold uppercase tracking-[0.15em] text-sm py-4 px-6 rounded-full hover:scale-105 active:scale-95 transition-transform"
          >
            Eintreten
          </button>
        </form>
      </div>
    </div>
  );
}
