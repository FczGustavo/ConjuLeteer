import React, { useEffect, useRef, useState } from 'react';
import { 
  House, 
  BookOpen, 
  Library, 
  ListChecks, 
  Search, 
  Settings as SettingsIcon, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  Layers,
  ChevronDown
} from 'lucide-react';
import type { MainNavTab } from './Header';
import { CANONICAL_VERBS } from '../data/canonicalVerbs';

interface SidebarProps {
  activeTab: MainNavTab;
  setActiveTab: (tab: MainNavTab) => void;
  onOpenQuestionLists: () => void;
  onQuickSelectVerb?: (verbId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenQuestionLists,
  onQuickSelectVerb,
  isCollapsed,
  onToggleCollapse
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isBankMenuOpen, setIsBankMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const searchDialogRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Search dialog focus trap and Escape
  useEffect(() => {
    if (!isSearchOpen) return;
    const returnFocus = searchButtonRef.current;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSearchOpen(false);
      if (event.key === 'Tab') {
        const focusable = searchDialogRef.current?.querySelectorAll<HTMLElement>('input,button,[tabindex]:not([tabindex="-1"])');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      returnFocus?.focus();
    };
  }, [isSearchOpen]);

  const filteredVerbs = searchQuery.trim() === ''
    ? CANONICAL_VERBS.slice(0, 6)
    : CANONICAL_VERBS.filter(v =>
        v.infinitive.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.classification.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.primitiveRoot && v.primitiveRoot.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  const isBankActive = activeTab === 'simulados' || activeTab === 'listas';

  const handleNavClick = (tab: MainNavTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const navItems = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: House,
      onClick: () => handleNavClick('home'),
      isActive: activeTab === 'home'
    },
    {
      id: 'tabelas' as const,
      label: 'Tabelas',
      icon: BookOpen,
      onClick: () => handleNavClick('tabelas'),
      isActive: activeTab === 'tabelas'
    }
  ];

  return (
    <>
      {/* Mobile Top App Bar (Only on mobile when Vanguard is active) */}
      <header className="vanguard-mobile-bar sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 md:hidden">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-inset)] text-[var(--theme-text-muted)] transition-colors hover:text-[var(--theme-text)] active:scale-95"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div
            className="flex cursor-pointer items-center gap-1.5"
            onClick={() => handleNavClick('home')}
            role="button"
            tabIndex={0}
          >
            <span className="font-semibold tracking-tight text-[var(--theme-text)]">
              Conju<span className="text-[var(--theme-accent)]">Letter</span>
            </span>
            <span className="rounded border border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] px-1 py-0.2 font-mono text-[9px] font-bold uppercase tracking-wider text-[var(--theme-accent)]">
              Vanguard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-inset)] text-[var(--theme-text-muted)] transition-colors hover:text-[var(--theme-text)]"
            title="Buscar verbo (Ctrl+K)"
            aria-label="Buscar verbo"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('configuracoes')}
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
              activeTab === 'configuracoes'
                ? 'border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]'
                : 'border-[var(--theme-border)] bg-[var(--theme-surface-inset)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
            }`}
            title="Configurações"
            aria-label="Configurações"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop & Mobile Sidebar Container */}
      <aside
        aria-label="Navegação lateral Vanguard"
        className={`vanguard-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--theme-border)] bg-[var(--theme-surface)] transition-all duration-250 ease-in-out ${
          // Desktop sizing
          isCollapsed ? 'md:w-16' : 'md:w-60'
        } ${
          // Mobile responsive slide-over drawer
          isMobileOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex h-14 items-center justify-between border-b border-[var(--theme-border)] px-3.5">
          {(!isCollapsed || isMobileOpen) ? (
            <div
              className="flex min-w-0 cursor-pointer items-center gap-2"
              onClick={() => handleNavClick('home')}
              role="button"
              tabIndex={0}
              title="Ir para o início"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[var(--theme-accent)] text-[var(--bg-base)] font-bold text-xs font-mono shadow-xs">
                CL
              </div>
              <div className="flex min-w-0 flex-col leading-none">
                <span className="truncate text-sm font-semibold tracking-tight text-[var(--theme-text)]">
                  Conju<span className="text-[var(--theme-accent)]">Letter</span>
                </span>
                <span className="text-[9px] font-mono font-medium tracking-widest text-[var(--theme-accent)] uppercase">
                  Vanguard
                </span>
              </div>
            </div>
          ) : (
            <div
              className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-[var(--theme-accent)] text-[var(--bg-base)] font-bold text-xs font-mono shadow-xs"
              onClick={() => handleNavClick('home')}
              role="button"
              tabIndex={0}
              title="ConjuLetter Vanguard"
            >
              CL
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-7 w-7 items-center justify-center rounded-md text-[var(--theme-text-muted)] transition-colors hover:bg-[var(--theme-surface-inset)] hover:text-[var(--theme-text)] md:flex"
            aria-label={isCollapsed ? 'Expandir barra lateral' : 'Recolher barra lateral'}
            title={isCollapsed ? 'Expandir (atalho)' : 'Recolher'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--theme-text-muted)] hover:bg-[var(--theme-surface-inset)] hover:text-[var(--theme-text)] md:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Links Area */}
        <div className="flex-1 space-y-1.5 overflow-y-auto px-2 py-3">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`vanguard-nav-item group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-all ${
                  item.isActive
                    ? 'border border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                    : 'border border-transparent text-[var(--theme-text-muted)] hover:border-[var(--theme-border)] hover:bg-[var(--theme-surface-inset)] hover:text-[var(--theme-text)]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${item.isActive ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text-muted)] group-hover:text-[var(--theme-text)]'}`} />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}

          {/* Banco de Questões with Accordion / Submenu */}
          <div className="vanguard-bank-group">
            <button
              type="button"
              onClick={() => {
                if (isCollapsed && !isMobileOpen) {
                  // If collapsed, directly navigate to simulados
                  handleNavClick('simulados');
                } else {
                  setIsBankMenuOpen(prev => !prev);
                  if (!isBankActive) handleNavClick('simulados');
                }
              }}
              className={`vanguard-nav-item group flex w-full items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium transition-all ${
                isBankActive
                  ? 'border border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                  : 'border border-transparent text-[var(--theme-text-muted)] hover:border-[var(--theme-border)] hover:bg-[var(--theme-surface-inset)] hover:text-[var(--theme-text)]'
              }`}
              title={isCollapsed ? 'Banco de Questões' : undefined}
              aria-expanded={isBankMenuOpen}
            >
              <div className="flex min-w-0 items-center gap-3">
                <Library className={`h-4 w-4 shrink-0 transition-colors ${isBankActive ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text-muted)] group-hover:text-[var(--theme-text)]'}`} />
                {(!isCollapsed || isMobileOpen) && (
                  <span className="truncate">Banco de Questões</span>
                )}
              </div>
              {(!isCollapsed || isMobileOpen) && (
                <ChevronDown className={`h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200 ${isBankMenuOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Banco Submenu */}
            {(!isCollapsed || isMobileOpen) && isBankMenuOpen && (
              <div className="mt-1 ml-4 space-y-0.5 border-l border-[var(--theme-border)] pl-2.5">
                <button
                  type="button"
                  onClick={() => handleNavClick('simulados')}
                  className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] font-mono transition-colors ${
                    activeTab === 'simulados'
                      ? 'bg-[var(--theme-surface-inset)] font-bold text-[var(--theme-accent)]'
                      : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
                  }`}
                >
                  <Layers className="h-3 w-3" />
                  <span>Filtros & Montagem</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenQuestionLists();
                    setIsMobileOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[11px] font-mono transition-colors ${
                    activeTab === 'listas'
                      ? 'bg-[var(--theme-surface-inset)] font-bold text-[var(--theme-accent)]'
                      : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
                  }`}
                >
                  <ListChecks className="h-3 w-3" />
                  <span>Listas Salvas</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer Area (Search & Settings) */}
        <div className="space-y-1 border-t border-[var(--theme-border)] p-2">
          {/* Verb Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="group flex w-full items-center gap-3 rounded-md border border-transparent px-2.5 py-2 text-xs text-[var(--theme-text-muted)] transition-colors hover:border-[var(--theme-border)] hover:bg-[var(--theme-surface-inset)] hover:text-[var(--theme-text)]"
            title={isCollapsed ? 'Buscar verbo (Ctrl+K)' : undefined}
          >
            <Search className="h-4 w-4 shrink-0 text-[var(--theme-text-muted)] group-hover:text-[var(--theme-text)]" />
            {(!isCollapsed || isMobileOpen) && (
              <div className="flex flex-1 items-center justify-between">
                <span className="truncate">Buscar verbo</span>
                <kbd className="rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--theme-text-faint)]">
                  Ctrl+K
                </kbd>
              </div>
            )}
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => handleNavClick('configuracoes')}
            className={`group flex w-full items-center gap-3 rounded-md border px-2.5 py-2 text-xs transition-colors ${
              activeTab === 'configuracoes'
                ? 'border-[var(--theme-accent)]/30 bg-[var(--theme-accent-soft)] font-semibold text-[var(--theme-accent)]'
                : 'border-transparent text-[var(--theme-text-muted)] hover:border-[var(--theme-border)] hover:bg-[var(--theme-surface-inset)] hover:text-[var(--theme-text)]'
            }`}
            title={isCollapsed ? 'Configurações' : undefined}
          >
            <SettingsIcon className={`h-4 w-4 shrink-0 ${activeTab === 'configuracoes' ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text-muted)] group-hover:text-[var(--theme-text)]'}`} />
            {(!isCollapsed || isMobileOpen) && (
              <span className="truncate">Configurações</span>
            )}
          </button>
        </div>
      </aside>

      {/* Global Verb Search Dialog Modal */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-4 pt-20 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            ref={searchDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Buscar verbo"
            className="w-full max-w-lg space-y-3 rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 shadow-xl"
            onClick={event => event.stopPropagation()}
          >
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--theme-text-muted)]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Buscar verbo militar (ex: pôr, reaver, intervir, prever)..."
                className="w-full rounded-md border border-[var(--theme-border)] bg-[var(--theme-surface-inset)] py-2.5 pl-10 pr-4 text-xs text-[var(--theme-text)] placeholder:text-[var(--theme-text-faint)] focus:border-[var(--theme-accent)] focus:outline-none"
              />
            </div>

            <div className="max-h-64 divide-y divide-[var(--theme-border)] overflow-y-auto pt-1">
              {filteredVerbs.map(verb => (
                <div
                  key={verb.id}
                  onClick={() => {
                    if (onQuickSelectVerb) onQuickSelectVerb(verb.id);
                    setActiveTab('tabelas');
                    setIsSearchOpen(false);
                  }}
                  className="flex cursor-pointer items-center justify-between rounded-sm p-2.5 transition-colors hover:bg-[var(--theme-surface-inset)]"
                >
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-[var(--theme-text)]">{verb.infinitive}</span>
                    <span className="ml-2 font-mono text-[10px] text-[var(--theme-text-muted)]">({verb.classification})</span>
                    {verb.criticalTrapDescription && (
                      <p className="mt-0.5 max-w-sm truncate text-[10px] text-[var(--theme-text-muted)]">{verb.criticalTrapDescription}</p>
                    )}
                  </div>
                  <span className="rounded border border-[var(--theme-border)] bg-[var(--theme-surface-inset)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--theme-accent)]">Treinar</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
