import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Columns3,
  RotateCcw,
  Save,
  Settings
} from 'lucide-react';
import { saveUserSettings } from '../utils/srsEngine';
import type { ThemeId, UserSettings } from '../utils/srsEngine';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const [tableColumns, setTableColumns] = useState<1 | 2 | 3>(settings.tableColumns || 2);
  const [strictAccents, setStrictAccents] = useState(settings.strictAccents);
  const [theme, setTheme] = useState<ThemeId>(settings.theme);
  const persistedTheme = useRef(settings.theme);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === 'light' || theme === 'alexandria-light' ? 'light' : 'dark';
  }, [theme]);

  useEffect(() => {
    return () => {
      const previousTheme = persistedTheme.current;
      document.documentElement.dataset.theme = previousTheme;
      document.documentElement.style.colorScheme = previousTheme === 'light' || previousTheme === 'alexandria-light' ? 'light' : 'dark';
    };
  }, []);

  const handleSave = () => {
    const updated: UserSettings = {
      ...settings,
      tableColumns,
      strictAccents,
      theme
    };
    saveUserSettings(updated);
    persistedTheme.current = theme;
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
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 shadow-xl sm:p-6">
        <div className="mb-6 flex items-center gap-3 border-b border-[#262b33] pb-4">
          <Settings className="h-5 w-5 text-[#e8a87c]" />
          <h1 className="font-mono text-lg font-bold text-[#f3ede6]">Configurações</h1>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-[#2e353e] bg-[#20242b] p-4">
            <div className="mb-3 flex items-center gap-2 font-mono text-xs font-bold text-[#f3ede6]">
              <Columns3 className="h-4 w-4 text-[#e8a87c]" />
              <span>Quantidade de colunas</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([1, 2, 3] as const).map(columns => (
                <button
                  key={columns}
                  type="button"
                  onClick={() => setTableColumns(columns)}
                  aria-pressed={tableColumns === columns}
                  className={`rounded-xl border px-3 py-2.5 font-mono text-xs transition-all ${
                    tableColumns === columns
                      ? 'border-[#e8a87c] bg-[#2a1d17] font-bold text-[#f3ede6]'
                      : 'border-[#343c46] bg-[#15181d] text-[#9ca3af] hover:border-[#4a5563] hover:text-[#f3ede6]'
                  }`}
                >
                  {columns} {columns === 1 ? 'coluna' : 'colunas'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#2e353e] bg-[#20242b] p-4">
            <div className="mb-3 font-mono text-xs font-bold text-[#f3ede6]">Tema</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {([
                { id: 'dark' as const, label: 'Original escuro', swatch: 'settings-theme-swatch settings-theme-swatch--dark' },
                { id: 'light' as const, label: 'Original claro', swatch: 'settings-theme-swatch settings-theme-swatch--light' },
                { id: 'alexandria-dark' as const, label: 'Alexandria escuro', swatch: 'settings-theme-swatch settings-theme-swatch--alexandria-dark' },
                { id: 'alexandria-light' as const, label: 'Alexandria claro', swatch: 'settings-theme-swatch settings-theme-swatch--alexandria-light' }
              ]).map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  aria-pressed={theme === option.id}
                  className={`settings-theme-option rounded-xl border px-3 py-2.5 font-mono text-xs transition-all ${
                    theme === option.id
                      ? 'border-[#e8a87c] bg-[#2a1d17] font-bold text-[#f3ede6]'
                      : 'border-[#343c46] bg-[#15181d] text-[#9ca3af] hover:border-[#4a5563] hover:text-[#f3ede6]'
                  }`}
                >
                  <span className={option.swatch} aria-hidden="true" />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#2e353e] bg-[#20242b] p-4">
            <span className="font-mono text-xs font-bold text-[#f3ede6]">Usar acentuação estrita</span>
            <input
              type="checkbox"
              checked={strictAccents}
              onChange={event => setStrictAccents(event.target.checked)}
              className="h-5 w-5 shrink-0 accent-[#e8a87c]"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-[#262b33] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleClearData}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#f87171]/30 bg-[#2f1c1f] px-4 py-2.5 font-mono text-xs text-[#f87171] transition-colors hover:border-[#f87171]/60"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Resetar dados
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#e8a87c] px-5 py-2.5 font-mono text-xs font-bold text-[#16181b] shadow-lg transition-all hover:bg-[#f0b58e] active:scale-[0.99]"
          >
            {savedMessage ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {savedMessage ? 'Salvo' : 'Salvar'}
          </button>
        </div>
      </section>
    </div>
  );
};
