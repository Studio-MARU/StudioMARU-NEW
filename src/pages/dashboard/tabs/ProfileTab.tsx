import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { demoAccount } from '@/config/auth';
import { TabHeader, TabPanel } from '../components/TabPanel';

type Props = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

export default function ProfileTab({ isDarkMode, onToggleDarkMode }: Props) {
  return (
    <TabPanel className="space-y-8 max-w-2xl lg:mx-0">
      <TabHeader
        title="Profil & Einstellungen"
        subtitle="Verwalten Sie Ihr Konto und das Erscheinungsbild des Portals."
      />

      <div className="section-glass rounded-3xl p-6 md:p-8 border border-white/50 dark:border-white/10 space-y-6">
        <div className="flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-800 dark:text-blue-300 text-2xl font-bold">
            {demoAccount.initials}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#EBEBEB]">
              {demoAccount.displayName}
            </h3>
            <p className="text-gray-500 dark:text-[#a3a3a3]">{demoAccount.email}</p>
          </div>
        </div>

        <div className="pt-2 border-b border-black/10 dark:border-white/10 pb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-[#a3a3a3] mb-4">
            Kontodetails
          </h3>

          <div className="space-y-4">
            {/* Noch ohne Funktion — es gibt keine echte Benutzerverwaltung. */}
            <ReadOnlyField label="E-Mail Adresse" type="email" value={demoAccount.email} />
            <ReadOnlyField label="Passwort" type="password" value="**************" />
          </div>
        </div>

        <div className="pt-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-[#a3a3a3] mb-4">
            Erscheinungsbild
          </h3>

          <div className="flex items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-gray-900 dark:text-[#EBEBEB]">Dunkles Design</h4>
              <p className="text-sm text-gray-500 dark:text-[#a3a3a3]">
                Aktivieren Sie das dunkle Portal-Design für reduzierte Blendung.
              </p>
            </div>

            {/* Knopf und Bahn brauchen jeweils den Gegenpol des anderen,
                sonst verschwindet der Knopf im dunklen Modus. */}
            <button
              onClick={onToggleDarkMode}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Dunkles Design"
              className={`relative w-16 h-8 shrink-0 rounded-full transition-colors duration-300 border-2 flex items-center px-1 ${
                isDarkMode ? 'bg-[#141414] border-[#EBEBEB]' : 'bg-[#EBEBEB] border-black'
              }`}
            >
              <motion.div
                layout
                className={`w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-[#EBEBEB]' : 'bg-black'}`}
                animate={{ x: isDarkMode ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {isDarkMode ? (
                  <Moon size={12} className="text-[#141414]" />
                ) : (
                  <Sun size={12} className="text-white" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>
    </TabPanel>
  );
}

function ReadOnlyField({ label, type, value }: { label: string; type: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-[#a3a3a3] mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type={type}
          value={value}
          disabled
          className="flex-1 bg-white/50 border border-black/20 rounded-xl px-4 py-3 text-gray-900 focus:outline-none dark:bg-white/[0.06] dark:border-white/15 dark:text-[#EBEBEB]"
        />
        <button className="px-6 py-3 bg-black text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-800 dark:bg-[#EBEBEB] dark:text-[#141414] dark:hover:bg-white transition-colors">
          ÄNDERN
        </button>
      </div>
    </div>
  );
}
