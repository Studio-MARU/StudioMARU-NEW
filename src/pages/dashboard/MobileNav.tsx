import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Menu } from 'lucide-react';
import LogoBadge from '@/components/ui/LogoBadge';
import { NAV_ITEMS, type TabId } from './navigation';

const SIGNOUT =
  'border-[#e78806] text-[#e78806] hover:bg-[#e78806] hover:text-[#EBEBEB] active:bg-[#e78806] active:text-[#EBEBEB]';

/** Feste Kopfzeile mit Logo — nur auf dem Handy. */
export function MobileHeader({ onOpenProfile }: { onOpenProfile: () => void }) {
  return (
    <div className="md:hidden absolute top-0 left-0 right-0 px-6 pt-6 pb-[18px] flex flex-col items-center justify-center gap-1 z-[40] bg-[#f3f3f4] border-b border-[#FFFFFF] dark:bg-[#1a1a1a] dark:border-white/10">
      <LogoBadge
        className="w-20 h-16 rounded-[2rem] shrink-0 shadow-sm"
        alt="Studio Maru Profil"
        title="Profil & Einstellungen"
        onClick={onOpenProfile}
      />
      <span className="text-[28px] font-bold tracking-tight text-gray-900 dark:text-[#EBEBEB]">
        Kundenportal
      </span>
    </div>
  );
}

/** Der Burger-Button oben rechts. */
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed right-6 top-6 py-2 px-[12px] mt-[13px] border-2 border-black rounded-full text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] transition-colors z-[60] bg-white/80 backdrop-blur-md dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:bg-white/10 dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] dark:active:bg-[#EBEBEB] dark:active:text-[#141414]"
    >
      <Menu size={20} className="hover:text-current" />
    </button>
  );
}

type MenuProps = {
  isOpen: boolean;
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onClose: () => void;
  onLogout: () => void;
};

/** Vollbild-Menü, das über die Seite gelegt wird. */
export function MobileMenu({ isOpen, activeTab, onSelectTab, onClose, onLogout }: MenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          className="md:hidden fixed inset-0 bg-[#EBEBEB]/80 dark:bg-[#141414]/85 z-50 pointer-events-auto flex items-start justify-center pt-[100px] overflow-y-auto"
          onClick={onClose}
        >
          <div className="flex flex-col gap-4 w-[90vw] pb-12" onClick={(e) => e.stopPropagation()}>
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                // Beim Schließen laufen die Einträge in umgekehrter Reihenfolge raus.
                exit={{ opacity: 0, y: -20, scale: 0.9, transition: { delay: (NAV_ITEMS.length - 1 - i) * 0.05 } }}
                transition={{ delay: i * 0.05 + 0.1, type: 'spring', stiffness: 300, damping: 24 }}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-center gap-3 px-6 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] transition-colors ${
                  activeTab === item.id
                    ? 'bg-black text-[#EBEBEB] dark:bg-[#EBEBEB] dark:text-[#141414]'
                    : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] active:bg-black active:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414] dark:active:bg-[#EBEBEB] dark:active:text-[#141414]'
                }`}
              >
                <item.icon size={18} className="shrink-0" /> {item.label}
              </motion.button>
            ))}

            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { delay: 0 } }}
              transition={{ delay: NAV_ITEMS.length * 0.05 + 0.1, type: 'spring', stiffness: 300, damping: 24 }}
            >
              <div className="h-px bg-black/20 dark:bg-white/15 my-2" />
              <button
                onClick={onLogout}
                className={`mt-[21px] w-full flex items-center justify-center gap-3 px-6 py-5 rounded-full font-bold uppercase text-sm tracking-[0.15em] transition-colors bg-transparent border-2 ${SIGNOUT}`}
              >
                <LogOut size={18} /> Abmelden
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
