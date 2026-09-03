import { lazy, Suspense, useLayoutEffect, useState } from 'react';
import { Header, type MainNavTab } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { loadUserSettings, recordVerbAttempt } from './utils/srsEngine';
import type { UserSettings } from './utils/srsEngine';

const TablesView = lazy(() => import('./components/TablesView').then(module => ({ default: module.TablesView })));
const QuestionBankView = lazy(() => import('./components/QuestionBankView').then(module => ({ default: module.QuestionBankView })));
const SettingsView = lazy(() => import('./components/SettingsView').then(module => ({ default: module.SettingsView })));

export function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('home');
  const [selectedVerbId, setSelectedVerbId] = useState<string>('por');
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('conjuletter_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('conjuletter_sidebar_collapsed', String(next));
      } catch {
        // no-op
      }
      return next;
    });
  };

  const isVanguard = (settings.theme as string).startsWith('vanguard');

  useLayoutEffect(() => {
    const theme = settings.theme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === 'light' || theme === 'alexandria-light' ? 'light' : 'dark';
  }, [settings.theme]);

  const handleRecordAttempt = (verbId: string, mood: any, tense: any, isCorrect: boolean) => {
    recordVerbAttempt(verbId, mood, tense, isCorrect);
  };

  return (
    <div className={`min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col selection:bg-[var(--theme-accent-soft)] selection:text-[var(--theme-text)] ${
      isVanguard ? (isSidebarCollapsed ? 'md:pl-16' : 'md:pl-60') : ''
    } transition-[padding] duration-250`}>
      {/* Top Navbar with Invisible Background & Static/Relative Position for classic themes */}
      {!isVanguard && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuestionLists={() => setActiveTab('listas')}
          onQuickSelectVerb={(verbId) => {
            setSelectedVerbId(verbId);
            setActiveTab('tabelas');
          }}
        />
      )}

      {/* Retractable Sidebar for Vanguard theme */}
      {isVanguard && (
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenQuestionLists={() => setActiveTab('listas')}
          onQuickSelectVerb={(verbId) => {
            setSelectedVerbId(verbId);
            setActiveTab('tabelas');
          }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && <HomeView />}

        <Suspense fallback={<div className="mx-auto mt-16 h-10 w-10 animate-pulse rounded-full bg-[var(--theme-surface)]" aria-label="Carregando área" />}>
        {activeTab === 'tabelas' && (
          <TablesView
            initialVerbId={selectedVerbId}
            strictAccents={settings.strictAccents}
            tableColumns={settings.tableColumns || 2}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeTab === 'simulados' && (
          <QuestionBankView
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeTab === 'listas' && (
          <QuestionBankView
            initialMode="lists"
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeTab === 'configuracoes' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}
        </Suspense>
      </main>
    </div>
  );
}

export default App;
