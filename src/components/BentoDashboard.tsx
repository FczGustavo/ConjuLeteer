import React from 'react';
import { Zap, AlertTriangle, CheckCircle, Flame, ArrowRight, ShieldCheck, Target } from 'lucide-react';
import type { MilitaryRank, DailyActivityLog } from '../types/verbs';
import { CANONICAL_VERBS } from '../data/canonicalVerbs';
import { getWeakestVerbs } from '../utils/srsEngine';

interface BentoDashboardProps {
  currentRank: MilitaryRank;
  overallMastery: number;
  activityLogs: DailyActivityLog[];
  userStats: Record<string, any>;
  onStartDrill: (verbId?: string, moodTense?: string) => void;
  onStartSimulator: (archetype?: string) => void;
  onStartTraps: () => void;
}

export const BentoDashboard: React.FC<BentoDashboardProps> = ({
  currentRank,
  overallMastery,
  activityLogs,
  userStats,
  onStartDrill,
  onStartSimulator,
  onStartTraps
}) => {
  const weakVerbs = getWeakestVerbs(userStats, 4);

  // Quick stats calculation
  const totalAttempts = Object.values(userStats).reduce((acc: number, s: any) => acc + (s.correctCount + s.errorCount), 0);
  const totalCorrect = Object.values(userStats).reduce((acc: number, s: any) => acc + s.correctCount, 0);
  const accuracyRate = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Top Banner: Mission Briefing */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ORDEM DE OPERAÇÕES DO DIA • {new Date().toLocaleDateString('pt-BR')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Treinador Tático de Verbos Militares
            </h1>
            <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
              Foco prioritário da semana: <strong className="text-zinc-200">Derivados de PÔR e VIR</strong> no Subjuntivo e armadilhas de <strong className="text-zinc-200">PROVER vs PREVER</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onStartDrill('por', 'subjuntivo_futuro_subjuntivo')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Missão Diária de Drill</span>
            </button>
            <button
              onClick={() => onStartSimulator('lacuna_derivado')}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-sm border border-zinc-700 transition-all active:scale-95"
            >
              <Target className="w-4 h-4" />
              <span>Simulado EsPCEx</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Heatmap de Prontidão Operacional (28 dias) */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/90 border border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                Matriz de Prontidão Operacional (28 Dias)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">
              {totalAttempts} formas conjugadas
            </span>
          </div>

          {/* Activity Grid */}
          <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
            {activityLogs.slice(-28).map((log, idx) => {
              const intensity = log.cellsFilled === 0 
                ? 'bg-zinc-800/60 border-zinc-800' 
                : log.cellsFilled < 10 
                  ? 'bg-emerald-950/80 border-emerald-900 text-emerald-400' 
                  : log.cellsFilled < 20 
                    ? 'bg-emerald-800/80 border-emerald-700 text-emerald-200' 
                    : 'bg-emerald-500 border-emerald-400 text-zinc-950';

              return (
                <div 
                  key={idx}
                  className={`group relative h-10 rounded-md border flex flex-col items-center justify-center font-mono text-[10px] transition-all hover:scale-105 cursor-pointer ${intensity}`}
                  title={`${log.date}: ${log.cellsFilled} preenchimentos (${log.accuracy}% acerto)`}
                >
                  <span className="font-semibold">{log.cellsFilled > 0 ? log.cellsFilled : '-'}</span>
                  <span className="text-[8px] opacity-70">{log.date.slice(-2)}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 mt-4 pt-3 border-t border-zinc-800/60">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded bg-zinc-800 inline-block" />
              <span>Sem treino</span>
              <span className="w-2.5 h-2.5 rounded bg-emerald-950 border border-emerald-800 inline-block ml-2" />
              <span>1-9</span>
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block ml-2" />
              <span>20+</span>
            </div>
            <span className="font-mono text-emerald-400">Precisão Geral: {accuracyRate}%</span>
          </div>
        </div>

        {/* Card 2: Patente Militar & Maestria */}
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Patente Atual</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`px-3 py-1.5 rounded-lg border text-sm font-mono font-bold ${currentRank.badgeColor}`}>
                {currentRank.abbreviation}
              </div>
              <div>
                <h3 className="font-bold text-zinc-100">{currentRank.title}</h3>
                <p className="text-xs text-zinc-400 font-mono">Nível {currentRank.level} de 10</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 mb-4">{currentRank.description}</p>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1.5">
              <span>Maestria Global</span>
              <span className="text-emerald-400 font-bold">{overallMastery}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(5, overallMastery)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Radar de Fraquezas (Os 4 Verbos Mais Errados) */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/90 border border-zinc-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                Radar de Pontos Fracos (Atenção Máxima)
              </h2>
            </div>
            <span className="text-xs text-zinc-400">Verbos com maior índice de erro</span>
          </div>

          {weakVerbs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {weakVerbs.map((weak, idx) => {
                const verb = CANONICAL_VERBS.find(v => v.id === weak.verbId) || CANONICAL_VERBS[0];
                return (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-zinc-100 font-mono text-sm uppercase">{verb.infinitive}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-900">
                          {weak.errorRate}% Erros
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 truncate max-w-[200px]">
                        {verb.criticalTrapDescription || 'Atenção aos derivados e tempos compostos.'}
                      </p>
                    </div>
                    <button
                      onClick={() => onStartDrill(verb.id, weak.tenseKey)}
                      className="p-1.5 rounded-md bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 transition-all"
                      title="Treinar este verbo agora"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center rounded-lg bg-zinc-950/40 border border-dashed border-zinc-800">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium text-zinc-300">Nenhum ponto fraco crítico registrado ainda!</p>
              <p className="text-xs text-zinc-500 mt-1">Inicie baterias de Drill para que o radar mapeie seu histórico.</p>
            </div>
          )}
        </div>

        {/* Card 4: Treinos Rápidos em 1 Clique */}
        <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-mono mb-3">
              Baterias Diretas (1 Clique)
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => onStartTraps()}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 text-left text-xs text-zinc-300 hover:text-zinc-100 transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="font-mono font-medium">Ver vs Vir (Subjuntivo)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                onClick={() => onStartDrill('prever', 'subjuntivo_futuro_subjuntivo')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 text-left text-xs text-zinc-300 hover:text-zinc-100 transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="font-mono font-medium">Prever vs Prover (Pegadinha)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </button>

              <button
                onClick={() => onStartDrill('reaver', 'indicativo_pret_perfeito')}
                className="w-full flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 text-left text-xs text-zinc-300 hover:text-zinc-100 transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span className="font-mono font-medium">Reaver (Defectivo em V)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono text-center">
            Padrão rigoroso das bancas EsPCEx / EEAr / AFA
          </div>
        </div>

      </div>
    </div>
  );
};
