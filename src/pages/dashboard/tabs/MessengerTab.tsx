import { Send } from 'lucide-react';
import LogoBadge from '@/components/ui/LogoBadge';
import { TabHeader, TabPanel } from '../components/TabPanel';

/**
 * Chat-Ansicht. Noch reine Oberfläche: Nachrichten werden nirgends
 * gespeichert oder verschickt — dafür braucht es ein Backend.
 */
export default function MessengerTab() {
  return (
    <TabPanel className="max-w-3xl h-[640px] lg:h-[calc(100vh-9rem)] lg:min-h-[32rem] flex flex-col">
      <TabHeader
        title="Nachrichten"
        subtitle="Ihr direkter Draht zu Studio Maru."
        className="shrink-0"
        spacing="mb-6"
      />

      <div className="flex-1 section-glass rounded-3xl border border-white/50 dark:border-white/10 flex flex-col overflow-hidden z-10 relative">
        <div className="p-4 border-b border-white/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.04] backdrop-blur-md flex items-center gap-3">
          <LogoBadge className="w-[3.75rem] h-[3rem] rounded-[1rem] shrink-0 shadow-sm" />
          <div>
            <h3 className="font-bold text-sm dark:text-[#EBEBEB]">Studio Maru Support</h3>
            <p className="text-xs text-green-600 dark:text-green-400">Online</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-white/20 dark:bg-transparent">
          <div className="self-start max-w-[80%] bg-white dark:bg-white/[0.08] p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 dark:border-white/10">
            <p className="text-sm dark:text-[#EBEBEB]">
              Hallo! Wie können wir Ihnen heute bei Ihrem Projekt helfen?
            </p>
            <p className="text-[10px] text-gray-400 dark:text-[#8a8a8a] mt-2">10:00</p>
          </div>
        </div>

        <div className="p-4 bg-white/50 dark:bg-white/[0.04] backdrop-blur-md border-t border-white/50 dark:border-white/10">
          <div className="flex items-center gap-2 relative">
            <input
              type="text"
              placeholder="Ihre Nachricht..."
              className="w-full border-2 border-black rounded-full pl-6 pr-12 py-3 bg-transparent text-sm focus:outline-none dark:border-[#EBEBEB] dark:text-[#EBEBEB] dark:placeholder:text-[#8a8a8a]"
            />
            <button className="absolute right-2 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 dark:bg-[#EBEBEB] dark:text-[#141414] dark:hover:bg-white transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </TabPanel>
  );
}
