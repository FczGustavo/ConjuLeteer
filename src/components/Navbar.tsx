import React from 'react';
import { Shield, Flame, Target, GitCompare, Layers, Library, Settings as SettingsIcon, Brain } from 'lucide-react';
import type { MilitaryRank } from '../types/verbs';

interface NavbarProps {
  currentRank: MilitaryRank;
  overallMastery: number;
  streakDays: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRankModal: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRank,
  overallMastery,
  streakDays,
  activeTab,
  setActiveTab,
  onOpenRankModal,
  onOpenSettings
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Quartel General', icon: Shield },
    { id: 'drill', label: 'Drill de Tabelas', icon: Target },
    { id: 'traps', label: 'Raio-X de Armadilhas', icon: GitCompare },
    { id: 'imperative', label: 'Matriz de Imperativo', icon: Layers },
    { id: 'simulator', label: 'Simulado IA', icon: Brain },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tactical Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xl shadow-inner shadow-emerald-500/20">
              CL
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-zinc-100">ConjuLetter</span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  MILITAR
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">EsPCEx • EEAr • AFA • EFOMM • CN</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800/90 text-emerald-400 border border-zinc-700 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tactical Status & User Badges */}
          <div className="flex items-center space-x-3">
            {/* Streak Counter */}
            <div 
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/50 text-amber-400 text-xs font-mono"
              title="Dias consecutivos de prontidão"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-semibold">{streakDays}d</span>
            </div>

            {/* Military Rank Badge */}
            <button
              onClick={onOpenRankModal}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md border text-xs font-mono transition-all hover:scale-105 ${currentRank.badgeColor}`}
              title="Clique para ver sua progressão militar"
            >
              <Library className="w-3.5 h-3.5" />
              <span className="font-bold">{currentRank.abbreviation}</span>
              <span className="hidden sm:inline font-sans text-zinc-300">({overallMastery}%)</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 border border-zinc-800 transition-colors"
              title="Configurações e Chave OpenRouter"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-zinc-900 space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-emerald-400 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
