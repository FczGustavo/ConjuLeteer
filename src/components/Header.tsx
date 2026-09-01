import React, { useEffect, useRef, useState } from 'react';
import { Settings as SettingsIcon, Search, BookOpen, Library, ListChecks, ChevronDown, ChevronRight, House } from 'lucide-react';
import { CANONICAL_VERBS } from '../data/canonicalVerbs';

export type MainNavTab = 'home' | 'tabelas' | 'simulados' | 'listas' | 'configuracoes';

interface HeaderProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenQuestionLists: () => void;
  onQuickSelectVerb?: (verbId: string) => void;
}

interface NavigationDrawerProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenQuestionLists: () => void;
  isExpanded: boolean;
  onToggle: () => void;
  mobile?: boolean;
}

/** Compact navigation: Home stays visible while the study tools slide out from the drawer. */
const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuestionLists,
  isExpanded,
  onToggle,
  mobile = false
}) => {
  const drawerId = `${mobile ? 'mobile' : 'desktop'}-navigation-drawer`;
  const isBankActive = activeTab === 'simulados' || activeTab === 'listas';

  return (
    <nav
      aria-label={mobile ? 'Navegação móvel' : 'Navegação principal'}
      className={`home-nav${isExpanded ? ' home-nav--expanded' : ''}${mobile ? ' home-nav--mobile' : ''}`}
    >
      <button
        type="button"
        onClick={() => {
          setActiveTab('home');
          if (isExpanded) onToggle();
        }}
        className={`home-nav__home${activeTab === 'home' ? ' is-active' : ''}`}
        aria-current={activeTab === 'home' ? 'page' : undefined}
      >
        <House className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Home</span>
      </button>

      <button
        type="button"
        onClick={onToggle}
        className="home-nav__toggle"
        aria-expanded={isExpanded}
        aria-controls={drawerId}
        aria-label={isExpanded ? 'Recolher navegação' : 'Abrir navegação'}
      >
        <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      <div id={drawerId} className="home-nav__drawer" aria-hidden={!isExpanded}>
        <div className="home-nav__drawer-inner">
          <button
            type="button"
            tabIndex={isExpanded ? 0 : -1}
            onClick={() => setActiveTab('tabelas')}
            className={`home-nav__item${activeTab === 'tabelas' ? ' is-active' : ''}`}
            aria-current={activeTab === 'tabelas' ? 'page' : undefined}
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Tabelas</span>
          </button>

          <div className="home-nav__bank-wrap group relative">
            <button
              type="button"
              tabIndex={isExpanded ? 0 : -1}
              onClick={() => setActiveTab('simulados')}
              className={`home-nav__item${isBankActive ? ' is-active' : ''}`}
              aria-current={isBankActive ? 'page' : undefined}
              aria-haspopup="menu"
            >
              <Library className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Banco de Questões</span>
              <ChevronDown className="h-3 w-3 opacity-70" aria-hidden="true" />
            </button>
            <div className="home-nav__bank-menu invisible absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="home-nav__bank-menu-inner">
                <button type="button" tabIndex={isExpanded ? 0 : -1} onClick={() => setActiveTab('simulados')}>
                  <Library className="h-3.5 w-3.5" aria-hidden="true" />
                  Filtrar banco
                </button>
                <button type="button" tabIndex={isExpanded ? 0 : -1} onClick={onOpenQuestionLists}>
                  <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                  Listas salvas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuestionLists,
  onQuickSelectVerb
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSearchOpen) return;
    const returnFocus = searchButtonRef.current;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
      if (event.key === 'Tab') {
        const focusable = searchDialogRef.current?.querySelectorAll<HTMLElement>('input,button,[tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); returnFocus?.focus(); };
  }, [isSearchOpen]);

  const filteredVerbs = searchQuery.trim() === ''
    ? CANONICAL_VERBS.slice(0, 6)
    : CANONICAL_VERBS.filter(v =>
        v.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.primitiveRoot && v.primitiveRoot.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  return (
    <>
      <header className="site-header relative z-30 w-full px-4 pt-4 sm:px-8 sm:pt-5">
        <div className="relative mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-4">
          <div
            className="flex cursor-pointer select-none items-center"
            onClick={() => {
              setActiveTab('home');
              setIsNavExpanded(false);
            }}
            title="ConjuLetter"
            role="button"
            tabIndex={0}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                setActiveTab('home');
                setIsNavExpanded(false);
              }
            }}
          >
            <span className="brand-wordmark text-lg font-semibold tracking-tight text-[#f3ede6] transition-colors hover:text-[#e8a87c]">
              Conju<span className="text-[#e8a87c]">Letter</span>
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-center sm:flex">
            <div className="pointer-events-auto">
              <NavigationDrawer
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenQuestionLists={onOpenQuestionLists}
                isExpanded={isNavExpanded}
                onToggle={() => setIsNavExpanded(value => !value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              ref={searchButtonRef}
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="icon-button rounded-full border border-transparent p-2.5 text-[#8b949e] transition-colors hover:border-[#2e353e] hover:bg-[#1f242b] hover:text-[#f3ede6]"
              title="Buscar verbo (Ctrl+K)"
              aria-label="Buscar verbo"
            >
              <Search className="h-4 w-4 stroke-[1.75]" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('configuracoes')}
              className={`icon-button rounded-full border p-2.5 transition-colors ${
                activeTab === 'configuracoes'
                  ? 'border-[#e8a87c]/40 bg-[#262c35] text-[#e8a87c]'
                  : 'border-transparent text-[#8b949e] hover:border-[#2e353e] hover:bg-[#1f242b] hover:text-[#f3ede6]'
              }`}
              title="Abrir Configurações"
              aria-label="Abrir Configurações"
            >
              <SettingsIcon className="h-4 w-4 stroke-[1.75]" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex justify-center sm:hidden">
          <NavigationDrawer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenQuestionLists={onOpenQuestionLists}
            isExpanded={isNavExpanded}
            onToggle={() => setIsNavExpanded(value => !value)}
            mobile
          />
        </div>
      </header>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-20 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            ref={searchDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar verbo"
            className="w-full max-w-lg space-y-3 rounded-2xl border border-[#2e353e] bg-[#181b20] p-4 shadow-2xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Buscar verbo militar (ex: pôr, reaver, intervir, prever)..."
                className="w-full rounded-xl border border-[#2e353e] bg-[#121417] py-3 pl-10 pr-4 text-sm text-[#f3ede6] placeholder:text-[#6b7280] focus:border-[#e8a87c] focus:outline-none"
              />
            </div>

            <div className="max-h-64 divide-y divide-[#262b33] overflow-y-auto pt-1">
              {filteredVerbs.map(verb => (
                <div
                  key={verb.id}
                  onClick={() => {
                    if (onQuickSelectVerb) onQuickSelectVerb(verb.id);
                    setActiveTab('tabelas');
                    setIsSearchOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-lg p-2.5 transition-colors hover:bg-[#20252c]"
                >
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-[#f3ede6]">{verb.infinitive}</span>
                    <span className="ml-2 font-mono text-[10px] text-[#8b949e]">({verb.classification})</span>
                    {verb.criticalTrapDescription && (
                      <p className="mt-0.5 max-w-sm truncate text-[10px] text-[#9ca3af]">{verb.criticalTrapDescription}</p>
                    )}
                  </div>
                  <span className="rounded border border-[#343c46] bg-[#242930] px-1.5 py-0.5 font-mono text-[10px] text-[#e8a87c]">Treinar</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
