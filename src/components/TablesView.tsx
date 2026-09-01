import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Shuffle, Check, X, Layers, ChevronDown, ChevronUp, ListChecks } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANONICAL_VERBS, PRONOUN_LABELS, TENSE_PRETTY_NAMES } from '../data/canonicalVerbs';
import type { Person, Mood, Tense } from '../types/verbs';
import { validateConjugationCell } from '../utils/grammarValidator';
import type { ValidationResult } from '../utils/grammarValidator';

interface TablesViewProps {
  initialVerbId?: string;
  strictAccents: boolean;
  tableColumns?: 1 | 2 | 3;
  onRecordAttempt: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

type TableSubMode = 'unica' | 'confronto' | 'imperativo' | 'sessao_aleatoria';
type SessionVerbResult = { verbId: string; correct: boolean; attempts: number };

function parseMoodTense(key: string): { mood: Mood; tense: Tense } {
  if (key.startsWith('indicativo_')) {
    return { mood: 'indicativo', tense: key.replace('indicativo_', '') as Tense };
  }
  if (key.startsWith('subjuntivo_')) {
    return { mood: 'subjuntivo', tense: key.replace('subjuntivo_', '') as Tense };
  }
  if (key.startsWith('imperativo_af_')) {
    return { mood: 'imperativo_af', tense: key.replace('imperativo_af_', '') as Tense };
  }
  if (key.startsWith('imperativo_neg_')) {
    return { mood: 'imperativo_neg', tense: key.replace('imperativo_neg_', '') as Tense };
  }
  return { mood: 'formas_nominais', tense: 'presente' as Tense };
}

const ALL_AVAILABLE_TENSES = [
  { key: 'subjuntivo_futuro_subjuntivo', label: 'Futuro do Subjuntivo', group: 'Subjuntivo' },
  { key: 'subjuntivo_pret_imperfeito', label: 'Pretérito Imperfeito do Subjuntivo', group: 'Subjuntivo' },
  { key: 'subjuntivo_presente', label: 'Presente do Subjuntivo', group: 'Subjuntivo' },
  { key: 'indicativo_pret_perfeito', label: 'Pretérito Perfeito do Indicativo', group: 'Indicativo' },
  { key: 'indicativo_pret_mais_que_perfeito', label: 'Pret. Mais-que-Perfeito (Simples)', group: 'Indicativo' },
  { key: 'indicativo_presente', label: 'Presente do Indicativo', group: 'Indicativo' },
  { key: 'indicativo_pret_imperfeito', label: 'Pretérito Imperfeito do Indicativo', group: 'Indicativo' },
  { key: 'indicativo_futuro_presente', label: 'Futuro do Presente', group: 'Indicativo' },
  { key: 'indicativo_futuro_preterito', label: 'Futuro do Pretérito', group: 'Indicativo' },
  { key: 'imperativo_af_presente', label: 'Imperativo Afirmativo', group: 'Imperativo' },
  { key: 'imperativo_neg_presente', label: 'Imperativo Negativo', group: 'Imperativo' }
];

export const TablesView: React.FC<TablesViewProps> = ({
  initialVerbId = 'por',
  strictAccents,
  tableColumns = 2,
  onRecordAttempt
}) => {
  const [subMode, setSubMode] = useState<TableSubMode>('unica');
  const [isTrayOpen, setIsTrayOpen] = useState<boolean>(false);

  // Modo Única
  const [selectedVerbId, setSelectedVerbId] = useState<string>(initialVerbId);
  const [selectedTenseKey, setSelectedTenseKey] = useState<string>('subjuntivo_futuro_subjuntivo');
  const [singleInputs, setSingleInputs] = useState<Record<string, string>>({});
  const [singleResults, setSingleResults] = useState<Record<string, ValidationResult>>({});

  // Modo Sessão Aleatória Multi-Tempos
  const [multiTenses, setMultiTenses] = useState<string[]>([
    'subjuntivo_futuro_subjuntivo',
    'subjuntivo_presente'
  ]);
  const [multiInputs, setMultiInputs] = useState<Record<string, string>>({});
  const [multiResults, setMultiResults] = useState<Record<string, ValidationResult>>({});
  const [sessionVerbResults, setSessionVerbResults] = useState<Record<string, SessionVerbResult>>({});
  const [isSessionProgressOpen, setIsSessionProgressOpen] = useState<boolean>(false);
  const [sessionDrawnCount, setSessionDrawnCount] = useState<number>(0);
  const remainingVerbIdsRef = useRef<string[]>([]);
  const sessionSeenVerbIdsRef = useRef<Set<string>>(new Set());

  // Modo Confronto
  const [confrontationId, setConfrontationId] = useState<string>('ver-vir');
  const [confrontationInputs, setConfrontationInputs] = useState<Record<string, string>>({});
  const [confrontationResults, setConfrontationResults] = useState<Record<string, ValidationResult>>({});

  // Modo Imperativo
  const [imperativeVerbId, setImperativeVerbId] = useState<string>('manter');
  const [imperativeInputs, setImperativeInputs] = useState<Record<string, string>>({});
  const [imperativeResults, setImperativeResults] = useState<Record<string, ValidationResult>>({});

  const singleInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const persons: Person[] = ['1s', '2s', '3s', '1p', '2p', '3p'];

  const currentVerb = CANONICAL_VERBS.find(v => v.id === selectedVerbId) || CANONICAL_VERBS[0];

  useEffect(() => {
    if (initialVerbId) {
      // oxlint-disable-next-line react/set-state-in-effect -- external quick-search selection synchronizes this controlled view
      setSelectedVerbId(initialVerbId);
    }
  }, [initialVerbId]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- changing the exercise identity must discard stale answers atomically
    setSingleInputs({});
    setSingleResults({});
    setMultiInputs({});
    setMultiResults({});
  }, [selectedVerbId, selectedTenseKey, subMode]);

  // Confrontation options
  const confrontationDuels = [
    {
      id: 'ver-vir',
      title: 'VER vs VIR',
      tenseKey: 'subjuntivo_futuro_subjuntivo',
      tensePretty: 'Futuro do Subjuntivo',
      verb1Id: 'ver',
      verb2Id: 'vir',
      note: 'VER no futuro do subjuntivo faz "vir" (quando eu vir); VIR faz "vier" (quando eu vier).'
    },
    {
      id: 'prever-prover',
      title: 'PREVER vs PROVER',
      tenseKey: 'indicativo_pret_perfeito',
      tensePretty: 'Pretérito Perfeito',
      verb1Id: 'prever',
      verb2Id: 'prover',
      note: 'Prever segue ver (previ, previu). Prover é regular no pretérito (provi, proveu).'
    },
    {
      id: 'reaver-precaver',
      title: 'REAVER vs PRECAVER',
      tenseKey: 'indicativo_presente',
      tensePretty: 'Presente do Indicativo',
      verb1Id: 'reaver',
      verb2Id: 'precaver',
      note: 'Reaver só tem formas com "v" de haver (reavemos, reaveis). Precaver só tem precavemos e precaveis.'
    },
    {
      id: 'por-compor',
      title: 'PÔR vs COMPOR',
      tenseKey: 'subjuntivo_pret_imperfeito',
      tensePretty: 'Pret. Imperfeito do Subjuntivo',
      verb1Id: 'por',
      verb2Id: 'compor',
      note: 'Preservação da raiz pus- (pusesse -> compusesse).'
    }
  ];

  // ---------------- SINGLE TABLE VALIDATION ----------------
  const validateSingleTable = () => {
    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;
    const { mood, tense } = parseMoodTense(selectedTenseKey);

    persons.forEach(person => {
      const rawVal = singleInputs[person] || '';
      const res = validateConjugationCell(currentVerb, selectedTenseKey, person, rawVal, strictAccents);
      newResults[person] = res;
      if (!res.isCorrect) allCorrect = false;
      onRecordAttempt(currentVerb.id, mood, tense, res.isCorrect);
    });

    setSingleResults(newResults);
    if (allCorrect) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  // ---------------- MULTI-TENSE SESSION VALIDATION ----------------
  const toggleMultiTense = (tenseKey: string) => {
    setMultiTenses(prev => {
      if (prev.includes(tenseKey)) {
        if (prev.length === 1) return prev; // keep at least 1
        return prev.filter(k => k !== tenseKey);
      } else {
        return [...prev, tenseKey];
      }
    });
  };

  const selectAllTenses = () => {
    setMultiTenses(ALL_AVAILABLE_TENSES.map(t => t.key));
  };

  const selectSubjuntivoOnly = () => {
    setMultiTenses([
      'subjuntivo_futuro_subjuntivo',
      'subjuntivo_presente',
      'subjuntivo_pret_imperfeito'
    ]);
  };

  const selectIndicativoOnly = () => {
    setMultiTenses([
      'indicativo_presente',
      'indicativo_pret_perfeito',
      'indicativo_pret_imperfeito',
      'indicativo_pret_mais_que_perfeito',
      'indicativo_futuro_presente',
      'indicativo_futuro_preterito'
    ]);
  };

  const validateMultiSession = () => {
    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;

    multiTenses.forEach(tenseKey => {
      const { mood, tense } = parseMoodTense(tenseKey);
      const isImperative = tenseKey.startsWith('imperativo_');
      const targetPersons: Person[] = isImperative ? ['2s', '3s', '1p', '2p', '3p'] : persons;

      targetPersons.forEach(person => {
        const cellId = `${tenseKey}_${person}`;
        let rawVal = multiInputs[cellId] || '';

        if (tenseKey === 'imperativo_neg_presente' && rawVal.trim()) {
          if (!rawVal.toLowerCase().startsWith('não ') && !rawVal.toLowerCase().startsWith('nao ')) {
            rawVal = `não ${rawVal}`;
          }
        }

        const res = validateConjugationCell(currentVerb, tenseKey, person, rawVal, strictAccents);
        newResults[cellId] = res;
        if (!res.isCorrect) allCorrect = false;
        onRecordAttempt(currentVerb.id, mood, tense, res.isCorrect);
      });
    });

    setMultiResults(newResults);
    setSessionVerbResults(prev => ({
      ...prev,
      [currentVerb.id]: {
        verbId: currentVerb.id,
        correct: allCorrect,
        attempts: (prev[currentVerb.id]?.attempts ?? 0) + 1
      }
    }));
    if (allCorrect) {
      confetti({ particleCount: 65, spread: 75, origin: { y: 0.6 } });
    }
  };

  const nextRandomVerb = () => {
    if (sessionSeenVerbIdsRef.current.size === 0) {
      sessionSeenVerbIdsRef.current.add(selectedVerbId);
      remainingVerbIdsRef.current = CANONICAL_VERBS
        .map(verb => verb.id)
        .filter(id => !sessionSeenVerbIdsRef.current.has(id))
        .sort(() => Math.random() - 0.5);
    }
    const nextVerbId = remainingVerbIdsRef.current.pop();
    if (!nextVerbId) return;
    sessionSeenVerbIdsRef.current.add(nextVerbId);
    setSessionDrawnCount(sessionSeenVerbIdsRef.current.size);
    setSelectedVerbId(nextVerbId);
    setMultiInputs({});
    setMultiResults({});
  };

  const restartMultiSession = () => {
    const firstVerb = CANONICAL_VERBS[Math.floor(Math.random() * CANONICAL_VERBS.length)];
    remainingVerbIdsRef.current = CANONICAL_VERBS
      .map(verb => verb.id)
      .filter(id => id !== firstVerb?.id)
      .sort(() => Math.random() - 0.5);
    sessionSeenVerbIdsRef.current = new Set(firstVerb ? [firstVerb.id] : []);
    setSessionDrawnCount(firstVerb ? 1 : 0);
    setSessionVerbResults({});
    setMultiInputs({});
    setMultiResults({});
    if (firstVerb) setSelectedVerbId(firstVerb.id);
  };

  const completedSessionVerbs = Object.values(sessionVerbResults);
  const sessionCycleFinished = sessionDrawnCount >= CANONICAL_VERBS.length;

  // ---------------- CONFRONTATION & IMPERATIVE ----------------
  const validateConfrontation = () => {
    const duel = confrontationDuels.find(d => d.id === confrontationId) || confrontationDuels[0];
    const verb1 = CANONICAL_VERBS.find(v => v.id === duel.verb1Id) || CANONICAL_VERBS[0];
    const verb2 = CANONICAL_VERBS.find(v => v.id === duel.verb2Id) || CANONICAL_VERBS[1];
    const { mood, tense } = parseMoodTense(duel.tenseKey);

    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;

    persons.forEach(p => {
      const key1 = `${verb1.id}_${p}`;
      const res1 = validateConjugationCell(verb1, duel.tenseKey, p, confrontationInputs[key1] || '', strictAccents);
      newResults[key1] = res1;
      if (!res1.isCorrect) allCorrect = false;
      onRecordAttempt(verb1.id, mood, tense, res1.isCorrect);

      const key2 = `${verb2.id}_${p}`;
      const res2 = validateConjugationCell(verb2, duel.tenseKey, p, confrontationInputs[key2] || '', strictAccents);
      newResults[key2] = res2;
      if (!res2.isCorrect) allCorrect = false;
      onRecordAttempt(verb2.id, mood, tense, res2.isCorrect);
    });

    setConfrontationResults(newResults);
    if (allCorrect) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const validateImperative = () => {
    const verb = CANONICAL_VERBS.find(v => v.id === imperativeVerbId) || CANONICAL_VERBS[0];
    const imperativePersons = ['2s', '3s', '1p', '2p', '3p'] as const;
    const newResults: Record<string, ValidationResult> = {};
    let allCorrect = true;

    imperativePersons.forEach(p => {
      const afKey = `af_${p}`;
      const afRes = validateConjugationCell(verb, 'imperativo_af_presente', p, imperativeInputs[afKey] || '', strictAccents);
      newResults[afKey] = afRes;
      if (!afRes.isCorrect) allCorrect = false;
      onRecordAttempt(verb.id, 'imperativo_af', 'presente', afRes.isCorrect);

      const negKey = `neg_${p}`;
      const negVal = imperativeInputs[negKey] || '';
      const formatted = negVal.toLowerCase().startsWith('não ') || negVal.toLowerCase().startsWith('nao ')
        ? negVal
        : `não ${negVal}`;
      const negRes = validateConjugationCell(verb, 'imperativo_neg_presente', p, formatted, strictAccents);
      newResults[negKey] = negRes;
      if (!negRes.isCorrect) allCorrect = false;
      onRecordAttempt(verb.id, 'imperativo_neg', 'presente', negRes.isCorrect);
    });

    setImperativeResults(newResults);
    if (allCorrect) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const dynamicMaxWidth = tableColumns === 3 ? 'max-w-7xl' : tableColumns === 2 ? 'max-w-5xl' : 'max-w-3xl';

  return (
    <div className={`${dynamicMaxWidth} mx-auto py-6 px-4 sm:px-6 space-y-6 transition-all`}>
      
      {/* Sub-modes pill switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-[#2e353e]/60">
        <div className="inline-flex p-1 rounded-xl bg-[#181b20] border border-[#2e353e]">
          {[
            { id: 'unica', label: 'Tabela Única' },
            { id: 'sessao_aleatoria', label: 'Sessão Multi-Tempos' },
            { id: 'confronto', label: 'Confronto' },
            { id: 'imperativo', label: 'Imperativos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubMode(tab.id as TableSubMode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                subMode === tab.id
                  ? 'bg-[#262c35] text-[#f3ede6] font-bold shadow-sm'
                  : 'text-[#9ca3af] hover:text-[#f3ede6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* ----------------- MODO 1: TABELA ÚNICA ----------------- */}
      {subMode === 'unica' && (
        <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262b33]">
            <div>
              <div className="text-[11px] font-mono text-[#e8a87c] uppercase">Conjugação Específica</div>
              <h2 className="text-xl font-bold text-[#f3ede6] mt-0.5 flex items-center space-x-2">
                <span className="uppercase font-mono text-[#e8a87c]">{currentVerb.infinitive}</span>
                <span className="text-xs font-normal text-[#9ca3af]">({currentVerb.classification})</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedVerbId}
                onChange={(e) => setSelectedVerbId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#242930] border border-[#343c46] text-[#f3ede6] text-xs font-mono focus:outline-none focus:border-[#e8a87c]"
              >
                {CANONICAL_VERBS.map(v => (
                  <option key={v.id} value={v.id}>{v.infinitive.toUpperCase()}</option>
                ))}
              </select>

              <select
                value={selectedTenseKey}
                onChange={(e) => setSelectedTenseKey(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#242930] border border-[#343c46] text-[#f3ede6] text-xs font-mono focus:outline-none focus:border-[#e8a87c]"
              >
                {ALL_AVAILABLE_TENSES.map(t => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-[#9ca3af] font-mono">
            Tempo Solicitado: <strong className="text-[#f3ede6]">{TENSE_PRETTY_NAMES[selectedTenseKey] || selectedTenseKey}</strong>
          </div>

          {/* Grid Cells for Single Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {persons.map((person, index) => {
              const label = PRONOUN_LABELS[person];
              const val = singleInputs[person] || '';
              const res = singleResults[person];

              return (
                <div 
                  key={person} 
                  className={`p-3.5 rounded-xl bg-[#20242b] border transition-all ${
                    res 
                      ? res.isCorrect 
                        ? 'border-[#34d399]/40 bg-[#182a22]' 
                        : 'border-[#f87171]/40 bg-[#2f1c1f]' 
                      : 'border-[#2e353e] hover:border-[#3d4652]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                    <span className="text-[#9ca3af]">{label} <span className="opacity-60">({person})</span></span>
                    <button
                      type="button"
                      onClick={() => setSingleInputs(prev => ({ ...prev, [person]: 'N/A' }))}
                      className="text-[10px] text-[#9ca3af] hover:text-[#e8a87c] transition-colors underline decoration-dotted"
                    >
                      N/A (Defectivo)
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      ref={el => { singleInputRefs.current[person] = el; }}
                      type="text"
                      value={val}
                      onChange={(e) => setSingleInputs(prev => ({ ...prev, [person]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Tab') {
                          if (!e.shiftKey) {
                            e.preventDefault();
                            const nextP = persons[index + 1];
                            if (nextP && singleInputRefs.current[nextP]) {
                              singleInputRefs.current[nextP]?.focus();
                            } else {
                              validateSingleTable();
                            }
                          }
                        }
                      }}
                      placeholder={res?.isDefective && res?.isCorrect ? 'FORMA INEXISTENTE' : 'Digite a forma...'}
                      className="w-full px-3 py-2 bg-[#15181d] text-[#f3ede6] font-mono text-sm rounded-lg border border-[#2e353e] focus:border-[#e8a87c] focus:outline-none placeholder:text-[#525b68]"
                    />

                    {res && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {res.isCorrect ? (
                          <Check className="w-4 h-4 text-[#34d399]" />
                        ) : (
                          <X className="w-4 h-4 text-[#f87171]" />
                        )}
                      </div>
                    )}
                  </div>

                  {res && !res.isCorrect && (
                    <div className="text-[11px] font-mono text-[#f87171] mt-1.5 flex items-center justify-between">
                      <span>Gabarito: <strong className="text-[#34d399]">{res.expectedForm ?? 'INEXISTENTE'}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#262b33]">
            <button
              onClick={() => { setSingleInputs({}); setSingleResults({}); }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#20242b] hover:bg-[#262c35] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>

            <button
              onClick={validateSingleTable}
              className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
            >
              Verificar Tabela
            </button>
          </div>

        </div>
      )}

      {/* ----------------- MODO 2: SESSÃO MULTI-TEMPOS / ALEATÓRIA (COLUNAS REAIS) ----------------- */}
      {subMode === 'sessao_aleatoria' && (
        <div className="space-y-6">
          
          {/* Header Card with Minimalist Tray Drawer */}
          <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262b33]">
              <div>
                <div className="text-[11px] font-mono text-[#e8a87c] uppercase">Sessão de Domínio Total</div>
                <h2 className="text-2xl font-bold text-[#f3ede6] mt-0.5 flex items-center space-x-2">
                  <span className="uppercase font-mono text-[#e8a87c]">{currentVerb.infinitive}</span>
                  <span className="text-xs font-normal text-[#9ca3af]">({currentVerb.classification})</span>
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={nextRandomVerb}
                  disabled={sessionCycleFinished}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-bold text-xs font-mono shadow-md transition-all active:scale-95"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{sessionCycleFinished ? 'Ciclo concluído' : 'Sortear Próximo Verbo'}</span>
                </button>
                <span className="hidden lg:inline text-[10px] font-mono text-[#8b949e]">
                  {CANONICAL_VERBS.length} verbos · sem repetição
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-[#2e353e] bg-[#14161a]">
              <button
                type="button"
                onClick={() => setIsSessionProgressOpen(prev => !prev)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left font-mono text-xs text-[#f3ede6]"
              >
                <ListChecks className="h-4 w-4 text-[#e8a87c]" />
                <span className="font-bold">Progresso da sessão</span>
                <span className="text-[#8b949e]">{completedSessionVerbs.length} feitos · {CANONICAL_VERBS.length - completedSessionVerbs.length} pendentes</span>
                <span className="ml-auto text-[#8b949e]">{isSessionProgressOpen ? 'Recolher' : 'Ver verbos'}</span>
                {isSessionProgressOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>
              {isSessionProgressOpen && (
                <div className="space-y-3 border-t border-[#262b33] p-4">
                  <div className="h-2 overflow-hidden rounded-full bg-[#20242b]">
                    <div
                      className="h-full rounded-full bg-[#e8a87c] transition-all"
                      style={{ width: `${(completedSessionVerbs.length / CANONICAL_VERBS.length) * 100}%` }}
                    />
                  </div>
                  <div className="flex max-h-40 flex-wrap gap-1.5 overflow-y-auto" aria-label="Verbos praticados nesta sessão">
                    {completedSessionVerbs.length === 0 ? (
                      <span className="text-[11px] font-mono text-[#8b949e]">Nenhum verbo verificado ainda.</span>
                    ) : completedSessionVerbs.map(result => (
                      <span
                        key={result.verbId}
                        title={`${result.attempts} tentativa(s)`}
                        className={`rounded-lg border px-2 py-1 text-[10px] font-mono ${
                          result.correct
                            ? 'border-[#34d399]/40 bg-[#182a22] text-[#34d399]'
                            : 'border-[#f87171]/40 bg-[#2f1c1f] text-[#f87171]'
                        }`}
                      >
                        {result.verbId} {result.correct ? '✓' : '•'}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 text-[10px] font-mono text-[#8b949e]">
                    <span>Um verbo não volta a ser sorteado antes do fim do ciclo.</span>
                    <button type="button" onClick={restartMultiSession} className="shrink-0 text-[#e8a87c] hover:text-[#f0b58e]">
                      Reiniciar ciclo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Minimalist Collapsible Tray (Bandeja) */}
            <div className="rounded-xl bg-[#14161a] border border-[#262b33] p-3 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <button
                  onClick={() => setIsTrayOpen(prev => !prev)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left text-xs font-mono text-[#e8a87c] hover:text-[#f0b58e] transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 shrink-0 text-[#e8a87c]" />
                  <span className="truncate font-bold">Bandeja de Tempos ({multiTenses.length} selecionados)</span>
                  <span className="ml-auto inline-flex shrink-0 items-center gap-1 text-[11px] text-[#8b949e]">
                    {isTrayOpen ? 'Recolher' : 'Expandir'}
                    {isTrayOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </span>
                </button>

                <div className="flex items-center space-x-1 text-[11px] font-mono">
                  <button onClick={selectSubjuntivoOnly} className="px-2.5 py-1 rounded-lg bg-[#20242b] hover:bg-[#262c35] text-[#d1d5db]">Subjuntivo</button>
                  <button onClick={selectIndicativoOnly} className="px-2.5 py-1 rounded-lg bg-[#20242b] hover:bg-[#262c35] text-[#d1d5db]">Indicativo</button>
                  <button onClick={selectAllTenses} className="px-2.5 py-1 rounded-lg bg-[#20242b] hover:bg-[#262c35] text-[#e8a87c]">Todos</button>
                </div>
              </div>

              {/* Tray Content: Expanded grid of tenses */}
              {isTrayOpen && (
                <div className="pt-3 border-t border-[#262b33] animate-in fade-in space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {ALL_AVAILABLE_TENSES.map(t => {
                      const isSelected = multiTenses.includes(t.key);
                      return (
                        <button
                          key={t.key}
                          onClick={() => toggleMultiTense(t.key)}
                          className={`p-2 rounded-lg text-xs font-mono text-left transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#262c35] border-[#e8a87c] text-[#f3ede6] font-semibold'
                              : 'bg-[#181b20] border-[#2e353e] text-[#8b949e] hover:text-[#f3ede6]'
                          }`}
                        >
                          <span className="truncate">{t.label}</span>
                          <span className="text-[10px] text-[#e8a87c] opacity-80 shrink-0 ml-1.5">{t.group}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Render Real Columns: Each column is a tense, with the 6 persons stacked vertically underneath */}
          <div className={
            tableColumns === 1
              ? 'grid grid-cols-1 gap-6 max-w-xl mx-auto'
              : tableColumns === 3
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
              : 'grid grid-cols-1 md:grid-cols-2 gap-5'
          }>
            {multiTenses.map((tenseKey) => {
              const prettyName = TENSE_PRETTY_NAMES[tenseKey] || tenseKey;
              const isImperative = tenseKey.startsWith('imperativo_');
              const targetPersons: Person[] = isImperative ? ['2s', '3s', '1p', '2p', '3p'] : persons;

              return (
                <div 
                  key={tenseKey} 
                  className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 shadow-xl space-y-3.5 flex flex-col justify-between"
                >
                  {/* Column Header: Tense Title */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#262b33]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-[#e8a87c]" />
                      <h3 className="font-bold text-xs sm:text-sm text-[#f3ede6] font-mono leading-tight">{prettyName}</h3>
                    </div>
                    <span className="text-[10.5px] font-mono text-[#8b949e] shrink-0 ml-2">
                      <strong className="text-[#e8a87c] uppercase">{currentVerb.infinitive}</strong>
                    </span>
                  </div>

                  {/* Vertical Column of Persons underneath this tense */}
                  <div className="space-y-2.5 flex-1">
                    {targetPersons.map((person) => {
                      const label = PRONOUN_LABELS[person];
                      const cellId = `${tenseKey}_${person}`;
                      const val = multiInputs[cellId] || '';
                      const res = multiResults[cellId];

                      return (
                        <div 
                          key={cellId}
                          className={`p-2.5 rounded-xl bg-[#20242b] border transition-all ${
                            res 
                              ? res.isCorrect 
                                ? 'border-[#34d399]/40 bg-[#182a22]' 
                                : 'border-[#f87171]/40 bg-[#2f1c1f]' 
                              : 'border-[#2e353e] hover:border-[#3d4652]'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs mb-1 font-mono">
                            <span className="text-[#9ca3af] font-semibold">{label}</span>
                            <button
                              type="button"
                              onClick={() => setMultiInputs(prev => ({ ...prev, [cellId]: 'N/A' }))}
                              className="text-[10px] text-[#8b949e] hover:text-[#e8a87c] transition-colors underline decoration-dotted"
                            >
                              N/A
                            </button>
                          </div>

                          <div className="relative">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setMultiInputs(prev => ({ ...prev, [cellId]: e.target.value }))}
                              placeholder={res?.isDefective && res?.isCorrect ? 'INEXISTENTE' : 'Digite...'}
                              className="w-full px-2.5 py-1.5 bg-[#15181d] text-[#f3ede6] font-mono text-xs rounded-lg border border-[#2e353e] focus:border-[#e8a87c] focus:outline-none placeholder:text-[#525b68]"
                            />

                            {res && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                {res.isCorrect ? (
                                  <Check className="w-3.5 h-3.5 text-[#34d399]" />
                                ) : (
                                  <X className="w-3.5 h-3.5 text-[#f87171]" />
                                )}
                              </div>
                            )}
                          </div>

                          {res && !res.isCorrect && (
                            <div className="text-[10.5px] font-mono text-[#f87171] mt-1">
                              Gabarito: <strong className="text-[#34d399]">{res.expectedForm ?? 'INEXISTENTE'}</strong>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Sticky Footer */}
          <div className="p-4 rounded-2xl bg-[#181b20] border border-[#2e353e] flex items-center justify-between shadow-xl">
            <button
              onClick={() => { setMultiInputs({}); setMultiResults({}); }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#20242b] hover:bg-[#262c35] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Todas as Tabelas</span>
            </button>

            <button
              onClick={validateMultiSession}
              className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-bold text-xs font-mono transition-all shadow-md active:scale-95"
            >
              Verificar Todas as Tabelas
            </button>
          </div>

        </div>
      )}

      {/* ----------------- MODO 3: CONFRONTO ----------------- */}
      {subMode === 'confronto' && (
        <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262b33]">
            <div>
              <div className="text-[11px] font-mono text-[#e8a87c] uppercase">Confronto de Pares Perigosos</div>
              <h2 className="text-xl font-bold text-[#f3ede6]">Duelos Lado a Lado</h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {confrontationDuels.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setConfrontationId(d.id); setConfrontationInputs({}); setConfrontationResults({}); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                    confrontationId === d.id
                      ? 'bg-[#262c35] border-[#e8a87c] text-[#f3ede6] font-bold'
                      : 'bg-[#20242b] border-[#2e353e] text-[#9ca3af] hover:text-[#f3ede6]'
                  }`}
                >
                  {d.title}
                </button>
              ))}
            </div>
          </div>

          {(() => {
            const duel = confrontationDuels.find(d => d.id === confrontationId) || confrontationDuels[0];
            const verb1 = CANONICAL_VERBS.find(v => v.id === duel.verb1Id) || CANONICAL_VERBS[0];
            const verb2 = CANONICAL_VERBS.find(v => v.id === duel.verb2Id) || CANONICAL_VERBS[1];

            return (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-[#20242b] border border-[#262b33] text-xs text-[#d1d5db] font-sans leading-relaxed">
                  <strong>Pegadinha Clássica:</strong> {duel.note}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Verb 1 */}
                  <div className="p-4 rounded-xl bg-[#14161a] border border-[#262b33] space-y-3">
                    <div className="font-mono font-bold text-[#e8a87c] text-sm uppercase">
                      1. {verb1.infinitive}
                    </div>
                    {persons.map(p => {
                      const k = `${verb1.id}_${p}`;
                      const res = confrontationResults[k];
                      return (
                        <div key={k} className="space-y-1">
                          <div className="text-[11px] font-mono text-[#8b949e]">{PRONOUN_LABELS[p]}</div>
                          <input
                            type="text"
                            value={confrontationInputs[k] || ''}
                            onChange={(e) => setConfrontationInputs(prev => ({ ...prev, [k]: e.target.value }))}
                            className={`w-full px-3 py-1.5 bg-[#20242b] rounded-lg border text-xs font-mono text-[#f3ede6] ${
                              res ? (res.isCorrect ? 'border-[#34d399]' : 'border-[#f87171]') : 'border-[#2e353e]'
                            }`}
                          />
                          {res && !res.isCorrect && (
                            <div className="text-[10px] font-mono text-[#f87171]">Gabarito: {res.expectedForm}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Verb 2 */}
                  <div className="p-4 rounded-xl bg-[#14161a] border border-[#262b33] space-y-3">
                    <div className="font-mono font-bold text-[#e8a87c] text-sm uppercase">
                      2. {verb2.infinitive}
                    </div>
                    {persons.map(p => {
                      const k = `${verb2.id}_${p}`;
                      const res = confrontationResults[k];
                      return (
                        <div key={k} className="space-y-1">
                          <div className="text-[11px] font-mono text-[#8b949e]">{PRONOUN_LABELS[p]}</div>
                          <input
                            type="text"
                            value={confrontationInputs[k] || ''}
                            onChange={(e) => setConfrontationInputs(prev => ({ ...prev, [k]: e.target.value }))}
                            className={`w-full px-3 py-1.5 bg-[#20242b] rounded-lg border text-xs font-mono text-[#f3ede6] ${
                              res ? (res.isCorrect ? 'border-[#34d399]' : 'border-[#f87171]') : 'border-[#2e353e]'
                            }`}
                          />
                          {res && !res.isCorrect && (
                            <div className="text-[10px] font-mono text-[#f87171]">Gabarito: {res.expectedForm}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={validateConfrontation}
                    className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
                  >
                    Validar Confronto
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      )}

      {/* ----------------- MODO 4: IMPERATIVOS ----------------- */}
      {subMode === 'imperativo' && (
        <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#262b33]">
            <div>
              <div className="text-[11px] font-mono text-[#e8a87c] uppercase">Matriz Imperativa</div>
              <h2 className="text-xl font-bold text-[#f3ede6]">Afirmativo vs Negativo</h2>
            </div>

            <select
              value={imperativeVerbId}
              onChange={(e) => setImperativeVerbId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#242930] border border-[#343c46] text-[#f3ede6] text-xs font-mono focus:outline-none focus:border-[#e8a87c]"
            >
              {CANONICAL_VERBS.map(v => (
                <option key={v.id} value={v.id}>{v.infinitive.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imperativo Afirmativo */}
            <div className="p-4 rounded-xl bg-[#14161a] border border-[#262b33] space-y-3">
              <div className="font-mono font-bold text-[#34d399] text-xs uppercase">
                Imperativo Afirmativo
              </div>
              {(['2s', '3s', '1p', '2p', '3p'] as const).map(p => {
                const k = `af_${p}`;
                const res = imperativeResults[k];
                return (
                  <div key={k} className="space-y-1">
                    <div className="text-[11px] font-mono text-[#8b949e]">{PRONOUN_LABELS[p]}</div>
                    <input
                      type="text"
                      value={imperativeInputs[k] || ''}
                      onChange={(e) => setImperativeInputs(prev => ({ ...prev, [k]: e.target.value }))}
                      className={`w-full px-3 py-1.5 bg-[#20242b] rounded-lg border text-xs font-mono text-[#f3ede6] ${
                        res ? (res.isCorrect ? 'border-[#34d399]' : 'border-[#f87171]') : 'border-[#2e353e]'
                      }`}
                    />
                    {res && !res.isCorrect && (
                      <div className="text-[10px] font-mono text-[#f87171]">Gabarito: {res.expectedForm}</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Imperativo Negativo */}
            <div className="p-4 rounded-xl bg-[#14161a] border border-[#262b33] space-y-3">
              <div className="font-mono font-bold text-[#f87171] text-xs uppercase">
                Imperativo Negativo (não ...)
              </div>
              {(['2s', '3s', '1p', '2p', '3p'] as const).map(p => {
                const k = `neg_${p}`;
                const res = imperativeResults[k];
                return (
                  <div key={k} className="space-y-1">
                    <div className="text-[11px] font-mono text-[#8b949e]">{PRONOUN_LABELS[p]}</div>
                    <input
                      type="text"
                      value={imperativeInputs[k] || ''}
                      onChange={(e) => setImperativeInputs(prev => ({ ...prev, [k]: e.target.value }))}
                      placeholder="não ..."
                      className={`w-full px-3 py-1.5 bg-[#20242b] rounded-lg border text-xs font-mono text-[#f3ede6] ${
                        res ? (res.isCorrect ? 'border-[#34d399]' : 'border-[#f87171]') : 'border-[#2e353e]'
                      }`}
                    />
                    {res && !res.isCorrect && (
                      <div className="text-[10px] font-mono text-[#f87171]">Gabarito: {res.expectedForm}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={validateImperative}
              className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
            >
              Validar Matriz Imperativa
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
