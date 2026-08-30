import React, { useState } from 'react';
import { X, Key, Shield, Check, RotateCcw, Columns } from 'lucide-react';
import { saveUserSettings } from '../utils/srsEngine';
import type { UserSettings } from '../utils/srsEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const [apiKey, setApiKey] = useState<string>(settings.openRouterApiKey || '');
  const [aiModel, setAiModel] = useState<string>(settings.aiModel || 'google/gemini-3.7-flash');
  const [tableColumns, setTableColumns] = useState<1 | 2 | 3>(settings.tableColumns || 2);
  const [strictAccents, setStrictAccents] = useState<boolean>(settings.strictAccents);
  const [savedMessage, setSavedMessage] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserSettings = {
      ...settings,
      openRouterApiKey: apiKey.trim(),
      aiModel: aiModel.trim() || 'google/gemini-3.7-flash',
      tableColumns,
      strictAccents
    };
    saveUserSettings(updated);
    onUpdateSettings(updated);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onClose();
    }, 500);
  };

  const handleClearData = () => {
    if (confirm('Deseja limpar as preferências salvas no navegador?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md max-h-[88vh] flex flex-col rounded-2xl bg-[#181b20] border border-[#2e353e] shadow-2xl overflow-hidden">
        
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b border-[#2e353e] p-5 shrink-0 bg-[#181b20]">
          <div className="flex items-center space-x-2 text-[#f3ede6] font-bold text-sm">
            <Shield className="w-4 h-4 text-[#e8a87c]" />
            <span>Configurações</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9ca3af] hover:text-[#f3ede6] hover:bg-[#242930] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Options Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs font-mono">
          
          {/* Table Columns Layout */}
          <div className="p-3.5 rounded-xl bg-[#20242b] border border-[#2e353e] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#f3ede6]">
              <span className="flex items-center space-x-1.5">
                <Columns className="w-3.5 h-3.5 text-[#e8a87c]" />
                <span>Colunas de Tempos Verbais</span>
              </span>
              <span className="text-[10px] text-[#e8a87c] font-normal">Disposição Lado a Lado</span>
            </div>
            <p className="text-[11px] text-[#9ca3af] font-sans leading-relaxed">
              Exibe os tempos verbais selecionados em colunas lado a lado, com as 6 pessoas abaixo de cada tempo:
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { cols: 1, label: '1 Coluna (Vertical)' },
                { cols: 2, label: '2 Colunas (Lado a Lado)' },
                { cols: 3, label: '3 Colunas (Lado a Lado)' }
              ].map(item => (
                <button
                  key={item.cols}
                  type="button"
                  onClick={() => setTableColumns(item.cols as 1 | 2 | 3)}
                  className={`py-2 px-1.5 rounded-lg border text-center text-[11px] transition-all ${
                    tableColumns === item.cols
                      ? 'bg-[#262c35] border-[#e8a87c] text-[#f3ede6] font-bold shadow-sm'
                      : 'bg-[#15181d] border-[#2e353e] text-[#8b949e] hover:text-[#f3ede6]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Strict Accents */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#20242b] border border-[#2e353e]">
            <div>
              <div className="font-bold text-[#f3ede6]">Acentuação Estrita</div>
              <div className="text-[11px] text-[#9ca3af] font-sans">
                Exige acentos gráficos exatos (mantêm vs mantém).
              </div>
            </div>
            <input
              type="checkbox"
              checked={strictAccents}
              onChange={(e) => setStrictAccents(e.target.checked)}
              className="w-4 h-4 rounded accent-[#e8a87c]"
            />
          </div>

          {/* OpenRouter API Key */}
          <div className="p-3.5 rounded-xl bg-[#20242b] border border-[#2e353e] space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-[#f3ede6]">
              <Key className="w-3.5 h-3.5 text-[#e8a87c]" />
              <span>Chave OpenRouter</span>
            </div>
            <p className="text-[11px] text-[#9ca3af] font-sans leading-relaxed">
              Obrigatória para a aba Questões e para importações assistidas por IA. A chave fica salva apenas neste navegador.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-v1-..."
              className="w-full px-3 py-2 bg-[#15181d] rounded-lg border border-[#2e353e] text-[#f3ede6] text-xs focus:border-[#e8a87c] focus:outline-none placeholder:text-[#525b68]"
            />
          </div>

          {/* AI Model Input */}
          <div className="p-3.5 rounded-xl bg-[#20242b] border border-[#2e353e] space-y-2">
            <div className="flex items-center justify-between font-bold text-[#f3ede6]">
              <span>Modelo de IA</span>
              <span className="text-[10px] text-[#e8a87c] font-normal">OpenRouter ID</span>
            </div>
            <p className="text-[11px] text-[#9ca3af] font-sans leading-relaxed">
              Identificador do modelo utilizado para gerar e analisar questões (padrão: <code>google/gemini-3.7-flash</code>).
            </p>
            <input
              type="text"
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              placeholder="google/gemini-3.7-flash"
              className="w-full px-3 py-2 bg-[#15181d] rounded-lg border border-[#2e353e] text-[#f3ede6] text-xs focus:border-[#e8a87c] focus:outline-none placeholder:text-[#525b68]"
            />
          </div>

          <div className="pt-1">
            <button
              onClick={handleClearData}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-[#20242b] hover:bg-[#282e37] text-[#9ca3af] hover:text-[#f87171] border border-[#2e353e] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar Dados Locais</span>
            </button>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#2e353e] bg-[#14161a] shrink-0">
          {savedMessage ? (
            <span className="text-xs text-[#34d399] font-mono flex items-center space-x-1">
              <Check className="w-4 h-4" />
              <span>Salvo com sucesso</span>
            </span>
          ) : (
            <div />
          )}
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-bold text-xs font-mono transition-all shadow-md active:scale-95"
          >
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
};
