import React, { useState } from 'react';
import { Settings as SettingsIcon, Search, FileText, BookOpen, Library, ListChecks, ChevronDown } from 'lucide-react';
import { CANONICAL_VERBS } from '../data/canonicalVerbs';

export type MainNavTab = 'tabelas' | 'questoes' | 'simulados' | 'listas';

interface HeaderProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenSettings: () => void;
  onOpenQuestionLists: () => void;
  onQuickSelectVerb?: (verbId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenQuestionLists,
  onQuickSelectVerb
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVerbs = searchQuery.trim() === ''
    ? CANONICAL_VERBS.slice(0, 6)
    : CANONICAL_VERBS.filter(v => 
        v.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.primitiveRoot && v.primitiveRoot.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <>
      {/* Navbar com fundo invisível e posição estática (não acompanha o scroll) */}
      <header className="w-full bg-transparent border-b border-transparent relative z-30 pt-3 sm:pt-4 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 min-h-14 flex flex-wrap sm:flex-nowrap items-center justify-between gap-y-3">
          
          {/* Logo limpo com apenas a escrita ConjuLetter */}
          <div 
            className="flex items-center cursor-pointer select-none" 
            onClick={() => setActiveTab('tabelas')}
            title="ConjuLetter"
          >
            <span className="font-bold text-lg text-[#f3ede6] tracking-tight hover:text-[#e8a87c] transition-colors">
              Conju<span className="text-[#e8a87c]">Letter</span>
            </span>
          </div>

          {/* Central Dock com botões mais quadradinhos (rounded-xl) */}
          <nav className="order-3 sm:order-none w-full sm:w-auto inline-flex items-stretch justify-center p-1 rounded-xl bg-[#181b20]/90 border border-[#2e353e] shadow-lg shadow-black/20">
            <button
              onClick={() => setActiveTab('tabelas')}
              className={`flex flex-1 sm:flex-none justify-center items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all duration-150 ${
                activeTab === 'tabelas'
                  ? 'bg-[#262c35] text-[#f3ede6] font-bold shadow-sm'
                  : 'text-[#8b949e] hover:text-[#f3ede6] hover:bg-[#20242b]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 opacity-90 text-[#e8a87c]" />
              <span>Tabelas</span>
            </button>

            <button
              onClick={() => setActiveTab('questoes')}
              className={`flex flex-1 sm:flex-none justify-center items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all duration-150 ${
                activeTab === 'questoes'
                  ? 'bg-[#262c35] text-[#f3ede6] font-bold shadow-sm'
                  : 'text-[#8b949e] hover:text-[#f3ede6] hover:bg-[#20242b]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 opacity-90 text-[#e8a87c]" />
              <span>Questões</span>
            </button>

            <div className="group relative flex flex-1 sm:flex-none">
              <button
                onClick={() => setActiveTab('simulados')}
                className={`flex w-full justify-center items-center gap-1.5 px-2 sm:px-4 py-2 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono transition-all duration-150 ${
                activeTab === 'simulados' || activeTab === 'listas'
                  ? 'bg-[#262c35] text-[#f3ede6] font-bold shadow-sm'
                  : 'text-[#8b949e] hover:text-[#f3ede6] hover:bg-[#20242b]'
              }`}
              >
                <Library className="w-3.5 h-3.5 opacity-90 text-[#e8a87c]" />
                <span>Banco de Questões</span>
                <ChevronDown className="h-3 w-3 text-[#8b949e]" />
              </button>
              <div className="invisible absolute right-0 top-full z-50 w-52 translate-x-0 pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 sm:left-1/2 sm:right-auto sm:-translate-x-1/2">
                <div className="rounded-xl border border-[#343c46] bg-[#181b20] p-1.5 shadow-2xl">
                  <button onClick={() => setActiveTab('simulados')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-mono text-[#d1d5db] hover:bg-[#262c35]">
                    <Library className="h-3.5 w-3.5 text-[#e8a87c]" />
                    Filtrar banco
                  </button>
                  <button onClick={onOpenQuestionLists} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-mono text-[#d1d5db] hover:bg-[#262c35]">
                    <ListChecks className="h-3.5 w-3.5 text-[#e8a87c]" />
                    Listas salvas
                  </button>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-xl text-[#8b949e] hover:text-[#f3ede6] hover:bg-[#1f242b] border border-transparent hover:border-[#2e353e] transition-colors"
              title="Buscar verbo (Ctrl+K)"
            >
              <Search className="w-4 h-4 stroke-[1.75]" />
            </button>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-[#8b949e] hover:text-[#f3ede6] hover:bg-[#1f242b] border border-transparent hover:border-[#2e353e] transition-colors"
              title="Configurações e Chave OpenRouter"
            >
              <SettingsIcon className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>

        </div>
      </header>

      {/* Quick Search Modal */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="w-full max-w-lg rounded-2xl bg-[#181b20] border border-[#2e353e] p-4 shadow-2xl space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <Search className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar verbo militar (ex: pôr, reaver, intervir, prever)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#121417] rounded-xl border border-[#2e353e] text-xs font-mono text-[#f3ede6] focus:border-[#e8a87c] focus:outline-none placeholder:text-[#6b7280]"
              />
            </div>

            <div className="divide-y divide-[#262b33] max-h-64 overflow-y-auto pt-1">
              {filteredVerbs.map(verb => (
                <div
                  key={verb.id}
                  onClick={() => {
                    if (onQuickSelectVerb) {
                      onQuickSelectVerb(verb.id);
                    }
                    setActiveTab('tabelas');
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 hover:bg-[#20252c] rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-mono font-bold text-xs uppercase text-[#f3ede6]">
                      {verb.infinitive}
                    </span>
                    <span className="text-[10px] text-[#8b949e] ml-2 font-mono">
                      ({verb.classification})
                    </span>
                    {verb.criticalTrapDescription && (
                      <p className="text-[10px] text-[#9ca3af] truncate max-w-sm mt-0.5">
                        {verb.criticalTrapDescription}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#242930] text-[#e8a87c] border border-[#343c46]">
                    Treinar
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
