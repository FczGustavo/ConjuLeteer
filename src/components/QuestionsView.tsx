import React, { useState } from 'react';
import { AlertCircle, BookOpen, Check, Sparkles, X } from 'lucide-react';
import type { MilitaryQuestion, QuestionArchetype } from '../types/verbs';
import { generateMilitaryQuestions } from '../services/aiGenerator';
import { FormattedExamText } from '../utils/textFormatter';

interface QuestionsViewProps {
  onRecordAttempt: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

const QUESTION_COUNTS = [5, 10, 20] as const;
const ARCHETYPES: { value: QuestionArchetype; label: string }[] = [
  { value: 'lacuna_derivado', label: 'Verbos derivados e lacunas' },
  { value: 'correlacao', label: 'Correlação verbal' },
  { value: 'imperativo_conversao', label: 'Conversão do imperativo' },
  { value: 'identificacao_morfologica', label: 'Identificação morfológica' },
  { value: 'vozes_verbais', label: 'Vozes verbais' },
  { value: 'duplo_participio', label: 'Duplo particípio' },
  { value: 'homonimos_temporais', label: 'Verbos homônimos e semelhantes' }
];

export const QuestionsView: React.FC<QuestionsViewProps> = ({ onRecordAttempt }) => {
  const [archetype, setArchetype] = useState<QuestionArchetype>('lacuna_derivado');
  const [questionCount, setQuestionCount] = useState<5 | 10 | 20>(5);
  const [targetVerb, setTargetVerb] = useState('');
  const [questions, setQuestions] = useState<MilitaryQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState({ total: 0, correct: 0 });
  const question = questions[currentIndex] ?? null;

  const generateQuestion = async () => {
    setIsGenerating(true);
    setGenerationStatus(`Planejando ${questionCount} questões balanceadas...`);
    setError(null);
    setSelectedLetter(null);
    setIsAnswered(false);
    try {
      const generated = await generateMilitaryQuestions(
        questionCount,
        archetype,
        targetVerb.trim() || undefined,
        setGenerationStatus
      );
      setQuestions(generated);
      setCurrentIndex(0);
    } catch (reason) {
      setQuestions([]);
      setCurrentIndex(0);
      setError(reason instanceof Error ? reason.message : 'Não foi possível gerar a questão.');
    } finally {
      setIsGenerating(false);
      setGenerationStatus('');
    }
  };

  const showNextQuestion = () => {
    if (currentIndex >= questions.length - 1) return;
    setCurrentIndex(index => index + 1);
    setSelectedLetter(null);
    setIsAnswered(false);
  };

  const confirmAnswer = () => {
    if (!question || !selectedLetter || isAnswered) return;
    const isCorrect = question.options.find(option => option.letter === selectedLetter)?.correct ?? false;
    setIsAnswered(true);
    setScore(current => ({ total: current.total + 1, correct: current.correct + (isCorrect ? 1 : 0) }));

    const trackedVerb = question.targetVerbs[0] || 'questao-ia';
    onRecordAttempt(trackedVerb, 'indicativo', 'presente', isCorrect);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <section className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#e8a87c]">
              <Sparkles className="w-4 h-4" />
              <span>Laboratório de questões com IA</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f3ede6] mt-1">Questão inédita sob demanda</h1>
            <p className="text-sm text-[#9ca3af] mt-1 max-w-2xl">
              Gere um caderno inédito e genérico com o modelo configurado no OpenRouter, sem atribuição a uma banca específica.
            </p>
          </div>
          <div className="shrink-0 px-3 py-2 rounded-xl bg-[#20242b] border border-[#2e353e] text-xs font-mono">
            <span className="text-[#9ca3af]">Acertos </span>
            <strong className="text-[#34d399]">{score.correct}</strong>
            <span className="text-[#6b7280]"> / {score.total}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#2e353e]">
          <label className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-[#9ca3af]">Quantidade</span>
            <select value={questionCount} onChange={event => setQuestionCount(Number(event.target.value) as 5 | 10 | 20)} className="w-full px-3 py-2.5 rounded-xl bg-[#121417] border border-[#343c46] text-sm text-[#f3ede6] focus:outline-none focus:border-[#e8a87c]">
              {QUESTION_COUNTS.map(item => <option key={item} value={item}>{item} questões</option>)}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase text-[#9ca3af]">Conteúdo</span>
            <select value={archetype} onChange={event => setArchetype(event.target.value as QuestionArchetype)} className="w-full px-3 py-2.5 rounded-xl bg-[#121417] border border-[#343c46] text-sm text-[#f3ede6] focus:outline-none focus:border-[#e8a87c]">
              {ARCHETYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 sm:col-span-2">
            <span className="text-[11px] font-mono uppercase text-[#9ca3af]">Verbo específico (opcional)</span>
            <input value={targetVerb} onChange={event => setTargetVerb(event.target.value)} placeholder="Ex.: intervir, reaver, pôr" className="w-full px-3 py-2.5 rounded-xl bg-[#121417] border border-[#343c46] text-sm text-[#f3ede6] placeholder:text-[#59616c] focus:outline-none focus:border-[#e8a87c]" />
          </label>
        </div>

        <button onClick={generateQuestion} disabled={isGenerating} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] disabled:opacity-50 disabled:cursor-wait text-[#16181b] font-bold text-sm transition-all active:scale-[0.98]">
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-pulse' : ''}`} />
          <span>{isGenerating ? generationStatus || `Gerando e validando ${questionCount} questões...` : questions.length ? 'Gerar novo caderno' : 'Gerar questões com IA'}</span>
        </button>

        {isGenerating && (
          <p role="status" className="text-xs text-[#9ca3af]">
            Cada bloco passa por uma segunda resolução independente. Questões divergentes são regeneradas automaticamente.
          </p>
        )}

        {error && (
          <div role="alert" className="flex items-start gap-2.5 p-4 rounded-xl bg-[#2f1c1f] border border-[#f87171]/40 text-[#fca5a5] text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <div><strong className="block text-[#f87171]">Geração interrompida</strong><span>{error}</span></div>
          </div>
        )}
      </section>

      {!question && !error && !isGenerating && (
        <div className="rounded-2xl border border-dashed border-[#343c46] p-10 text-center text-[#8b949e]">
          <Sparkles className="w-7 h-7 mx-auto mb-3 text-[#e8a87c]" />
          <p className="font-medium text-[#d1d5db]">Escolha os parâmetros e gere sua primeira questão.</p>
          <p className="text-xs mt-1">A chave e o modelo são definidos no ícone de Configurações.</p>
        </div>
      )}

      {question && (
        <article className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 sm:p-7 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2e353e] text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#e8a87c]/10 border border-[#e8a87c]/30 text-[#e8a87c]">Questão {currentIndex + 1} de {questions.length}</span>
              <span className="px-2.5 py-1 rounded-lg bg-[#242930] text-[#9ca3af]">Inédita · IA</span>
            </div>
            <span className="text-[#8b949e]">{question.difficulty}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#14161a] border border-[#262b33] text-sm sm:text-base text-[#f3ede6]">
            <FormattedExamText text={question.statement} mode="statement" />
          </div>

          <div className="space-y-3">
            {question.options.map(option => {
              const selected = selectedLetter === option.letter;
              const style = isAnswered
                ? option.correct
                  ? 'border-[#34d399] bg-[#182a22] text-[#f3ede6]'
                  : selected
                    ? 'border-[#f87171] bg-[#2f1c1f] text-[#fca5a5]'
                    : 'border-[#2e353e] bg-[#15181d] text-[#6b7280] opacity-70'
                : selected
                  ? 'border-[#e8a87c] bg-[#282e38] text-[#f3ede6]'
                  : 'border-[#2e353e] bg-[#20242b] hover:bg-[#262c35] text-[#d1d5db]';

              return (
                <div key={option.letter} className="space-y-1.5">
                  <button onClick={() => !isAnswered && setSelectedLetter(option.letter)} disabled={isAnswered} className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 text-sm transition-all ${style}`}>
                    <span className="w-7 h-7 rounded-lg bg-[#121417] border border-[#343c46] flex items-center justify-center font-mono font-bold shrink-0">{option.letter}</span>
                    <FormattedExamText text={option.text} mode="option" className="flex-1 pt-0.5" />
                  </button>
                  {isAnswered && (
                    <div className={`ml-3 pl-3 py-2 border-l-2 text-xs leading-relaxed ${option.correct ? 'border-[#34d399] text-[#a7f3d0]' : 'border-[#f87171]/60 text-[#fca5a5]'}`}>
                      <span className="inline-flex items-center gap-1 font-bold mr-1">{option.correct ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}{option.correct ? 'Correta:' : 'Incorreta:'}</span>
                      {option.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isAnswered && (
            <div className="p-4 rounded-xl bg-[#14161a] border border-[#2e353e] text-sm">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8a87c] mb-2"><BookOpen className="w-4 h-4" />Resolução da IA</div>
              <FormattedExamText text={question.resolutionCommentary} className="text-[#d1d5db]" />
              <p className="text-xs text-[#8b949e] mt-3">Regra central: {question.ruleContext}</p>
            </div>
          )}

          {isAnswered && currentIndex < questions.length - 1 && (
            <div className="flex justify-end pt-3 border-t border-[#2e353e]">
              <button onClick={showNextQuestion} className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-bold text-sm transition-all">
                Próxima questão ({currentIndex + 2}/{questions.length})
              </button>
            </div>
          )}

          {!isAnswered && (
            <div className="flex justify-end pt-3 border-t border-[#2e353e]">
              <button onClick={confirmAnswer} disabled={!selectedLetter} className="px-6 py-2.5 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] disabled:opacity-40 disabled:cursor-not-allowed text-[#16181b] font-bold text-sm transition-all">Confirmar resposta</button>
            </div>
          )}
        </article>
      )}
    </div>
  );
};
