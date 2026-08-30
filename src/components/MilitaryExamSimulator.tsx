import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import type { MilitaryBanca, MilitaryQuestion, QuestionArchetype } from '../types/verbs';
import { MILITARY_QUESTIONS } from '../data/militaryQuestions';
import { generateMilitaryQuestion } from '../services/aiGenerator';

interface MilitaryExamSimulatorProps {
  initialArchetype?: QuestionArchetype;
  onRecordAttempt: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

export const MilitaryExamSimulator: React.FC<MilitaryExamSimulatorProps> = ({
  initialArchetype = 'lacuna_derivado',
  onRecordAttempt
}) => {
  const [selectedBanca, setSelectedBanca] = useState<MilitaryBanca>('EsPCEx');
  const [selectedArchetype, setSelectedArchetype] = useState<QuestionArchetype>(initialArchetype);
  const [currentQuestion, setCurrentQuestion] = useState<MilitaryQuestion>(() => {
    return MILITARY_QUESTIONS.find(q => q.archetype === initialArchetype) || MILITARY_QUESTIONS[0];
  });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [sessionScore, setSessionScore] = useState<{ total: number; correct: number }>({ total: 0, correct: 0 });

  const bancas: MilitaryBanca[] = ['EsPCEx', 'EEAr', 'AFA', 'EFOMM', 'Colégio Naval', 'EPCAr'];
  const archetypes: { key: QuestionArchetype; label: string }[] = [
    { key: 'lacuna_derivado', label: 'Derivados Perigosos (Pôr, Vir, Ter)' },
    { key: 'homonimos_temporais', label: 'Homônimos (Ver vs Vir)' },
    { key: 'imperativo_conversao', label: 'Imperativo (Tu vs Você)' },
    { key: 'duplo_participio', label: 'Duplo Particípio & Abundantes' },
    { key: 'identificacao_morfologica', label: 'Morfologia & Desinências' },
    { key: 'correlacao', label: 'Correlação & Articulação Verbal' }
  ];

  const handleSelectOption = (letter: string) => {
    if (isAnswered) return;
    setSelectedOption(letter);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || isAnswered) return;
    setIsAnswered(true);

    const chosen = currentQuestion.options.find(o => o.letter === selectedOption);
    const isCorrect = chosen?.correct ?? false;

    setSessionScore(prev => ({
      total: prev.total + 1,
      correct: prev.correct + (isCorrect ? 1 : 0)
    }));

    if (currentQuestion.targetVerbs.length > 0) {
      onRecordAttempt(currentQuestion.targetVerbs[0], 'indicativo' as any, 'presente' as any, isCorrect);
    }

  };

  const handleNextQuestion = async (useAi: boolean = false) => {
    setSelectedOption(null);
    setIsAnswered(false);

    if (useAi) {
      setIsGeneratingAi(true);
      try {
        const generated = await generateMilitaryQuestion(selectedBanca, selectedArchetype);
        setCurrentQuestion(generated);
      } catch (e) {
        console.error(e);
      } finally {
        setIsGeneratingAi(false);
      }
    } else {
      // Pick another question
      const filtered = MILITARY_QUESTIONS.filter(q => q.archetype === selectedArchetype);
      const available = filtered.length > 0 ? filtered : MILITARY_QUESTIONS;
      const nextQ = available[Math.floor(Math.random() * available.length)];
      setCurrentQuestion(nextQ);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Header & Filter Controls */}
      <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-md">
        <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
          <Brain className="w-4 h-4" />
          <span>SIMULADOR TÁTICO DE QUESTÕES DE PROVA</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-100">
              Questões no Padrão das Bancas Militares
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Enunciados rigorosos, contextualizações autênticas e análise morfológica.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
            <span>Sessão:</span>
            <strong className="text-emerald-400">{sessionScore.correct}</strong>
            <span>/</span>
            <span>{sessionScore.total} acertos</span>
          </div>
        </div>

        {/* Banca & Archetype Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-zinc-800">
          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">Banca Alvo:</label>
            <select
              value={selectedBanca}
              onChange={(e) => setSelectedBanca(e.target.value as MilitaryBanca)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              {bancas.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1 uppercase">Arquétipo Gramatical:</label>
            <select
              value={selectedArchetype}
              onChange={(e) => setSelectedArchetype(e.target.value as QuestionArchetype)}
              className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs font-mono rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              {archetypes.map(a => (
                <option key={a.key} value={a.key}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-6 shadow-xl space-y-6">
        
        {/* Question Header Meta */}
        <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              {currentQuestion.bancaTarget}
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              {currentQuestion.archetype.replace('_', ' ').toUpperCase()}
            </span>
            {currentQuestion.isAiGenerated && (
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>INÉDITA IA</span>
              </span>
            )}
          </div>
          <span className="text-zinc-500 uppercase">Dificuldade: {currentQuestion.difficulty}</span>
        </div>

        {/* Statement / Enunciado */}
        <div className="text-zinc-100 text-sm sm:text-base leading-relaxed whitespace-pre-line font-medium">
          {currentQuestion.statement}
        </div>

        {/* Options (A, B, C, D) */}
        <div className="space-y-3">
          {currentQuestion.options.map(option => {
            const isSelected = selectedOption === option.letter;
            let optionStyles = 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-700 text-zinc-300';

            if (isAnswered) {
              if (option.correct) {
                optionStyles = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-md shadow-emerald-500/10';
              } else if (isSelected && !option.correct) {
                optionStyles = 'border-rose-500 bg-rose-950/40 text-rose-200';
              } else {
                optionStyles = 'border-zinc-850 bg-zinc-950/30 text-zinc-500 opacity-60';
              }
            } else if (isSelected) {
              optionStyles = 'border-emerald-500 bg-emerald-950/30 text-zinc-100 shadow-sm';
            }

            return (
              <button
                key={option.letter}
                onClick={() => handleSelectOption(option.letter)}
                disabled={isAnswered}
                className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-start space-x-3.5 ${optionStyles}`}
              >
                <span className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  isSelected ? 'bg-emerald-500 text-zinc-950 border-emerald-400' : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                }`}>
                  {option.letter}
                </span>
                <div className="flex-1 pt-0.5">
                  <div>{option.text}</div>
                  {isAnswered && (
                    <div className={`text-xs mt-2 font-mono ${option.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {option.explanation}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Answer Resolution Commentary */}
        {isAnswered && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-2 animate-in fade-in">
            <div className="font-bold text-emerald-400 font-mono flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>COMENTÁRIO DA RESOLUÇÃO (PROFESSOR MILITAR)</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              {currentQuestion.resolutionCommentary}
            </p>
            {currentQuestion.ruleContext && (
              <div className="text-[11px] font-mono text-zinc-500 pt-1">
                Fundamento: {currentQuestion.ruleContext}
              </div>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
          <div>
            {!isAnswered ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!selectedOption}
                className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs font-mono transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Confirmar Resposta
              </button>
            ) : (
              <button
                onClick={() => handleNextQuestion(false)}
                className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs font-mono transition-colors"
              >
                <span>Próxima Questão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => handleNextQuestion(true)}
            disabled={isGeneratingAi}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-xs font-mono transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isGeneratingAi ? 'Gerando com IA...' : 'Gerar Inédita com IA'}</span>
          </button>
        </div>

      </div>

    </div>
  );
};
