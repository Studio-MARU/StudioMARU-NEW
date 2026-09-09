import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackgroundGlow from '@/components/ui/BackgroundGlow';
import Sidebar from './Sidebar';
import { MobileHeader, MobileMenu, MobileMenuButton } from './MobileNav';
import type { TabId } from './navigation';
import ExamplesTab from './tabs/ExamplesTab';
import HistoryTab from './tabs/HistoryTab';
import MessengerTab from './tabs/MessengerTab';
import NewProjectTab from './tabs/NewProjectTab';
import NewsTab from './tabs/NewsTab';
import OverviewTab from './tabs/OverviewTab';
import ProfileTab from './tabs/ProfileTab';
import TemplatesTab from './tabs/TemplatesTab';

/**
 * Das Kundenportal.
 *
 * Die Reiter werden über einen State-Wert umgeschaltet, nicht über den
 * Router — deshalb bleibt die Adresse immer /dashboard.
 *
 * Der dunkle Modus setzt die Klasse `dark-mode-active` ganz außen; die
 * zugehörigen Regeln stehen gesammelt am Ende von src/index.css.
 */
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  // Welches gespeicherte Projekt gerade im Editor liegt (null = neues Projekt).
  const [bearbeiteId, setBearbeiteId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => navigate('/');

  /** Aus der Navigation gewählt — dabei einen offenen Projekt-Editor verwerfen. */
  const reiterWechseln = (tab: TabId) => {
    setBearbeiteId(null);
    setActiveTab(tab);
  };

  /** Aus der Projektliste geöffnet — Editor mit diesem Projekt füllen. */
  const projektBearbeiten = (id: string) => {
    setBearbeiteId(id);
    setActiveTab('new_project');
  };

  /**
   * Die Modus-Klasse sitzt am <body>, nicht am Dashboard selbst.
   *
   * Grund: Dialoge und die Vollbild-Vorschau werden per Portal direkt in den
   * Body gerendert — sonst lägen sie im Stapelkontext von <main> und
   * verschwänden hinter der Sidebar. Am Body ist die Klasse auch für sie ein
   * Vorfahre, sodass die dark:-Varianten dort greifen.
   */
  useEffect(() => {
    document.body.classList.toggle('dark-mode-active', isDarkMode);
    return () => document.body.classList.remove('dark-mode-active');
  }, [isDarkMode]);

  return (
    <div className="relative min-h-screen flex selection:bg-blue-100 transition-colors duration-300 bg-[#EBEBEB] text-black dark:bg-[#141414] dark:text-[#EBEBEB]">
      <BackgroundGlow className="fixed inset-0 z-[-10] overflow-hidden pointer-events-none dark:opacity-40" />

      <div className="fixed right-0 bottom-0 w-80 md:w-[45rem] z-0 pointer-events-none transition-opacity">
        <img
          src="/frog-bird.png"
          alt=""
          aria-hidden="true"
          className="illu-invertierbar w-full h-auto object-contain mix-blend-multiply object-right-bottom"
        />
      </div>

      <Sidebar activeTab={activeTab} onSelectTab={reiterWechseln} onLogout={handleLogout} />

      <MobileHeader onOpenProfile={() => setActiveTab('profile')} />
      <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <MobileMenu
        isOpen={isMobileMenuOpen}
        activeTab={activeTab}
        onSelectTab={reiterWechseln}
        onClose={() => setIsMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      {/* Kein overflow-y-auto: <main> wächst mit dem Inhalt und scrollt selbst
          nie, macht aber als Scroll-Container jedes sticky darin unwirksam —
          die mitlaufende Vorschau im Projekt-Editor hing genau daran. */}
      <main className="flex-1 p-6 pt-[190px] md:pt-12 md:p-12 relative z-10 bg-[#EBEBEB] dark:bg-transparent">
        {activeTab === 'profile' && (
          <ProfileTab isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        )}
        {activeTab === 'overview' && <OverviewTab onOpenMessenger={() => setActiveTab('messenger')} />}
        {activeTab === 'messenger' && <MessengerTab />}
        {activeTab === 'new_project' && (
          <NewProjectTab onBack={() => setActiveTab('overview')} bearbeiteId={bearbeiteId} />
        )}
        {activeTab === 'templates' && (
          <TemplatesTab onEdit={projektBearbeiten} onNeu={() => reiterWechseln('new_project')} />
        )}
        {activeTab === 'examples' && <ExamplesTab />}
        {activeTab === 'news' && <NewsTab />}
        {activeTab === 'history' && <HistoryTab onEdit={projektBearbeiten} />}
      </main>
    </div>
  );
}
