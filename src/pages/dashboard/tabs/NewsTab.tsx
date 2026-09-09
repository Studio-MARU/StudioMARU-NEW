import { news, type NewsItem } from '@/data/news';
import { TabHeader, TabPanel } from '../components/TabPanel';

const BADGE_TONES: Record<NewsItem['tone'], string> = {
  dark: 'bg-black text-white dark:bg-[#EBEBEB] dark:text-[#141414]',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-400/20 dark:text-blue-200',
};

export default function NewsTab() {
  return (
    <TabPanel>
      <TabHeader
        title="Infos & Neuheiten"
        subtitle="Bleiben Sie auf dem Laufenden über neue Formate, Preise und Updates."
      />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {news.map((item) => (
          <div
            key={item.title}
            className="section-glass p-8 rounded-3xl shadow-sm border border-white/50 dark:border-white/10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className={`${BADGE_TONES[item.tone]} text-xs font-bold px-3 py-1 rounded-full`}>
                {item.badge}
              </span>
              <span className="text-sm text-gray-500 dark:text-[#a3a3a3]">{item.date}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-[#EBEBEB] mb-3">{item.title}</h3>
            <p className="text-gray-700 dark:text-[#c9c9c9]">{item.body}</p>
          </div>
        ))}
      </div>
    </TabPanel>
  );
}
