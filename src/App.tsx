import { useState } from 'react';
import { Header, type MainNavTab } from './components/Header';
import { TablesView } from './components/TablesView';
import { QuestionsView } from './components/QuestionsView';
import { QuestionBankView } from './components/QuestionBankView';
import { SettingsView } from './components/SettingsView';
import { loadUserSettings, recordVerbAttempt } from './utils/srsEngine';
import type { UserSettings } from './utils/srsEngine';

export function App() {
  const [activeTab, setActiveTab] = useState<MainNavTab>('tabelas');
  const [selectedVerbId, setSelectedVerbId] = useState<string>('por');
  const [settings, setSettings] = useState<UserSettings>(loadUserSettings());

  const handleRecordAttempt = (verbId: string, mood: any, tense: any, isCorrect: boolean) => {
    recordVerbAttempt(verbId, mood, tense, isCorrect);
  };

  return (
    <div className="min-h-screen bg-[#121417] text-[#f3ede6] flex flex-col selection:bg-[#383f4a] selection:text-[#f3ede6]">
      {/* Top Navbar with Invisible Background & Static/Relative Position */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuestionLists={() => setActiveTab('listas')}
        onQuickSelectVerb={(verbId) => {
          setSelectedVerbId(verbId);
          setActiveTab('tabelas');
        }}
      />

      {/* Main Content Area (Tabelas, Questões ou Simulados) */}
      <main className="flex-1 pb-16">
        {activeTab === 'tabelas' && (
          <TablesView
            initialVerbId={selectedVerbId}
            strictAccents={settings.strictAccents}
            tableColumns={settings.tableColumns || 2}
            onRecordAttempt={handleRecordAttempt}
          />
        )}

        {activeTab === 'questoes' && (
          <QuestionsView
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
      </main>
    </div>
  );
}

export default App;
