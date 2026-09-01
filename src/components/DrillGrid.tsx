import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2, XCircle, RotateCcw, Zap, HelpCircle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANONICAL_VERBS, PRONOUN_LABELS, TENSE_PRETTY_NAMES } from '../data/canonicalVerbs';
import type { Person } from '../types/verbs';
import { validateConjugationCell } from '../utils/grammarValidator';
import type { ValidationResult } from '../utils/grammarValidator';

interface DrillGridProps {
  initialVerbId?: string;
  initialTenseKey?: string;
  strictAccents: boolean;
  onRecordAttempt: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

export const DrillGrid: React.FC<DrillGridProps> = ({
  initialVerbId = 'por',
  initialTenseKey = 'subjuntivo_futuro_subjuntivo',
  strictAccents,
  onRecordAttempt
}) => {
  const [selectedVerbId, setSelectedVerbId] = useState<string>(initialVerbId);
  const [selectedTenseKey, setSelectedTenseKey] = useState<string>(initialTenseKey);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, ValidationResult>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showCheatSheet, setShowCheatSheet] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const currentVerb = CANONICAL_VERBS.find(v => v.id === selectedVerbId) || CANONICAL_VERBS[0];
  const persons: Person[] = ['1s', '2s', '3s', '1p', '2p', '3p'];

  // Parse mood and tense from key
  const [currentMood, currentTense] = selectedTenseKey.split('_') as [any, any];

  useEffect(() => {
    // Reset state on verb or tense change
    // oxlint-disable-next-line react/set-state-in-effect -- a changed drill identity starts a new timed attempt atomically
    setInputs({});
    setResults({});
    setIsCompleted(false);
    setShowCheatSheet(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);

    // Focus on the first input cell
    setTimeout(() => {
      inputRefs.current['1s']?.focus();
    }, 100);
  }, [selectedVerbId, selectedTenseKey]);

  // Timer tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isCompleted]);

  const handleInputChange = (person: Person, val: string) => {
    setInputs(prev => ({ ...prev, [person]: val }));
  };

  const handleCellBlur = (person: Person) => {
    const rawVal = inputs[person] || '';
    if (rawVal.trim() === '') return;

    const res = validateConjugationCell(currentVerb, selectedTenseKey, person, rawVal, strictAccents);
    setResults(prev => ({ ...prev, [person]: res }));
    onRecordAttempt(currentVerb.id, currentMood, currentTense, res.isCorrect);

    checkCompletion({ ...results, [person]: res });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, person: Person, index: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (!e.shiftKey) {
        e.preventDefault();
        handleCellBlur(person);
        const nextPerson = persons[index + 1];
        if (nextPerson && inputRefs.current[nextPerson]) {
          inputRefs.current[nextPerson]?.focus();
        } else {
          // Submit all
          submitAllCells();
        }
      }
    } else if (e.ctrlKey && e.code === 'Space') {
      // Shortcut to mark as Defective (N/A)
      e.preventDefault();
      handleInputChange(person, 'N/A');
    }
  };

  const submitAllCells = () => {
    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;

    persons.forEach(person => {
      const rawVal = inputs[person] || '';
      const res = validateConjugationCell(currentVerb, selectedTenseKey, person, rawVal, strictAccents);
      newResults[person] = res;
      if (!res.isCorrect) allCorrect = false;
      onRecordAttempt(currentVerb.id, currentMood, currentTense, res.isCorrect);
    });

    setResults(newResults);
    setIsCompleted(true);
    setIsTimerRunning(false);

    if (allCorrect) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const checkCompletion = (currentRes: Record<string, ValidationResult>) => {
    const answeredCount = Object.keys(currentRes).length;
    if (answeredCount === persons.length) {
      setIsCompleted(true);
      setIsTimerRunning(false);
      const allCorrect = Object.values(currentRes).every(r => r.isCorrect);
      if (allCorrect) {
        confetti({
          particleCount: 90,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const resetDrill = () => {
    setInputs({});
    setResults({});
    setIsCompleted(false);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setTimeout(() => {
      inputRefs.current['1s']?.focus();
    }, 50);
  };

  const markCellDefective = (person: Person) => {
    handleInputChange(person, 'N/A');
    setTimeout(() => {
      handleCellBlur(person);
    }, 50);
  };

  const availableTenses = [
    { key: 'subjuntivo_futuro_subjuntivo', label: 'Futuro do Subjuntivo (Top Militar)' },
    { key: 'subjuntivo_pret_imperfeito', label: 'Pret. Imperfeito do Subjuntivo' },
    { key: 'subjuntivo_presente', label: 'Presente do Subjuntivo' },
    { key: 'indicativo_pret_perfeito', label: 'Pretérito Perfeito do Indicativo' },
    { key: 'indicativo_pret_mais_que_perfeito', label: 'Pret. Mais-que-Perfeito (Simples)' },
    { key: 'indicativo_presente', label: 'Presente do Indicativo' },
    { key: 'imperativo_af_presente', label: 'Imperativo Afirmativo' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-md">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
            <Target className="w-4 h-4" />
            <span>MÓDULO DRILL DE CONJUGAÇÃO CONTÍNUA</span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center space-x-2">
            <span>Verbo:</span>
            <span className="font-mono text-emerald-400 uppercase tracking-wide underline decoration-emerald-500/40">
              {currentVerb.infinitive}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-normal">
              {currentVerb.classification}
            </span>
          </h2>
        </div>

        {/* Verb & Tense Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedVerbId}
            onChange={(e) => setSelectedVerbId(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-mono focus:border-emerald-500 focus:outline-none"
          >
            {CANONICAL_VERBS.map(v => (
              <option key={v.id} value={v.id}>
                {v.infinitive.toUpperCase()} ({v.classification})
              </option>
            ))}
          </select>

          <select
            value={selectedTenseKey}
            onChange={(e) => setSelectedTenseKey(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-mono focus:border-emerald-500 focus:outline-none"
          >
            {availableTenses.map(t => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Critical Trap Alert Card */}
      {currentVerb.criticalTrapDescription && (
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300 flex items-start space-x-2.5">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-200 font-mono">RAIO-X DA BANCA: </strong>
            <span>{currentVerb.criticalTrapDescription}</span>
          </div>
        </div>
      )}

      {/* Main Drill Table */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 bg-zinc-950/60 border-b border-zinc-800 text-xs font-mono text-zinc-400">
          <div className="flex items-center space-x-3">
            <span>Tempo Solicitado: <strong className="text-zinc-200">{TENSE_PRETTY_NAMES[selectedTenseKey] || selectedTenseKey}</strong></span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-zinc-400">
              Tempo: <strong className="text-emerald-400">{timerSeconds}s</strong>
            </span>
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline decoration-dotted flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showCheatSheet ? 'Ocultar Gabarito' : 'Espiar Gabarito'}</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-zinc-800/70">
          {persons.map((person, index) => {
            const label = PRONOUN_LABELS[person];
            const result = results[person];
            const val = inputs[person] || '';
            const expected = currentVerb.conjugations[selectedTenseKey]?.[person];

            let cellBorder = 'border-zinc-800 focus-within:border-indigo-500';
            if (result) {
              cellBorder = result.isCorrect 
                ? 'border-emerald-500/80 bg-emerald-950/20' 
                : 'border-rose-500/80 bg-rose-950/20';
            }

            return (
              <div key={person} className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${result?.isCorrect === false ? 'bg-rose-950/10' : ''}`}>
                {/* Pronoun & Person Label */}
                <div className="w-28 shrink-0 flex items-center space-x-2">
                  <span className="text-xs font-mono text-zinc-400 uppercase">{person}</span>
                  <span className="font-semibold text-sm text-zinc-200 font-mono">{label}</span>
                </div>

                {/* Input Cell & Diff Display */}
                <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className={`relative flex-1 rounded-lg border transition-all drill-cell ${cellBorder}`}>
                    <input
                      ref={el => { inputRefs.current[person] = el; }}
                      type="text"
                      value={val}
                      onChange={(e) => handleInputChange(person, e.target.value)}
                      onBlur={() => handleCellBlur(person)}
                      onKeyDown={(e) => handleKeyDown(e, person, index)}
                      placeholder={result?.isDefective && result?.isCorrect ? 'FORMA INEXISTENTE' : 'Digite a forma conjugada...'}
                      disabled={isCompleted && result?.isCorrect}
                      className="w-full px-3.5 py-2.5 bg-zinc-950/80 text-zinc-100 font-mono text-sm rounded-lg focus:outline-none placeholder:text-zinc-600"
                    />

                    {/* Result Icon */}
                    {result && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {result.isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400 animate-in zoom-in" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quick N/A (Defective) button */}
                  <button
                    onClick={() => markCellDefective(person)}
                    className="px-2.5 py-1 text-[11px] font-mono rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition-colors shrink-0"
                    title="Marcar como Forma Defectiva / Não Existe"
                  >
                    N/A (Defectivo)
                  </button>
                </div>

                {/* Diff & Error Explanation Feedback */}
                {result && !result.isCorrect && (
                  <div className="sm:w-64 shrink-0 text-xs font-mono text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900/60 animate-in fade-in">
                    <div className="text-[10px] text-zinc-400 uppercase">Gabarito:</div>
                    <div className="font-bold text-emerald-400">
                      {result.expectedForm === null ? 'FORMA INEXISTENTE (DEFECTIVO)' : result.expectedForm}
                    </div>
                    {result.explanation && (
                      <div className="text-[11px] text-rose-300/90 mt-0.5">{result.explanation}</div>
                    )}
                  </div>
                )}

                {/* Cheat sheet display */}
                {showCheatSheet && (
                  <div className="text-xs font-mono text-zinc-400">
                    esperado: <span className="text-emerald-400 font-bold">{expected ?? 'NÃO EXISTE'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 font-mono hidden sm:block">
            Dica: Pressione <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Tab</kbd> ou <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">Enter</kbd> para avançar.
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={resetDrill}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar / Reiniciar</span>
            </button>
            <button
              onClick={submitAllCells}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold text-xs font-mono transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Validar Bateria</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
