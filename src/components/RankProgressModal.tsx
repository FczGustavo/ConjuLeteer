import React from 'react';
import { X, Award, CheckCircle, Lock } from 'lucide-react';
import type { MilitaryRank } from '../types/verbs';
import { MILITARY_RANKS } from '../data/canonicalVerbs';

interface RankProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRank: MilitaryRank;
  overallMastery: number;
}

export const RankProgressModal: React.FC<RankProgressModalProps> = ({
  isOpen,
  onClose,
  currentRank,
  overallMastery
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Hierarquia de Patentes Militares</h2>
              <p className="text-xs text-zinc-400 font-mono">
                Sua Maestria Atual: <strong className="text-emerald-400">{overallMastery}%</strong> • Patente: <strong className="text-zinc-200">{currentRank.title}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rank List Progression */}
        <div className="space-y-3">
          {MILITARY_RANKS.map((rank) => {
            const isUnlocked = overallMastery >= rank.minMasteryScore;
            const isCurrent = currentRank.level === rank.level;

            return (
              <div
                key={rank.level}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                    : isUnlocked
                      ? 'bg-zinc-950/60 border-zinc-800'
                      : 'bg-zinc-950/30 border-zinc-850 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center font-mono font-bold shrink-0 ${rank.badgeColor}`}>
                    <span className="text-xs">{rank.abbreviation}</span>
                    <span className="text-[9px] opacity-80">N{rank.level}</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-zinc-100">{rank.title}</h4>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500 text-zinc-950 font-bold">
                          ATUAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{rank.description}</p>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0">
                  <div className="text-xs font-bold text-zinc-200">
                    {rank.minMasteryScore}% XP
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    {isUnlocked ? (
                      <span className="text-emerald-400 flex items-center justify-end space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Desbloqueado</span>
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center justify-end space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Bloqueado</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800 text-center">
          <p className="text-xs text-zinc-500 font-mono">
            Aumente sua maestria acertando baterias de Drill Tables e simulados militares.
          </p>
        </div>

      </div>
    </div>
  );
};
