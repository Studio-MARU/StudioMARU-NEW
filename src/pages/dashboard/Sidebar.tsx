import { LogOut } from 'lucide-react';
import LogoBadge from '@/components/ui/LogoBadge';
import { NAV_ITEMS, type TabId } from './navigation';

/** Warnfarbe des Abmelden-Buttons. */
const SIGNOUT = 'border-[#e78806] text-[#e78806] hover:bg-[#e78806] hover:text-[#EBEBEB]';

type Props = {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onLogout: () => void;
};

export default function Sidebar({ activeTab, onSelectTab, onLogout }: Props) {
  // Die Sidebar hebt sich minimal vom Seitenhintergrund ab.
  const panel = 'bg-[#F3F3F4] dark:bg-white/[0.03]';

  return (
    <aside className="w-64 section-glass border-r border-white/50 dark:border-white/10 h-screen sticky top-0 hidden md:flex flex-col z-40">
      <div className={`p-6 border-b border-white/50 dark:border-white/10 ${panel}`}>
        <div className="flex flex-col items-center justify-center gap-4">
          <LogoBadge
            className="w-20 h-16 rounded-[2rem] shrink-0 shadow-md"
            alt="Studio Maru Profil"
            title="Profil & Einstellungen"
            onClick={() => onSelectTab('profile')}
          />
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-[#EBEBEB]">
            Kundenportal
          </span>
        </div>
      </div>

      <nav className={`flex-1 p-4 space-y-4 ${panel}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors ${
              activeTab === item.id
                ? 'bg-black text-[#EBEBEB] dark:bg-[#EBEBEB] dark:text-[#141414]'
                : 'bg-transparent border-2 border-black text-black hover:bg-black hover:text-[#EBEBEB] dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:hover:bg-[#EBEBEB] dark:hover:text-[#141414]'
            }`}
          >
            <item.icon size={18} className="shrink-0" /> {item.label}
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t border-white/50 dark:border-white/10 ${panel}`}>
        <button
          onClick={onLogout}
          className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold uppercase text-xs tracking-[0.15em] transition-colors bg-transparent border-2 ${SIGNOUT}`}
        >
          <LogOut size={18} /> Abmelden
        </button>
      </div>
    </aside>
  );
}
