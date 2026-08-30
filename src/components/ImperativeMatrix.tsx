import React, { useState } from 'react';
import { Layers, CheckCircle2, XCircle, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANONICAL_VERBS, PRONOUN_LABELS } from '../data/canonicalVerbs';
import { validateConjugationCell } from '../utils/grammarValidator';
import type { ValidationResult } from '../utils/grammarValidator';

interface ImperativeMatrixProps {
  strictAccents: boolean;
  onRecordAttempt: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

export const ImperativeMatrix: React.FC<ImperativeMatrixProps> = ({
  strictAccents,
  onRecordAttempt
}) => {
  const [selectedVerbId, setSelectedVerbId] = useState<string>('manter');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ValidationResult>>({});

  const currentVerb = CANONICAL_VERBS.find(v => v.id === selectedVerbId) || CANONICAL_VERBS[0];
  const persons = ['2s', '3s', '1p', '2p', '3p'] as const;

  const handleInputChange = (mood: string, person: string, value: string) => {
    setInputs(prev => ({ ...prev, [`${mood}_${person}`]: value }));
  };

  const handleValidate = () => {
    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;

    persons.forEach(p => {
      // Imperativo Afirmativo
      const afKey = `imperativo_af_${p}`;
      const afVal = inputs[afKey] || '';
      const afRes = validateConjugationCell(currentVerb, 'imperativo_af_presente', p, afVal, strictAccents);
      newResults[afKey] = afRes;
      if (!afRes.isCorrect) allCorrect = false;
      onRecordAttempt(currentVerb.id, 'imperativo_af', 'presente', afRes.isCorrect);

      // Imperativo Negativo
      const negKey = `imperativo_neg_${p}`;
      const negVal = inputs[negKey] || '';
      // allow with or without leading "não"
      const cleanedVal = negVal.toLowerCase().startsWith('não ') || negVal.toLowerCase().startsWith('nao ')
        ? negVal
        : `não ${negVal}`;
      const negRes = validateConjugationCell(currentVerb, 'imperativo_neg_presente', p, cleanedVal, strictAccents);
      newResults[negKey] = negRes;
      if (!negRes.isCorrect) allCorrect = false;
      onRecordAttempt(currentVerb.id, 'imperativo_neg', 'presente', negRes.isCorrect);
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
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400 mb-1">
          <Layers className="w-4 h-4" />
          <span>ENGENHARIA MECÂNICA DO MODO IMPERATIVO</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">
              Matriz de Formação: Afirmativo & Negativo
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Compreenda e treine visualmente a derivação a partir do Indicativo e do Subjuntivo.
            </p>
          </div>

          <select
            value={selectedVerbId}
            onChange={(e) => { setSelectedVerbId(e.target.value); setInputs({}); setResults({}); }}
            className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-mono focus:border-cyan-500 focus:outline-none"
          >
            {CANONICAL_VERBS.map(v => (
              <option key={v.id} value={v.id}>
                {v.infinitive.toUpperCase()} ({v.classification})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Rule Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
          <div className="font-bold text-cyan-400 font-mono flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Regra 1: Imperativo Afirmativo</span>
          </div>
          <ul className="space-y-1 text-zinc-300 list-disc list-inside">
            <li><strong className="text-zinc-100">Tu e Vós:</strong> Vêm do <em>Presente do Indicativo</em> <u>SEM a letra "S"</u>.</li>
            <li><strong className="text-zinc-100">Você, Nós, Vocês:</strong> Vêm <em>diretamente do Presente do Subjuntivo</em> (sem alterações).</li>
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
          <div className="font-bold text-pink-400 font-mono flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Regra 2: Imperativo Negativo</span>
          </div>
          <ul className="space-y-1 text-zinc-300 list-disc list-inside">
            <li><strong className="text-zinc-100">Todas as Pessoas:</strong> São cópias integrais do <em>Presente do Subjuntivo</em> antecedidas do advérbio "NÃO".</li>
            <li>Não perde o "S" no Tu e Vós (*não fales tu*, *não faleis vós*).</li>
          </ul>
        </div>
      </div>

      {/* Interactive Derivation Grid */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold">
            Verbo em Treino: <strong className="text-cyan-400 uppercase">{currentVerb.infinitive}</strong>
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            Digite as formas dos Imperativos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-mono text-zinc-400">
                <th className="p-3.5 w-24">Pessoa</th>
                <th className="p-3.5 text-zinc-400">Pres. Indicativo (Base)</th>
                <th className="p-3.5 text-zinc-400">Pres. Subjuntivo (Base)</th>
                <th className="p-3.5 text-cyan-400">Imperativo Afirmativo</th>
                <th className="p-3.5 text-pink-400">Imperativo Negativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70 text-xs font-mono">
              {persons.map(p => {
                const label = PRONOUN_LABELS[p];
                const indBase = currentVerb.conjugations['indicativo_presente']?.[p] ?? '—';
                const subjBase = currentVerb.conjugations['subjuntivo_presente']?.[p] ?? '—';

                const afKey = `imperativo_af_${p}`;
                const negKey = `imperativo_neg_${p}`;
                const afRes = results[afKey];
                const negRes = results[negKey];

                return (
                  <tr key={p} className="hover:bg-zinc-950/40 transition-colors">
                    <td className="p-3.5 font-bold text-zinc-300">
                      {label} ({p})
                    </td>

                    {/* Pres Indicativo Source */}
                    <td className="p-3.5 text-zinc-400 bg-zinc-950/20">
                      {indBase}
                    </td>

                    {/* Pres Subjuntivo Source */}
                    <td className="p-3.5 text-zinc-400 bg-zinc-950/20">
                      {subjBase}
                    </td>

                    {/* Imperativo Afirmativo Input */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={inputs[afKey] || ''}
                            onChange={(e) => handleInputChange('imperativo_af', p, e.target.value)}
                            placeholder={afRes?.isDefective && afRes?.isCorrect ? 'DEFECTIVO' : 'Imperativo Afirmativo'}
                            className={`w-full px-3 py-1.5 bg-zinc-950 rounded-md border text-xs text-zinc-100 focus:outline-none ${
                              afRes
                                ? afRes.isCorrect
                                  ? 'border-emerald-500 bg-emerald-950/20'
                                  : 'border-rose-500 bg-rose-950/20'
                                : 'border-zinc-800 focus:border-cyan-500'
                            }`}
                          />
                          {afRes && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              {afRes.isCorrect ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                            </div>
                          )}
                        </div>
                        {afRes && !afRes.isCorrect && (
                          <div className="text-[10px] text-emerald-400">
                            Gabarito: {afRes.expectedForm ?? 'DEFECTIVO'}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Imperativo Negativo Input */}
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={inputs[negKey] || ''}
                            onChange={(e) => handleInputChange('imperativo_neg', p, e.target.value)}
                            placeholder={negRes?.isDefective && negRes?.isCorrect ? 'DEFECTIVO' : 'ex: não fales'}
                            className={`w-full px-3 py-1.5 bg-zinc-950 rounded-md border text-xs text-zinc-100 focus:outline-none ${
                              negRes
                                ? negRes.isCorrect
                                  ? 'border-emerald-500 bg-emerald-950/20'
                                  : 'border-rose-500 bg-rose-950/20'
                                : 'border-zinc-800 focus:border-pink-500'
                            }`}
                          />
                          {negRes && (
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                              {negRes.isCorrect ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              )}
                            </div>
                          )}
                        </div>
                        {negRes && !negRes.isCorrect && (
                          <div className="text-[10px] text-emerald-400">
                            Gabarito: {negRes.expectedForm ?? 'DEFECTIVO'}
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

        {/* Footer */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-end space-x-3">
          <button
            onClick={() => { setInputs({}); setResults({}); }}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={handleValidate}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs font-mono transition-all shadow-lg shadow-cyan-600/20 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Validar Matriz de Imperativo</span>
          </button>
        </div>
      </div>

    </div>
  );
};
