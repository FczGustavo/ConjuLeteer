import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  SlidersHorizontal,
  ListChecks,
  Play,
  Trash2,
  ClipboardCheck,
  Copy,
  Check,
  Scissors
} from 'lucide-react';
import { QUESTION_BANK, type QuestionBankItem, SUBJECTS_CONFIG } from '../data/questionBank';
import { ENGLISH_QUESTION_BANK } from '../data/englishQuestionBank';
import { ENGLISH_SUBJECTS_CONFIG } from '../data/englishSubjects';
import { getCustomQuestions } from '../services/pdfImportService';
import { ImportPdfModal } from './ImportPdfModal';
import { QuestionBankFilterView, type FilterState } from './QuestionBankFilterView';
import { FormattedExamText } from '../utils/textFormatter';
import { getQuestionSupport, normalizeQuestionSupport, supportToClipboardText } from '../utils/questionSupport';
import {
  createQuestionList,
  deleteQuestionList,
  loadQuestionLists,
  saveQuestionListProgress,
  type SavedQuestionList
} from '../services/questionListService';

interface QuestionBankViewProps {
  onRecordAttempt?: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
  initialMode?: 'filters' | 'lists';
}

function toClipboardText(text: string): string {
  return text
    .replace(/\*\*(\d{1,2})\*\*\*\*\s*([-–—])\*\*/g, '$1 $2')
    .replace(/\*\*([-–—:;,.!?])\*\*/g, '$1')
    .replace(/\*\*([IVX]{1,4}|\d{1,2})\*\*(?=\s*[-–—.)])/gi, '$1')
    .replace(/(?<=\p{L})\*\*([áéíóúàâêôãõç])\*\*(?=\p{L})/giu, '$1')
    .replace(/\*\*/g, '')
    .replace(/<\/?(?:b|strong|u)>/gi, '')
    .replace(/\bocéu\b/gi, 'o céu')
    .replace(/(\d{1,2}\s*[§º°])(?=\S)/g, '$1 ')
    .replace(/\bEo\b/g, 'E o')
    .replace(/\beo\b/g, 'e o')
    .replace(/\bEa\b/g, 'E a')
    .replace(/\beA\b/g, 'e A')
    .replace(/\bea\b/g, 'e a')
    .replace(/\béa\b/gi, 'é a')
    .replace(/\bu\s+mpronome\b/gi, 'um pronome')
    .replace(/\bu\s+mverbo\b/gi, 'um verbo')
    .replace(/\bfiorescia\b/gi, 'florescia')
    .replace(/\bfiores\b/gi, 'flores')
    .replace(/[�¢€†]/g, '')
    .replace(/\*/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onRecordAttempt,
  initialMode = 'filters'
}) => {
  const [viewMode, setViewMode] = useState<'filters' | 'practice' | 'lists'>(initialMode);

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
    languageFilter: 'pt',
    selectedSubjectIds: SUBJECTS_CONFIG.filter(s => s.id !== 'todos').map(s => s.id),
    selectedListIds: ['pdf_7'],
    statusFilter: 'all',
    limitQuantity: undefined
  });

  const [pageSize, setPageSize] = useState<number>(1); // 1, 5, 10, 20 ou 0 (Todas)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [expandedReadingTexts, setExpandedReadingTexts] = useState<Record<string, boolean>>({});
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [customQuestions, setCustomQuestions] = useState<QuestionBankItem[]>(getCustomQuestions);
  const [savedLists, setSavedLists] = useState<SavedQuestionList[]>(loadQuestionLists);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [expandedAnswerKeyId, setExpandedAnswerKeyId] = useState<string | null>(null);
  const [copiedPart, setCopiedPart] = useState<{ questionId: string; kind: 'full' | 'statement' } | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const copyTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
  }, []);

  // Preview answers are intentionally ephemeral; only an active saved list persists.
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
  const [noIdeaQuestions, setNoIdeaQuestions] = useState<Record<string, boolean>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!activeListId) return;
    const timeout = window.setTimeout(() => {
      const result = saveQuestionListProgress(activeListId, {
        userAnswers,
        confirmedAnswers,
        noIdeaQuestions,
        currentPage,
        pageSize
      });
      setSaveError(result.ok ? null : result.reason === 'quota'
        ? 'Armazenamento cheio: o progresso recente não foi salvo.'
        : 'Não foi possível salvar o progresso neste navegador.');
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [activeListId, userAnswers, confirmedAnswers, noIdeaQuestions, currentPage, pageSize]);

  // Keep the audited source records immutable. Editorial normalization is
  // applied only to the visible page below, not to all 2,031 records at once.
  const allBankQuestions = useMemo(() => {
    return [...QUESTION_BANK, ...ENGLISH_QUESTION_BANK, ...customQuestions];
  }, [customQuestions]);

  const questionById = useMemo(
    () => new Map(allBankQuestions.map(question => [question.id, question])),
    [allBankQuestions]
  );

  // Filtered Questions based on filterState
  const filteredQuestions = useMemo(() => {
    const activeList = savedLists.find(list => list.id === activeListId);
    if (activeList) {
      return activeList.questionIds.map(id => questionById.get(id)).filter((question): question is QuestionBankItem => Boolean(question));
    }
    let list = allBankQuestions.filter(q => {
      if (filterState.languageFilter === 'en' ? q.language !== 'en' : q.language === 'en') return false;
      // 1. Subject filter
      if (filterState.selectedSubjectIds.length > 0) {
        if (!filterState.selectedSubjectIds.includes(q.subjectId)) {
          return false;
        }
      } else {
        return false;
      }

      // 2. Status filter
      if (filterState.statusFilter === 'pending') {
        if (confirmedAnswers[q.id]) return false;
      } else if (filterState.statusFilter === 'correct') {
        if (!confirmedAnswers[q.id] || userAnswers[q.id] !== q.correctLetter) return false;
      } else if (filterState.statusFilter === 'wrong') {
        if (!confirmedAnswers[q.id] || userAnswers[q.id] === q.correctLetter) return false;
      } else if (filterState.statusFilter === 'noIdea') {
        if (!noIdeaQuestions[q.id]) return false;
      }

      return true;
    });

    if (filterState.limitQuantity && filterState.limitQuantity > 0) {
      list = list.slice(0, filterState.limitQuantity);
    }

    return list;
  }, [allBankQuestions, filterState, confirmedAnswers, userAnswers, noIdeaQuestions, activeListId, savedLists, questionById]);

  // Start practice handler
  const handleStartPractice = (limit?: number) => {
    setActiveListId(null);
    setUserAnswers({});
    setConfirmedAnswers({});
    setNoIdeaQuestions({});
    setEliminatedOptions({});
    if (limit) {
      setFilterState(prev => ({ ...prev, limitQuantity: limit }));
    } else {
      setFilterState(prev => ({ ...prev, limitQuantity: undefined }));
    }
    setCurrentPage(0);
    setViewMode('practice');
  };

  const matchingFilteredQuestions = (limit?: number) => {
    const matching = allBankQuestions.filter(question => {
      if (filterState.languageFilter === 'en' ? question.language !== 'en' : question.language === 'en') return false;
      if (!filterState.selectedSubjectIds.includes(question.subjectId)) return false;
      if (filterState.statusFilter === 'pending') return !confirmedAnswers[question.id];
      if (filterState.statusFilter === 'correct') return confirmedAnswers[question.id] && userAnswers[question.id] === question.correctLetter;
      if (filterState.statusFilter === 'wrong') return confirmedAnswers[question.id] && userAnswers[question.id] !== question.correctLetter;
      if (filterState.statusFilter === 'noIdea') return Boolean(noIdeaQuestions[question.id]);
      return true;
    });
    return limit ? matching.slice(0, limit) : matching;
  };

  const handleCreateList = (limit?: number) => {
    const questions = matchingFilteredQuestions(limit);
    if (!questions.length) return;
    const activeSubjectConfig = filterState.languageFilter === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG;
    const subjectNames = filterState.selectedSubjectIds
      .map(id => activeSubjectConfig.find(subject => subject.id === id)?.shortTitle)
      .filter(Boolean);
    const label = subjectNames.length === activeSubjectConfig.filter(subject => subject.id !== 'todos').length
      ? (filterState.languageFilter === 'en' ? 'Todos os assuntos de Inglês' : 'Todos os assuntos')
      : subjectNames.slice(0, 2).join(' + ') + (subjectNames.length > 2 ? ` +${subjectNames.length - 2}` : '');
    const statusLabel: Record<FilterState['statusFilter'], string> = {
      all: '',
      pending: 'Pendentes',
      correct: 'Acertos',
      wrong: 'Erros',
      noIdea: 'Marcadas como não sei'
    };
    const filterSuffix = statusLabel[filterState.statusFilter]
      ? ` · ${statusLabel[filterState.statusFilter]}`
      : '';
    const list = createQuestionList(
      `${label}${filterSuffix} · ${questions.length} questões`,
      questions.map(question => question.id),
      filterState.selectedSubjectIds,
      filterState.statusFilter,
      noIdeaQuestions
    );
    setSavedLists(loadQuestionLists());
    openSavedList(list);
  };

  const openSavedList = (list: SavedQuestionList) => {
    setActiveListId(list.id);
    setUserAnswers(list.userAnswers);
    setConfirmedAnswers(list.confirmedAnswers);
    setNoIdeaQuestions(list.noIdeaQuestions ?? {});
    setEliminatedOptions({});
    setCurrentPage(list.currentPage);
    setPageSize(list.pageSize);
    setViewMode('practice');
  };

  const handleDeleteList = (id: string) => {
    const list = savedLists.find(item => item.id === id);
    if (!list || !window.confirm(`Excluir a lista “${list.name}” e todo o progresso salvo nela?`)) return;
    setSavedLists(deleteQuestionList(id));
    setExpandedAnswerKeyId(current => current === id ? null : current);
  };

  const buildQuestionCopy = (question: QuestionBankItem, includeSupport: boolean) => {
    const sections: string[] = [];
    const support = getQuestionSupport(question);
    if (includeSupport && support) {
      sections.push(`TEXTO DE APOIO\n${supportToClipboardText(support)}`);
    }
    sections.push(`ENUNCIADO\n${toClipboardText(question.statement)}`);
    if (includeSupport) {
      sections.push(`ALTERNATIVAS\n${question.options.map(option => `${option.letter}) ${toClipboardText(option.text)}`).join('\n')}`);
    }
    return sections.join('\n\n');
  };

  const handleCopyQuestion = async (question: QuestionBankItem, kind: 'full' | 'statement') => {
    const text = buildQuestionCopy(question, kind === 'full');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopiedPart({ questionId: question.id, kind });
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => {
      setCopiedPart(current => current?.questionId === question.id && current.kind === kind ? null : current);
    }, 1800);
  };

  const returnFromPractice = () => {
    if (activeListId) setSavedLists(loadQuestionLists());
    setViewMode(activeListId ? 'lists' : 'filters');
  };

  // Performance metrics for current filtered questions
  const metrics = useMemo(() => {
    let confirmedCount = 0;
    let correctCount = 0;

    filteredQuestions.forEach(q => {
      if (confirmedAnswers[q.id]) {
        confirmedCount++;
        if (userAnswers[q.id] === q.correctLetter) {
          correctCount++;
        }
      }
    });

    const accuracy = confirmedCount > 0 ? Math.round((correctCount / confirmedCount) * 100) : 0;
    return {
      total: filteredQuestions.length,
      confirmed: confirmedCount,
      correct: correctCount,
      accuracy
    };
  }, [filteredQuestions, confirmedAnswers, userAnswers]);

  // Pagination calculations
  const effectivePageSize = pageSize === 0 ? filteredQuestions.length : pageSize;
  const totalPages = Math.ceil(filteredQuestions.length / (effectivePageSize || 1)) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages - 1);

  const pageQuestions = useMemo(() => {
    if (pageSize === 0) return filteredQuestions.map(normalizeQuestionSupport);
    const start = safeCurrentPage * pageSize;
    return filteredQuestions.slice(start, start + pageSize).map(normalizeQuestionSupport);
  }, [filteredQuestions, safeCurrentPage, pageSize]);

  // User Actions
  const handleSelectOption = (questionId: string, letter: string) => {
    if (confirmedAnswers[questionId] || noIdeaQuestions[questionId] || eliminatedOptions[questionId]?.includes(letter)) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: letter
    }));
  };

  const toggleEliminatedOption = (questionId: string, letter: string) => {
    if (confirmedAnswers[questionId]) return;
    setEliminatedOptions(prev => {
      const current = prev[questionId] ?? [];
      const isEliminated = current.includes(letter);
      const next = isEliminated ? current.filter(item => item !== letter) : [...current, letter];
      const updated = { ...prev };
      if (next.length) updated[questionId] = next;
      else delete updated[questionId];
      return updated;
    });
    if (!eliminatedOptions[questionId]?.includes(letter)) {
      setUserAnswers(prev => {
        if (prev[questionId] !== letter) return prev;
        const { [questionId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleConfirmQuestion = (q: QuestionBankItem) => {
    const chosen = userAnswers[q.id];
    if (!chosen || confirmedAnswers[q.id] || noIdeaQuestions[q.id]) return;

    setConfirmedAnswers(prev => ({ ...prev, [q.id]: true }));
    setNoIdeaQuestions(prev => {
      if (!prev[q.id]) return prev;
      const { [q.id]: _removed, ...rest } = prev;
      return rest;
    });
    const isCorrect = chosen === q.correctLetter;

    onRecordAttempt?.(q.id, 'banco', q.subjectId, isCorrect);
  };

  const handleConfirmAllOnPage = () => {
    const newConfirmed = { ...confirmedAnswers };
    const newNoIdea = { ...noIdeaQuestions };
    pageQuestions.forEach(q => {
      const chosen = userAnswers[q.id];
      if (chosen && !confirmedAnswers[q.id] && !newNoIdea[q.id]) {
        newConfirmed[q.id] = true;
        delete newNoIdea[q.id];
        const isCorrect = chosen === q.correctLetter;
        onRecordAttempt?.(q.id, 'banco', q.subjectId, isCorrect);
      }
    });

    setConfirmedAnswers(newConfirmed);
    setNoIdeaQuestions(newNoIdea);
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setConfirmedAnswers({});
    setNoIdeaQuestions({});
    setEliminatedOptions({});
  };

  const toggleNoIdeaQuestion = (questionId: string) => {
    if (confirmedAnswers[questionId]) return;
    const isMarked = Boolean(noIdeaQuestions[questionId]);
    setNoIdeaQuestions(prev => {
      const next = { ...prev };
      if (isMarked) delete next[questionId];
      else next[questionId] = true;
      return next;
    });
    if (!isMarked) {
      setEliminatedOptions(prev => {
        if (!prev[questionId]) return prev;
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
      setUserAnswers(prev => {
        if (!prev[questionId]) return prev;
        const { [questionId]: _removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const toggleReadingText = (id: string) => {
    setExpandedReadingTexts(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false
    }));
  };

  const handleQuestionsImported = (imported: QuestionBankItem[]) => {
    setCustomQuestions(prev => [...prev, ...imported]);
    setFilterState(prev => ({
      ...prev,
      languageFilter: imported[0]?.language || 'pt',
      selectedSubjectIds: Array.from(new Set([...prev.selectedSubjectIds, imported[0]?.subjectId || 'importadas']))
    }));
  };

  if (viewMode === 'lists') {
    return (
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 sm:p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#e8a87c]"><ListChecks className="h-4 w-4" />Banco de Questões</div>
            <h1 className="mt-1 text-xl sm:text-2xl font-bold font-mono text-[#f3ede6]">Listas salvas</h1>
            <p className="mt-1 text-sm text-[#9ca3af]">Retome respostas, progresso e página exatamente de onde parou.</p>
          </div>
          <button onClick={() => setViewMode('filters')} className="rounded-xl bg-[#e8a87c] px-4 py-2.5 text-xs font-bold font-mono text-[#16181b]">Criar nova lista</button>
        </div>

        {savedLists.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLists.map(list => {
              const answered = Object.keys(list.confirmedAnswers).filter(id => list.questionIds.includes(id)).length;
              const correct = list.questionIds.filter(id => list.confirmedAnswers[id] && list.userAnswers[id] === questionById.get(id)?.correctLetter).length;
              return (
                <article key={list.id} className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 shadow-xl space-y-4">
                  <div>
                    <h2 className="font-bold text-[#f3ede6]">{list.name}</h2>
                    <p className="mt-1 text-xs font-mono text-[#8b949e]">{answered}/{list.questionIds.length} resolvidas · {answered ? Math.round(correct / answered * 100) : 0}% de acerto</p>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#20242b]"><div className="h-full bg-[#e8a87c]" style={{ width: `${list.questionIds.length ? answered / list.questionIds.length * 100 : 0}%` }} /></div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <button onClick={() => handleDeleteList(list.id)} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-mono text-[#8b949e] hover:bg-[#2f1c1f] hover:text-[#f87171]"><Trash2 className="h-3.5 w-3.5" />Excluir</button>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <button
                        onClick={() => setExpandedAnswerKeyId(current => current === list.id ? null : list.id)}
                        aria-expanded={expandedAnswerKeyId === list.id}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#343c46] bg-[#20242b] px-3 py-2 text-xs font-mono text-[#d1d5db] transition-colors hover:border-[#e8a87c]/60 hover:text-[#e8a87c]"
                      >
                        <ClipboardCheck className="h-3.5 w-3.5" />
                        Ver gabarito
                      </button>
                      <button onClick={() => openSavedList(list)} className="inline-flex items-center gap-1.5 rounded-xl bg-[#e8a87c] px-4 py-2 text-xs font-bold font-mono text-[#16181b]"><Play className="h-3.5 w-3.5" />{answered ? 'Continuar' : 'Começar'}</button>
                    </div>
                  </div>
                  {expandedAnswerKeyId === list.id && (
                    <div className="overflow-hidden rounded-xl border border-[#343c46] bg-[#14161a]">
                      <div className="flex items-center justify-between gap-3 border-b border-[#2e353e] px-3 py-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#e8a87c]">
                          <ClipboardCheck className="h-3.5 w-3.5" />
                          <span>Gabarito comparativo</span>
                        </div>
                        <span className="text-[11px] font-mono text-[#8b949e]">Marcada × definitiva</span>
                      </div>
                      <div className="max-h-72 overflow-auto">
                        <table className="w-full min-w-[420px] text-left text-xs font-mono">
                          <thead className="sticky top-0 bg-[#1b1f25] text-[10px] uppercase tracking-wide text-[#8b949e]">
                            <tr>
                              <th className="px-3 py-2 font-medium">Questão</th>
                              <th className="px-3 py-2 text-center font-medium">Marcada</th>
                              <th className="px-3 py-2 text-center font-medium">Definitiva</th>
                              <th className="px-3 py-2 text-right font-medium">Resultado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#262c33]">
                            {list.questionIds.map((questionId, index) => {
                              const question = questionById.get(questionId);
                              if (!question) return null;
                              const marked = list.userAnswers[questionId];
                              const confirmed = Boolean(list.confirmedAnswers[questionId]);
                              const isCorrect = confirmed && marked === question.correctLetter;
                              return (
                                <tr key={questionId} className="text-[#d1d5db]">
                                  <td className="max-w-[220px] truncate px-3 py-2" title={question.statement}>
                                    <span className="text-[#e8a87c]">{index + 1}.</span> {question.subjectTitle}
                                  </td>
                                  <td className="px-3 py-2 text-center font-bold text-[#f3ede6]">{marked || '—'}</td>
                                  <td className="px-3 py-2 text-center font-bold text-[#e8a87c]">{question.correctLetter}</td>
                                  <td className={`px-3 py-2 text-right ${!confirmed ? 'text-[#8b949e]' : isCorrect ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                                    {!confirmed ? 'Pendente' : isCorrect ? 'Correta' : 'Incorreta'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#343c46] p-10 text-center text-[#8b949e]">
            <ListChecks className="mx-auto mb-3 h-7 w-7 text-[#e8a87c]" />
            <p className="font-medium text-[#d1d5db]">Nenhuma lista salva.</p>
            <p className="mt-1 text-xs">Monte uma lista usando os filtros do Banco de Questões.</p>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === 'filters') {
    return (
      <>
      <QuestionBankFilterView
          allQuestions={allBankQuestions}
          filterState={filterState}
          onFilterChange={setFilterState}
          onStartPractice={handleStartPractice}
          onCreateList={handleCreateList}
          onOpenImportModal={() => setIsImportModalOpen(true)}
          userAnswers={userAnswers}
          confirmedAnswers={confirmedAnswers}
          noIdeaQuestions={noIdeaQuestions}
      />
        <ImportPdfModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onQuestionsImported={handleQuestionsImported}
        />
      </>
    );
  }

  // Stage 2: Questions Practice Notebook
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-7 sm:px-6 sm:py-9">
      {saveError && <div role="alert" className="rounded-xl bg-red-950/40 px-4 py-3 text-sm text-red-200">{saveError}</div>}
      
      {/* Top Bar with Return to Filters, Active Filters Summary & Metrics */}
      <section className="rounded-2xl border border-[#343c46]/80 bg-[#181b20]/80 p-5 shadow-xl sm:p-6">
        
        <div className="flex flex-col gap-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              onClick={returnFromPractice}
              className="mb-2 flex items-center gap-1.5 text-xs text-[#e8a87c] transition-colors hover:text-[#f0b58e]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{activeListId ? 'Voltar às listas' : 'Voltar aos filtros'}</span>
            </button>
            <h1 className="text-2xl font-semibold tracking-tight text-[#f3ede6] sm:text-3xl">
              {activeListId
                ? savedLists.find(list => list.id === activeListId)?.name
                : `Pré-visualização (${filteredQuestions.length} questões)`}
            </h1>
          </div>

          <div className="grid w-full max-w-[200px] grid-cols-2 gap-2 self-center sm:w-[200px] sm:self-auto">
            <div className="min-w-0 rounded-xl border border-[#343c46] bg-[#20242b] px-3 py-2.5 text-center">
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[#8b949e]">Resolvidas</span>
              <strong className="mt-1 block font-mono text-sm text-[#f3ede6]">{metrics.confirmed}<span className="text-[#8b949e]">/{metrics.total}</span></strong>
            </div>
            <div className="min-w-0 rounded-xl border border-[#343c46] bg-[#20242b] px-3 py-2.5 text-center">
              <span className="block text-[10px] uppercase tracking-[0.12em] text-[#8b949e]">Precisão</span>
              <strong className="mt-1 block font-mono text-sm text-[#34d399]">{metrics.accuracy}%</strong>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#343c46]/60 pt-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0 text-xs text-[#8b949e]">
            <div className="flex items-start gap-2">
              <SlidersHorizontal className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#e8a87c]" />
              <span className="shrink-0">Assuntos</span>
              <strong className="truncate text-[#f3ede6]">
                {filterState.selectedSubjectIds.length === (filterState.languageFilter === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG).filter(subject => subject.id !== 'todos').length
                  ? (filterState.languageFilter === 'en' ? 'Todos os Assuntos de Inglês' : 'Todos os Assuntos')
                  : filterState.selectedSubjectIds.map(id => (filterState.languageFilter === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG).find(s => s.id === id)?.shortTitle).join(', ')}
              </strong>
            </div>
            {filterState.languageFilter === 'pt'
              && filterState.selectedSubjectIds.length === 1
              && filterState.selectedSubjectIds[0] === 'verbos'
              && <span className="ml-5 mt-1 block text-[11px] text-[#8b949e]">Caderno de Verbos · 92 questões</span>}
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3 xl:w-auto xl:justify-end">
            {/* Questions Per Page (1, 5, 10, 20 ou Todas) */}
            <div className="flex w-full max-w-[280px] flex-col items-stretch gap-2 sm:w-[280px] sm:flex-row sm:items-center">
              <span className="shrink-0 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8b949e] sm:w-[4.25rem] sm:text-right">Por pág.</span>
              <div className="flex min-w-0 flex-1 rounded-xl border border-[#2e353e] bg-[#20242b] p-1">
                {[
                  { size: 1, label: '1' },
                  { size: 5, label: '5' },
                  { size: 10, label: '10' },
                  { size: 20, label: '20' },
                  { size: 0, label: 'Todas' }
                ].map(item => (
                  <button
                    key={item.size}
                    onClick={() => {
                      setPageSize(item.size);
                      setCurrentPage(0);
                    }}
                    className={`min-w-0 flex-1 whitespace-nowrap rounded-lg px-1.5 py-1.5 text-[11px] transition-all sm:py-1 ${
                      pageSize === item.size
                        ? 'bg-[#2a3038] text-[#e8a87c] font-bold'
                        : 'text-[#8b949e] hover:text-[#f3ede6]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </section>

      {/* Render Questions for Current Page */}
      {pageQuestions.length > 0 ? (
        <div className="space-y-8">
          {pageQuestions.map((q, idxOnPage) => {
            const isConfirmed = Boolean(confirmedAnswers[q.id]);
            const isNoIdea = Boolean(noIdeaQuestions[q.id]);
            const isExpanded = expandedReadingTexts[q.id] !== false; // default expanded
            const support = getQuestionSupport(q);

            return (
              <div 
                key={q.id}
                data-question-id={q.id}
                className={`question-sheet space-y-6 pb-10 sm:pb-12 ${idxOnPage > 0 ? 'border-t border-[#262b33] pt-8' : 'pt-2'}`}
              >
                <div className={`question-meta-support-group ${support ? 'has-support' : 'no-support'} space-y-6`}>
                {/* Question Top Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#9ca3af] pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="question-number-badge rounded-full border border-[#e8a87c]/35 bg-[#2a1d17] px-2.5 py-1 font-semibold text-[#e8a87c]">
                      Questão {q.questionNumber}
                    </span>
                    <span className="text-[#d1d5db] font-sans font-medium">{q.subjectTitle}</span>
                    {q.quality?.status === 'warning' && (
                      <details className="relative text-[10px] font-mono text-[#fbbf24]">
                        <summary className="cursor-pointer list-none rounded-md border border-[#fbbf24]/40 px-1.5 py-0.5 hover:bg-[#fbbf24]/10">Revisar</summary>
                        <div className="absolute left-0 top-7 z-10 w-64 rounded-lg border border-[#fbbf24]/40 bg-[#1b1f25] p-2 text-[10px] leading-relaxed text-[#fef3c7] shadow-xl">
                          {q.quality.warnings.map((warning, warningIndex) => <p key={warningIndex}>• {warning}</p>)}
                        </div>
                      </details>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="text-xs text-[#8b949e]">
                      Item <strong className="text-[#f3ede6]">{safeCurrentPage * effectivePageSize + idxOnPage + 1}</strong> de {filteredQuestions.length}
                    </div>
                    <div className="flex items-center gap-1.5" aria-label="Copiar questão">
                      <button
                        onClick={() => handleCopyQuestion(q, 'full')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#343c46] bg-[#20242b] px-2.5 py-1.5 text-[11px] font-mono text-[#d1d5db] transition-colors hover:border-[#e8a87c]/60 hover:text-[#e8a87c]"
                        title="Copiar texto de apoio, enunciado e alternativas"
                      >
                        {copiedPart?.questionId === q.id && copiedPart.kind === 'full' ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedPart?.questionId === q.id && copiedPart.kind === 'full' ? 'Copiado' : 'Copiar questão'}
                      </button>
                      <button
                        onClick={() => handleCopyQuestion(q, 'statement')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#343c46] bg-[#20242b] px-2.5 py-1.5 text-[11px] font-mono text-[#d1d5db] transition-colors hover:border-[#e8a87c]/60 hover:text-[#e8a87c]"
                        title="Copiar somente o enunciado"
                      >
                        {copiedPart?.questionId === q.id && copiedPart.kind === 'statement' ? <Check className="h-3.5 w-3.5 text-[#34d399]" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedPart?.questionId === q.id && copiedPart.kind === 'statement' ? 'Copiado' : 'Copiar enunciado'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Formatted Support Text (Sem scroll interno, cabe por inteiro, fonte limpa e legível sem negrito) */}
                {support && (
                  <div data-reading-text className="overflow-hidden rounded-2xl border border-[#343c46]/80 bg-[#17191d]">
                    <button
                      onClick={() => toggleReadingText(q.id)}
                      className="flex w-full items-center justify-between border-b border-[#343c46]/70 bg-[#1d2025] px-4 py-3 text-xs text-[#e8a87c] transition-colors hover:bg-[#242930]"
                    >
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="font-bold">Texto de Apoio da Questão</span>
                      </div>
                      <div className="flex items-center space-x-1 text-[#8b949e]">
                        <span>{isExpanded ? 'Recolher' : 'Expandir'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div data-reading-body className="select-text p-5 text-[#d1d5db] sm:p-7">
                        <div className="space-y-4">
                          {support.label && <p data-support-label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e8a87c]">{support.label}</p>}
                          {support.title && <h3 data-support-title className="text-lg font-semibold leading-tight text-[#fff7ed] sm:text-xl">{support.title}</h3>}
                          {support.author && <p data-support-author className="text-sm italic leading-relaxed text-[#a8a29e]">{support.author}</p>}
                          {support.paragraphs.length > 0 && (
                            <div data-support-paragraphs className="editorial-prose space-y-3">
                              {support.paragraphs.map((paragraph, paragraphIndex) => (
                                <FormattedExamText key={paragraphIndex} text={paragraph} mode="prose" preserveLineBreaks className="text-[0.98rem] font-normal leading-[1.8] text-[#e4dfd9]" />
                              ))}
                            </div>
                          )}
                          {support.source && <p data-support-source className="border-t border-[#343c46]/70 pt-4 text-xs italic leading-relaxed text-[#a8a29e] break-words [overflow-wrap:anywhere]">{support.source}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>

                <div className={`question-body-group ${support ? 'has-support' : 'no-support'} space-y-6`}>
                {/* Statement / Comando da Questão */}
                {q.statement.trim() && (
                  <div className="statement-block rounded-xl border border-[#343c46]/60 bg-[#1d2025]/65 p-4 text-sm font-normal leading-relaxed text-[#f3ede6] sm:p-5 sm:text-base">
                    <FormattedExamText text={q.statement} mode="statement" className="text-sm sm:text-base text-[#f3ede6] font-normal leading-relaxed" />
                  </div>
                )}

                {/* Alternatives (Rigorous A, B, C, D, E) */}
                <div className="question-option-list space-y-2.5 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = userAnswers[q.id] === opt.letter;
                    const isCorrectOption = opt.letter === q.correctLetter;
                    const isEliminated = eliminatedOptions[q.id]?.includes(opt.letter) ?? false;

                    let btnStyle = 'bg-[#20242b] border-[#2e353e] hover:bg-[#262c35] text-[#d1d5db]';

                    if (isConfirmed) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-[#182a22] border-[#34d399] text-[#f3ede6] shadow-sm';
                      } else if (isSelected && !isCorrectOption) {
                        btnStyle = 'bg-[#2f1c1f] border-[#f87171] text-[#f87171]';
                      } else {
                        btnStyle = 'bg-[#15181d] border-[#2e353e]/40 text-[#6b7280] opacity-60';
                      }
                    } else if (isNoIdea) {
                      btnStyle = isCorrectOption
                        ? 'bg-[#182a22] border-[#34d399] text-[#f3ede6] shadow-sm'
                        : 'bg-[#15181d] border-[#2e353e]/40 text-[#6b7280] opacity-60';
                    } else if (isSelected) {
                      btnStyle = 'bg-[#282e38] border-[#e8a87c] text-[#f3ede6]';
                    }

                    return (
                      <div key={opt.letter} className={`question-option-row flex items-center gap-2 rounded-xl border p-4 text-left text-xs transition-all sm:text-sm ${btnStyle} ${isEliminated ? 'opacity-55' : ''}`}>
                        <button
                          onClick={() => handleSelectOption(q.id, opt.letter)}
                          disabled={isConfirmed || isNoIdea || isEliminated}
                          className="flex min-w-0 flex-1 items-start space-x-3 text-left text-xs transition-all sm:text-sm"
                        >
                          <span className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            (isSelected || (isNoIdea && isCorrectOption))
                              ? 'bg-[#34d399] text-[#16181b] border-[#34d399]'
                              : 'bg-[#14161a] border-[#343c46] text-[#9ca3af]'
                          }`}>
                            {opt.letter}
                          </span>
                          <div className={`flex-1 pt-0.5 leading-snug ${isEliminated ? 'line-through decoration-1' : ''}`}>
                            <FormattedExamText text={opt.text} mode="option" className="text-xs sm:text-sm font-normal text-inherit" />
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleEliminatedOption(q.id, opt.letter)}
                          disabled={isConfirmed || isNoIdea}
                          aria-pressed={isEliminated}
                          aria-label={`${isEliminated ? 'Restaurar' : 'Eliminar'} alternativa ${opt.letter}`}
                          title={`${isEliminated ? 'Restaurar' : 'Eliminar'} alternativa ${opt.letter}`}
                          className={`question-eliminate-button inline-flex w-8 shrink-0 items-center justify-center rounded-lg border text-[#8b949e] transition-all hover:text-[#f3ede6] disabled:cursor-not-allowed disabled:opacity-30 ${isEliminated ? 'is-eliminated' : ''}`}
                        >
                          <Scissors className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Individual Question Confirmation */}
                {!isConfirmed && (
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
                    <button
                      onClick={() => handleConfirmQuestion(q)}
                      disabled={!userAnswers[q.id]}
                      className="question-confirm-button inline-flex min-h-11 items-center justify-center rounded-xl bg-[#e8a87c] px-5 py-2 text-xs font-semibold font-mono text-[#16181b] transition-all shadow-md hover:bg-[#f0b58e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Confirmar Resposta ({q.questionNumber})
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleNoIdeaQuestion(q.id)}
                      aria-pressed={isNoIdea}
                      aria-label="I have no idea"
                      title={isNoIdea ? 'Desmarcar esta questão' : 'Marcar como não sei'}
                      className={`question-no-idea-button inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-3 text-xs font-mono font-semibold transition-all ${isNoIdea
                        ? 'border-[#e8a87c]/70 bg-[#2a1d17] text-[#e8a87c]'
                        : 'border-[#343c46] bg-[#20242b] text-[#9ca3af] hover:bg-[#282e37] hover:text-[#f3ede6]'}`}
                    >
                      I have no idea
                    </button>
                  </div>
                )}
                </div>

              </div>
            );
          })}

          {/* Bottom Pagination & Bulk Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#2e353e] bg-[#181b20] p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={safeCurrentPage === 0}
                className="question-footer-nav-button inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#2e353e] bg-[#20242b] text-[#f3ede6] hover:bg-[#262c35] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-[#9ca3af] px-2">
                Página <strong className="text-[#f3ede6]">{safeCurrentPage + 1}</strong> de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={safeCurrentPage >= totalPages - 1}
                className="question-footer-nav-button inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#2e353e] bg-[#20242b] text-[#f3ede6] hover:bg-[#262c35] disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
              <button
                onClick={handleResetAnswers}
                className="question-footer-action inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#20242b] text-xs font-mono text-[#9ca3af] transition-colors hover:bg-[#262c35] hover:text-[#f87171] sm:w-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Respostas</span>
              </button>

              <button
                onClick={handleConfirmAllOnPage}
                className="question-footer-action question-confirm-button inline-flex w-full items-center justify-center rounded-xl bg-[#e8a87c] text-xs font-bold font-mono text-[#16181b] shadow-md transition-all hover:bg-[#f0b58e] active:scale-95 sm:w-auto"
              >
                Confirmar Todas da Página
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#181b20] border border-[#2e353e] space-y-3">
          <div className="text-sm font-mono text-[#e8a87c]">Nenhuma questão encontrada</div>
          <p className="text-xs text-[#9ca3af] font-sans">
            Não há questões correspondentes aos filtros selecionados.
          </p>
          <button
            onClick={returnFromPractice}
            className="px-4 py-2 rounded-xl bg-[#e8a87c] text-[#16181b] font-bold text-xs font-mono"
          >
            {activeListId ? 'Voltar às listas' : 'Ajustar Filtros'}
          </button>
        </div>
      )}

      {/* Import PDF Modal */}
      <ImportPdfModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onQuestionsImported={handleQuestionsImported}
      />

    </div>
  );
};
