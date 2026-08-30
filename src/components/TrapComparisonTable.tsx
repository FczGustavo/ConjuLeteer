import React, { useState } from 'react';
import { GitCompare, AlertOctagon, CheckCircle, XCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANONICAL_VERBS, PRONOUN_LABELS } from '../data/canonicalVerbs';
import { validateConjugationCell } from '../utils/grammarValidator';
import type { ValidationResult } from '../utils/grammarValidator';

interface TrapComparisonTableProps {
  strictAccents: boolean;
  onRecordAttempt: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

interface TrapDuel {
  id: string;
  title: string;
  subtitle: string;
  tenseKey: string;
  tensePretty: string;
  verb1Id: string;
  verb2Id: string;
  goldenRule: string;
}

export const TrapComparisonTable: React.FC<TrapComparisonTableProps> = ({
  strictAccents,
  onRecordAttempt
}) => {
  const duels: TrapDuel[] = [
    {
      id: 'ver-vir',
      title: 'VER vs VIR',
      subtitle: 'O maior índice de eliminação em concursos militares',
      tenseKey: 'subjuntivo_futuro_subjuntivo',
      tensePretty: 'Futuro do Subjuntivo',
      verb1Id: 'ver',
      verb2Id: 'vir',
      goldenRule: 'VER no Futuro do Subjuntivo é "VIR" (quando eu vir, ele vir). VIR no Futuro do Subjuntivo é "VIER" (quando eu vier, ele vier).'
    },
    {
      id: 'prever-prover',
      title: 'PREVER vs PROVER',
      subtitle: 'Prever segue "Ver", mas Prover é regular no Pretérito!',
      tenseKey: 'indicativo_pret_perfeito',
      tensePretty: 'Pretérito Perfeito do Indicativo',
      verb1Id: 'prever',
      verb2Id: 'prover',
      goldenRule: 'PREVER faz "previ, previu, previram". PROVER faz "provi, proveu, proveram" (não existe "proviu"!).'
    },
    {
      id: 'reaver-precaver',
      title: 'REAVER vs PRECAVER',
      subtitle: 'Defectivos em -ER com regras opostas',
      tenseKey: 'indicativo_presente',
      tensePretty: 'Presente do Indicativo',
      verb1Id: 'reaver',
      verb2Id: 'precaver',
      goldenRule: 'REAVER só tem as formas com "V" de haver (reavemos, reaveis). PRECAVER só possui "precavemos" e "precaveis". Ambas não têm 1ª pessoa do singular.'
    },
    {
      id: 'por-compor',
      title: 'PÔR vs COMPOR / REPOR',
      subtitle: 'Manutenção rigorosa da raiz primitiva "Pus-"',
      tenseKey: 'subjuntivo_pret_imperfeito',
      tensePretty: 'Pretérito Imperfeito do Subjuntivo',
      verb1Id: 'por',
      verb2Id: 'compor',
      goldenRule: 'PÔR faz "pusesse, puséssemos". COMPOR faz "compusesse, compuséssemos". REPOR faz "repusesse, repuséssemos". Nunca use "pôsse" ou "compôsse".'
    }
  ];

  const [activeDuelId, setActiveDuelId] = useState<string>(duels[0].id);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ValidationResult>>({});

  const currentDuel = duels.find(d => d.id === activeDuelId) || duels[0];
  const verb1 = CANONICAL_VERBS.find(v => v.id === currentDuel.verb1Id) || CANONICAL_VERBS[0];
  const verb2 = CANONICAL_VERBS.find(v => v.id === currentDuel.verb2Id) || CANONICAL_VERBS[1];

  const persons = ['1s', '2s', '3s', '1p', '2p', '3p'] as const;

  const handleDuelChange = (duelId: string) => {
    setActiveDuelId(duelId);
    setInputs({});
    setResults({});
  };

  const handleInputChange = (verbId: string, person: string, value: string) => {
    setInputs(prev => ({ ...prev, [`${verbId}_${person}`]: value }));
  };

  const handleValidateDuel = () => {
    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;

    const [mood, tense] = currentDuel.tenseKey.split('_') as [any, any];

    persons.forEach(p => {
      // Validate Verb 1
      const key1 = `${verb1.id}_${p}`;
      const val1 = inputs[key1] || '';
      const res1 = validateConjugationCell(verb1, currentDuel.tenseKey, p, val1, strictAccents);
      newResults[key1] = res1;
      if (!res1.isCorrect) allCorrect = false;
      onRecordAttempt(verb1.id, mood, tense, res1.isCorrect);

      // Validate Verb 2
      const key2 = `${verb2.id}_${p}`;
      const val2 = inputs[key2] || '';
      const res2 = validateConjugationCell(verb2, currentDuel.tenseKey, p, val2, strictAccents);
      newResults[key2] = res2;
      if (!res2.isCorrect) allCorrect = false;
      onRecordAttempt(verb2.id, mood, tense, res2.isCorrect);
    });

    setResults(newResults);

    if (allCorrect) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-mono text-indigo-400 mb-1">
          <GitCompare className="w-4 h-4" />
          <span>RAIO-X DE HOMÔNIMOS E ARMADILHAS PARALELAS</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100">
          Duelo de Verbos Críticos (Comparações Lado a Lado)
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Treine sua percepção muscular para nunca mais misturar formas semelhantes em provas militares.
        </p>

        {/* Duel Selection Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {duels.map(d => {
            const isActive = activeDuelId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleDuelChange(d.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <div className="font-bold text-xs font-mono">{d.title}</div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">{d.tensePretty}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Golden Rule Callout */}
      <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/50 text-xs text-indigo-200 flex items-start space-x-3">
        <AlertOctagon className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-indigo-300 font-mono uppercase tracking-wider block mb-0.5">
            Regra Canônica da Banca:
          </strong>
          <span>{currentDuel.goldenRule}</span>
        </div>
      </div>

      {/* Side by Side Comparative Table */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="text-xs font-mono text-zinc-400">
            Tempo Avaliado: <strong className="text-zinc-200">{currentDuel.tensePretty}</strong>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Digite em ambas as colunas e clique em "Validar Duelo"
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-mono text-zinc-400">
                <th className="p-3.5 w-24">Pronome</th>
                <th className="p-3.5 text-emerald-400 uppercase tracking-wider">
                  Verbo 1: {verb1.infinitive}
                </th>
                <th className="p-3.5 text-indigo-400 uppercase tracking-wider">
                  Verbo 2: {verb2.infinitive}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-sm">
              {persons.map(p => {
                const label = PRONOUN_LABELS[p];
                const key1 = `${verb1.id}_${p}`;
                const key2 = `${verb2.id}_${p}`;
                const res1 = results[key1];
                const res2 = results[key2];

                return (
                  <tr key={p} className="hover:bg-zinc-950/30 transition-colors">
                    <td className="p-3.5 font-mono text-xs text-zinc-400 font-medium">
                      {label} ({p})
                    </td>

                    {/* Column 1: Verb 1 */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={inputs[key1] || ''}
                            onChange={(e) => handleInputChange(verb1.id, p, e.target.value)}
                            placeholder={res1?.isDefective && res1?.isCorrect ? 'FORMA INEXISTENTE' : `Conjugue "${verb1.infinitive}"`}
                            className={`w-full px-3 py-2 bg-zinc-950 rounded-lg border font-mono text-xs text-zinc-100 focus:outline-none ${
                              res1
                                ? res1.isCorrect
                                  ? 'border-emerald-500 bg-emerald-950/20'
                                  : 'border-rose-500 bg-rose-950/20'
                                : 'border-zinc-800 focus:border-emerald-500'
                            }`}
                          />
                          {res1 && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              {res1.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                              )}
                            </div>
                          )}
                        </div>
                        {res1 && !res1.isCorrect && (
                          <div className="text-[11px] font-mono text-emerald-400">
                            Gabarito: {res1.expectedForm ?? 'FORMA INEXISTENTE'}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Column 2: Verb 2 */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={inputs[key2] || ''}
                            onChange={(e) => handleInputChange(verb2.id, p, e.target.value)}
                            placeholder={res2?.isDefective && res2?.isCorrect ? 'FORMA INEXISTENTE' : `Conjugue "${verb2.infinitive}"`}
                            className={`w-full px-3 py-2 bg-zinc-950 rounded-lg border font-mono text-xs text-zinc-100 focus:outline-none ${
                              res2
                                ? res2.isCorrect
                                  ? 'border-emerald-500 bg-emerald-950/20'
                                  : 'border-rose-500 bg-rose-950/20'
                                : 'border-zinc-800 focus:border-indigo-500'
                            }`}
                          />
                          {res2 && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                              {res2.isCorrect ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400" />
                              )}
                            </div>
                          )}
                        </div>
                        {res2 && !res2.isCorrect && (
                          <div className="text-[11px] font-mono text-emerald-400">
                            Gabarito: {res2.expectedForm ?? 'FORMA INEXISTENTE'}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer submit */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end space-x-3">
          <button
            onClick={() => { setInputs({}); setResults({}); }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleValidateDuel}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs font-mono transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Validar Duelo</span>
          </button>
        </div>
      </div>

    </div>
  );
};
