import React, { useState } from 'react';
import {
  Check,
  Columns3,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  RotateCcw,
  Save,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { saveUserSettings } from '../utils/srsEngine';
import type { UserSettings } from '../utils/srsEngine';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

const DEFAULT_MODEL = 'google/gemini-3.7-flash';

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [apiKey, setApiKey] = useState(settings.openRouterApiKey || '');
  const [aiModel, setAiModel] = useState(settings.aiModel || DEFAULT_MODEL);
  const [tableColumns, setTableColumns] = useState<1 | 2 | 3>(settings.tableColumns || 2);
  const [strictAccents, setStrictAccents] = useState(settings.strictAccents);
  const [showApiKey, setShowApiKey] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const hasApiKey = apiKey.trim().length > 0;
  const hasChanges = apiKey.trim() !== (settings.openRouterApiKey || '')
    || aiModel.trim() !== (settings.aiModel || DEFAULT_MODEL)
    || tableColumns !== (settings.tableColumns || 2)
    || strictAccents !== settings.strictAccents;

  const handleSave = () => {
    const updated: UserSettings = {
      ...settings,
      openRouterApiKey: apiKey.trim(),
      aiModel: aiModel.trim() || DEFAULT_MODEL,
      tableColumns,
      strictAccents
    };
    saveUserSettings(updated);
    onUpdateSettings(updated);
    setSavedMessage(true);
    window.setTimeout(() => setSavedMessage(false), 2400);
  };

  const handleClearData = () => {
    if (window.confirm('Deseja apagar configurações, listas, respostas e todo o progresso salvo neste navegador?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="overflow-hidden rounded-2xl border border-[#2e353e] bg-[#181b20] shadow-xl">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e8a87c]/30 bg-[#2a1d17] text-[#e8a87c]">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#e8a87c]">Preferências do sistema</div>
              <h1 className="mt-1 text-2xl font-bold text-[#f3ede6] sm:text-3xl">Configurações</h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#9ca3af]">
                Personalize o treino, conecte os recursos de IA e gerencie os dados armazenados neste navegador.
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 self-start rounded-xl border px-3 py-2 text-xs font-mono ${
            hasApiKey
              ? 'border-[#34d399]/30 bg-[#182a22] text-[#34d399]'
              : 'border-[#e8a87c]/30 bg-[#2a1d17] text-[#e8a87c]'
          }`}>
            <span className={`h-2 w-2 rounded-full ${hasApiKey ? 'bg-[#34d399]' : 'bg-[#e8a87c]'}`} />
            {hasApiKey ? 'IA configurada' : 'IA aguardando chave'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#2e353e] bg-[#181b20] p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-[#262b33] pb-4">
              <SlidersHorizontal className="mt-0.5 h-4 w-4 text-[#e8a87c]" />
              <div>
                <h2 className="font-mono text-sm font-bold text-[#f3ede6]">Experiência de estudo</h2>
                <p className="mt-1 text-xs text-[#8b949e]">Preferências aplicadas às tabelas e validações verbais.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-[#2e353e] bg-[#20242b] p-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#f3ede6]">
                  <Columns3 className="h-4 w-4 text-[#e8a87c]" />
                  Colunas dos tempos verbais
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-[#9ca3af]">Define quantas tabelas aparecem lado a lado na Sessão Multi-Tempos.</p>
                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {([1, 2, 3] as const).map(columns => (
                    <button
                      key={columns}
                      type="button"
                      onClick={() => setTableColumns(columns)}
                      className={`rounded-xl border px-3 py-3 text-left transition-all ${
                        tableColumns === columns
                          ? 'border-[#e8a87c] bg-[#2a1d17] text-[#f3ede6]'
                          : 'border-[#343c46] bg-[#15181d] text-[#9ca3af] hover:border-[#4a5563] hover:text-[#f3ede6]'
                      }`}
                    >
                      <span className="block font-mono text-sm font-bold">{columns} {columns === 1 ? 'coluna' : 'colunas'}</span>
                      <span className="mt-0.5 block text-[10px]">{columns === 1 ? 'Leitura vertical' : columns === 2 ? 'Equilíbrio visual' : 'Maior densidade'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#2e353e] bg-[#20242b] p-4">
                <div>
                  <div className="font-mono text-xs font-bold text-[#f3ede6]">Acentuação estrita</div>
                  <p className="mt-1 text-xs leading-relaxed text-[#9ca3af]">Exige todos os acentos gráficos e diferencia formas como “mantém” e “mantêm”.</p>
                </div>
                <input
                  type="checkbox"
                  checked={strictAccents}
                  onChange={event => setStrictAccents(event.target.checked)}
                  className="h-5 w-5 shrink-0 accent-[#e8a87c]"
                />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[#2e353e] bg-[#181b20] p-5 shadow-xl sm:p-6">
            <div className="mb-5 flex items-start gap-3 border-b border-[#262b33] pb-4">
              <Sparkles className="mt-0.5 h-4 w-4 text-[#e8a87c]" />
              <div>
                <h2 className="font-mono text-sm font-bold text-[#f3ede6]">Inteligência artificial</h2>
                <p className="mt-1 text-xs text-[#8b949e]">Usada somente para gerar questões e auxiliar importações.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="openrouter-key" className="flex items-center gap-2 font-mono text-xs font-bold text-[#f3ede6]">
                  <KeyRound className="h-3.5 w-3.5 text-[#e8a87c]" />
                  Chave OpenRouter
                </label>
                <p className="mt-1 text-[11px] leading-relaxed text-[#8b949e]">A chave permanece somente neste navegador e não é necessária para tabelas ou para o banco local.</p>
                <div className="relative mt-2">
                  <input
                    id="openrouter-key"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={event => setApiKey(event.target.value)}
                    placeholder="sk-or-v1-..."
                    autoComplete="off"
                    className="w-full rounded-xl border border-[#343c46] bg-[#15181d] px-3 py-3 pr-11 font-mono text-xs text-[#f3ede6] outline-none placeholder:text-[#525b68] focus:border-[#e8a87c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(current => !current)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8b949e] hover:bg-[#242930] hover:text-[#f3ede6]"
                    aria-label={showApiKey ? 'Ocultar chave' : 'Mostrar chave'}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="ai-model" className="font-mono text-xs font-bold text-[#f3ede6]">Modelo da OpenRouter</label>
                <p className="mt-1 text-[11px] leading-relaxed text-[#8b949e]">Informe o identificador exato do modelo compatível com JSON Schema.</p>
                <input
                  id="ai-model"
                  type="text"
                  value={aiModel}
                  onChange={event => setAiModel(event.target.value)}
                  placeholder={DEFAULT_MODEL}
                  className="mt-2 w-full rounded-xl border border-[#343c46] bg-[#15181d] px-3 py-3 font-mono text-xs text-[#f3ede6] outline-none placeholder:text-[#525b68] focus:border-[#e8a87c]"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#f87171]/20 bg-[#181b20] p-5 shadow-xl sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Database className="mt-0.5 h-4 w-4 text-[#f87171]" />
                <div>
                  <h2 className="font-mono text-sm font-bold text-[#f3ede6]">Dados locais</h2>
                  <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#9ca3af]">Apaga preferências, listas salvas, respostas, questões importadas e todo o progresso deste navegador.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearData}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#f87171]/30 bg-[#2f1c1f] px-4 py-2.5 font-mono text-xs text-[#f87171] hover:border-[#f87171]/60"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Resetar dados locais
              </button>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl border border-[#2e353e] bg-[#181b20] p-5 shadow-xl">
            <ShieldCheck className="h-5 w-5 text-[#34d399]" />
            <h2 className="mt-3 font-mono text-sm font-bold text-[#f3ede6]">Privacidade local</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#9ca3af]">As preferências e a chave ficam no armazenamento local do navegador. O ConjuLetter não possui backend próprio.</p>
          </div>

          <div className="rounded-2xl border border-[#2e353e] bg-[#181b20] p-5 shadow-xl">
            <h2 className="font-mono text-sm font-bold text-[#f3ede6]">Resumo atual</h2>
            <dl className="mt-4 space-y-3 text-xs">
              <div className="flex items-center justify-between gap-3"><dt className="text-[#8b949e]">Tabelas</dt><dd className="font-mono text-[#f3ede6]">{tableColumns} col.</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-[#8b949e]">Acentos</dt><dd className="font-mono text-[#f3ede6]">{strictAccents ? 'Estritos' : 'Flexíveis'}</dd></div>
              <div className="flex items-center justify-between gap-3"><dt className="text-[#8b949e]">OpenRouter</dt><dd className={hasApiKey ? 'font-mono text-[#34d399]' : 'font-mono text-[#e8a87c]'}>{hasApiKey ? 'Configurada' : 'Pendente'}</dd></div>
            </dl>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8a87c] px-5 py-3 font-mono text-xs font-bold text-[#16181b] shadow-lg transition-all hover:bg-[#f0b58e] active:scale-[0.99]"
          >
            {savedMessage ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {savedMessage ? 'Configurações salvas' : hasChanges ? 'Salvar alterações' : 'Tudo salvo'}
          </button>
        </aside>
      </div>
    </div>
  );
};
