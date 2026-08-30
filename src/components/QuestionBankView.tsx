import React, { useState, useMemo, useEffect } from 'react';
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
  Check
} from 'lucide-react';
import { QUESTION_BANK, type QuestionBankItem, SUBJECTS_CONFIG } from '../data/questionBank';
import { getCustomQuestions } from '../services/pdfImportService';
import { ImportPdfModal } from './ImportPdfModal';
import { QuestionBankFilterView, type FilterState } from './QuestionBankFilterView';
import { FormattedExamText } from '../utils/textFormatter';
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

interface ReadingMetadata {
  title: string;
  source: string;
  body: string;
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
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Separates bibliographic chrome from the excerpt without discarding text. */
function getReadingMetadata(text: string): ReadingMetadata {
  const lines = text.split(/\n+/).map(line => line.trim()).filter(Boolean);
  if (!lines.length) return { title: '', source: '', body: '' };

  const looksLikeBibliographicSource = (line: string) =>
    /^\([A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ][^)]{2,}\)$/.test(line)
    && /(?:\b(?:19|20)\d{2}\b|\bp\.\s*\d+|\b(?:LP|Editora|Folha)\b)/.test(line);

  const isSourceLine = (line: string) =>
    /^(?:\(?\s*(?:Fonte|Disponível|Adaptado|Fragmento retirado)|https?:\/\/|<https?:\/\/|www\.)/i.test(line)
    || /\bAcesso em\b/i.test(line)
    || /\bTexto adaptado\b/i.test(line)
    || looksLikeBibliographicSource(line);
  // Sources can be extracted before, between, or after the excerpt. A long
  // citation may also wrap over two lines, so join that run before classifying
  // it; remove only source lines so a note or paragraph after the citation is
  // not silently discarded.
  const sourceIndexes = new Set<number>();
  for (let index = 0; index < lines.length; index += 1) {
    if (isSourceLine(lines[index])) {
      sourceIndexes.add(index);
      continue;
    }
    if (/^\(\s*[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ]/.test(lines[index])) {
      let end = index;
      while (end + 1 < lines.length && !lines[end].includes(')')) end += 1;
      const candidate = lines.slice(index, end + 1).join(' ');
      if (looksLikeBibliographicSource(candidate)
        || /\b(?:domínio público|Revista|Jornal|Conto|Obra|Seminário dos Ratos)\b/i.test(candidate)) {
        for (let cursor = index; cursor <= end; cursor += 1) sourceIndexes.add(cursor);
        index = end;
      }
    }
  }
  const sourceLines = lines.filter((_, index) => sourceIndexes.has(index));
  const contentLines = lines.filter((_, index) => !sourceIndexes.has(index));
  let title = '';
  let titleLines = 0;
  const first = contentLines[0] || '';
  const second = contentLines[1] || '';
  const isCommand = /^(?:Leia|Analise|Considere|Observe|Assinale|Com base|Após a leitura)/i.test(first);
  // A support passage can begin with a perfectly ordinary sentence (for
  // example, "O homem deixou...").  Treat only title-like lines as headings;
  // inline emphasis, commas and other sentence punctuation are strong signals
  // that the first line belongs to the body and must remain formatted.
  const looksLikeHeading = !isCommand && first.length <= 120 && !/[.!?]$/.test(first)
    && !/[,:;]/.test(first)
    && !/[*<>]/.test(first)
    && (/^[A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÎÔÛÃÕÇ0-9\s–—:.'’'()/-]+$/.test(first)
      || /^Texto\s+(?:de apoio\s+)?(?:I{1,3}|[0-9]+)\b/i.test(first)
      || /^(?:Do Diário|A Última|Um Cinturão|O homem|A sociedade|Mulher na Marinha)\b/i.test(first));

  if (looksLikeHeading && contentLines.length > 0) {
    title = first;
    titleLines = 1;
    const secondLooksLikeShortHeading = second.length <= 120
      && !/[.!?]$/.test(second)
      && (second.match(/[.!?]/g) || []).length <= 1;
    if (/^Texto\s+(?:de apoio\s+)?(?:I{1,3}|[0-9]+)\b/i.test(first)
      && second
      && secondLooksLikeShortHeading) {
      title = `${first} — ${second}`;
      titleLines = 2;
    }
  }

  const source = sourceLines.join(' ')
    // The card already supplies the ``Fonte`` label; avoid repeating it when
    // the PDF citation itself also begins with ``Fonte:``.
    .replace(/^\(\s*Fonte:\s*/i, '(')
    .replace(/^Fonte:\s*/i, '');
  const body = contentLines.slice(titleLines).join('\n');
  return { title, source, body: body || text.trim() };
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onRecordAttempt,
  initialMode = 'filters'
}) => {
  const [viewMode, setViewMode] = useState<'filters' | 'practice' | 'lists'>(initialMode);

  // Filter State
  const [filterState, setFilterState] = useState<FilterState>({
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

  // Preview answers are intentionally ephemeral; only an active saved list persists.
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!activeListId) return;
    saveQuestionListProgress(activeListId, {
      userAnswers,
      confirmedAnswers,
      currentPage,
      pageSize
    });
  }, [activeListId, userAnswers, confirmedAnswers, currentPage, pageSize]);

  // Combined questions (Base + Custom)
  const allBankQuestions = useMemo(() => {
    return [...QUESTION_BANK, ...customQuestions];
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
      // 1. Subject filter
      if (filterState.selectedSubjectIds.length > 0) {
        if (!filterState.selectedSubjectIds.includes(q.subjectId)) {
          return false;
        }
      } else {
        return false;
      }

      if (q.subjectId === 'verbos' && q.listId !== 'pdf_7') {
        return false;
      }

      // 2. Status filter
      if (filterState.statusFilter === 'pending') {
        if (confirmedAnswers[q.id]) return false;
      } else if (filterState.statusFilter === 'correct') {
        if (!confirmedAnswers[q.id] || userAnswers[q.id] !== q.correctLetter) return false;
      } else if (filterState.statusFilter === 'wrong') {
        if (!confirmedAnswers[q.id] || userAnswers[q.id] === q.correctLetter) return false;
      }

      return true;
    });

    if (filterState.limitQuantity && filterState.limitQuantity > 0) {
      list = list.slice(0, filterState.limitQuantity);
    }

    return list;
  }, [allBankQuestions, filterState, confirmedAnswers, userAnswers, activeListId, savedLists, questionById]);

  // Start practice handler
  const handleStartPractice = (limit?: number) => {
    setActiveListId(null);
    setUserAnswers({});
    setConfirmedAnswers({});
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
      if (!filterState.selectedSubjectIds.includes(question.subjectId)) return false;
      if (question.subjectId === 'verbos' && question.listId !== 'pdf_7') return false;
      if (filterState.statusFilter === 'pending') return !confirmedAnswers[question.id];
      if (filterState.statusFilter === 'correct') return confirmedAnswers[question.id] && userAnswers[question.id] === question.correctLetter;
      if (filterState.statusFilter === 'wrong') return confirmedAnswers[question.id] && userAnswers[question.id] !== question.correctLetter;
      return true;
    });
    return limit ? matching.slice(0, limit) : matching;
  };

  const handleCreateList = (limit?: number) => {
    const questions = matchingFilteredQuestions(limit);
    if (!questions.length) return;
    const subjectNames = filterState.selectedSubjectIds
      .map(id => SUBJECTS_CONFIG.find(subject => subject.id === id)?.shortTitle)
      .filter(Boolean);
    const label = subjectNames.length === SUBJECTS_CONFIG.filter(subject => subject.id !== 'todos').length
      ? 'Todos os assuntos'
      : subjectNames.slice(0, 2).join(' + ') + (subjectNames.length > 2 ? ` +${subjectNames.length - 2}` : '');
    const list = createQuestionList(
      `${label} · ${questions.length} questões`,
      questions.map(question => question.id),
      filterState.selectedSubjectIds,
      filterState.statusFilter
    );
    setSavedLists(loadQuestionLists());
    openSavedList(list);
  };

  const openSavedList = (list: SavedQuestionList) => {
    setActiveListId(list.id);
    setUserAnswers(list.userAnswers);
    setConfirmedAnswers(list.confirmedAnswers);
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
    if (includeSupport && question.readingText?.trim()) {
      sections.push(`TEXTO DE APOIO\n${toClipboardText(question.readingText)}`);
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
    window.setTimeout(() => {
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
    if (pageSize === 0) return filteredQuestions;
    const start = safeCurrentPage * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, safeCurrentPage, pageSize]);

  // User Actions
  const handleSelectOption = (questionId: string, letter: string) => {
    if (confirmedAnswers[questionId]) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: letter
    }));
  };

  const handleConfirmQuestion = (q: QuestionBankItem) => {
    const chosen = userAnswers[q.id];
    if (!chosen) return;

    setConfirmedAnswers(prev => ({ ...prev, [q.id]: true }));
    const isCorrect = chosen === q.correctLetter;

    onRecordAttempt?.(q.id, 'banco', q.subjectId, isCorrect);
  };

  const handleConfirmAllOnPage = () => {
    const newConfirmed = { ...confirmedAnswers };
    pageQuestions.forEach(q => {
      const chosen = userAnswers[q.id];
      if (chosen && !confirmedAnswers[q.id]) {
        newConfirmed[q.id] = true;
        const isCorrect = chosen === q.correctLetter;
        onRecordAttempt?.(q.id, 'banco', q.subjectId, isCorrect);
      }
    });

    setConfirmedAnswers(newConfirmed);
  };

  const handleResetAnswers = () => {
    setUserAnswers({});
    setConfirmedAnswers({});
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
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Top Bar with Return to Filters, Active Filters Summary & Metrics */}
      <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#262b33]">
          <div>
            <button
              onClick={returnFromPractice}
              className="flex items-center space-x-1.5 text-xs font-mono text-[#e8a87c] hover:text-[#f0b58e] transition-colors mb-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{activeListId ? 'Voltar às listas' : 'Voltar aos filtros'}</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-[#f3ede6] font-mono">
              {activeListId
                ? savedLists.find(list => list.id === activeListId)?.name
                : `Pré-visualização (${filteredQuestions.length} questões)`}
            </h1>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-[#20242b] border border-[#2e353e] text-xs font-mono">
            <div>
              <span className="text-[#8b949e]">Resolvidas: </span>
              <strong className="text-[#f3ede6]">{metrics.confirmed}</strong>/{metrics.total}
            </div>
            <div className="w-px h-4 bg-[#343c46]" />
            <div>
              <span className="text-[#8b949e]">Precisão: </span>
              <strong className="text-[#34d399]">{metrics.accuracy}%</strong>
            </div>
          </div>
        </div>

        {/* Filters Summary & Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center space-x-2 text-[#8b949e]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#e8a87c]" />
            <span>Assuntos: </span>
            <strong className="text-[#f3ede6]">
              {filterState.selectedSubjectIds.length === 8 
                ? 'Todos os Assuntos' 
                : filterState.selectedSubjectIds.map(id => SUBJECTS_CONFIG.find(s => s.id === id)?.shortTitle).join(', ')}
            </strong>
            {filterState.selectedSubjectIds.includes('verbos') && (
              <span className="text-[#8b949e]"> · Verbos: caderno de 92 questões</span>
            )}
          </div>

          <div className="flex w-full lg:w-auto flex-col sm:flex-row sm:items-center gap-3">
            {/* Questions Per Page (1, 5, 10, 20 ou Todas) */}
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] text-[#8b949e]">Por pág:</span>
              <div className="inline-flex p-1 rounded-xl bg-[#20242b] border border-[#2e353e]">
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
                    className={`px-2 py-0.5 rounded-lg transition-all text-xs ${
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

            {/* Status Filter Selector */}
            <div className="inline-flex p-1 rounded-xl bg-[#20242b] border border-[#2e353e]">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'pending', label: 'Pendentes' },
                { id: 'correct', label: 'Acertos' },
                { id: 'wrong', label: 'Erros' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilterState(prev => ({ ...prev, statusFilter: f.id as any }));
                    setCurrentPage(0);
                  }}
                  className={`px-2.5 py-0.5 rounded-lg transition-all text-xs ${
                    filterState.statusFilter === f.id
                      ? 'bg-[#2a3038] text-[#e8a87c] font-bold'
                      : 'text-[#8b949e] hover:text-[#f3ede6]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Render Questions for Current Page */}
      {pageQuestions.length > 0 ? (
        <div className="space-y-8">
          {pageQuestions.map((q, idxOnPage) => {
            const isConfirmed = Boolean(confirmedAnswers[q.id]);
            const isExpanded = expandedReadingTexts[q.id] !== false; // default expanded
            const readingMeta = q.readingText ? getReadingMetadata(q.readingText) : null;

            return (
              <div 
                key={q.id}
                className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-6 sm:p-7 shadow-xl space-y-6"
              >
                {/* Question Top Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#9ca3af] pb-3 border-b border-[#262b33]">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#242930] text-[#e8a87c] font-bold border border-[#343c46]">
                      Questão {q.questionNumber}
                    </span>
                    <span className="text-[#d1d5db] font-sans font-medium">{q.subjectTitle}</span>
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
                {q.readingText && q.readingText.trim() !== '' && (
                  <div className="rounded-xl bg-[#14161a] border border-[#262c33] overflow-hidden">
                    <button
                      onClick={() => toggleReadingText(q.id)}
                      className="w-full px-4 py-2.5 bg-[#1b1f25] border-b border-[#262c33] flex items-center justify-between text-xs font-mono text-[#e8a87c] hover:bg-[#20252d] transition-colors"
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
                      <div className="p-4 sm:p-5 text-sm text-[#d1d5db] leading-relaxed font-sans select-text">
                        {readingMeta?.title && (
                          <div className="mb-2 text-sm leading-relaxed text-[#f3ede6]">
                            <span className="mr-2 font-mono text-xs font-bold uppercase tracking-wide text-[#e8a87c]">Título</span>
                            <span>{readingMeta.title}</span>
                          </div>
                        )}
                        <FormattedExamText text={readingMeta?.body || q.readingText} mode="reading" className="text-sm text-[#d1d5db] font-normal leading-relaxed" />
                        {readingMeta?.source && (
                          <div className="mt-5 border-t border-[#303742] pt-3 text-xs leading-relaxed">
                            <span className="mr-2 font-mono font-bold uppercase tracking-wide text-[#e8a87c]">Fonte</span>
                            <span className="break-words text-[#9ca3af]">
                              {readingMeta.source.replace(/\*\*/g, '')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Statement / Comando da Questão */}
                <div className="text-sm sm:text-base leading-relaxed text-[#f3ede6] font-normal p-3.5 bg-[#1b1f25]/60 rounded-xl border border-[#262b33]/60">
                  <FormattedExamText text={q.statement} mode="statement" className="text-sm sm:text-base text-[#f3ede6] font-normal leading-relaxed" />
                </div>

                {/* Alternatives (Rigorous A, B, C, D, E) */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = userAnswers[q.id] === opt.letter;
                    const isCorrectOption = opt.letter === q.correctLetter;

                    let btnStyle = 'bg-[#20242b] border-[#2e353e] hover:bg-[#262c35] text-[#d1d5db]';

                    if (isConfirmed) {
                      if (isCorrectOption) {
                        btnStyle = 'bg-[#182a22] border-[#34d399] text-[#f3ede6] shadow-sm';
                      } else if (isSelected && !isCorrectOption) {
                        btnStyle = 'bg-[#2f1c1f] border-[#f87171] text-[#f87171]';
                      } else {
                        btnStyle = 'bg-[#15181d] border-[#2e353e]/40 text-[#6b7280] opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-[#282e38] border-[#e8a87c] text-[#f3ede6]';
                    }

                    return (
                      <button
                        key={opt.letter}
                        onClick={() => handleSelectOption(q.id, opt.letter)}
                        disabled={isConfirmed}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start space-x-3 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-[#e8a87c] text-[#16181b] border-[#e8a87c]' : 'bg-[#14161a] border-[#343c46] text-[#9ca3af]'
                        }`}>
                          {opt.letter}
                        </span>
                        <div className="flex-1 pt-0.5 leading-snug">
                          <FormattedExamText text={opt.text} mode="option" className="text-xs sm:text-sm font-normal text-inherit" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Individual Question Confirmation */}
                {!isConfirmed && (
                  <div className="flex justify-end pt-3 border-t border-[#262b33]">
                    <button
                      onClick={() => handleConfirmQuestion(q)}
                      disabled={!userAnswers[q.id]}
                      className="px-5 py-2 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] disabled:opacity-40 disabled:cursor-not-allowed text-[#16181b] font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
                    >
                      Confirmar Resposta ({q.questionNumber})
                    </button>
                  </div>
                )}

              </div>
            );
          })}

          {/* Bottom Pagination & Bulk Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#181b20] border border-[#2e353e] shadow-lg">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={safeCurrentPage === 0}
                className="p-2 rounded-xl bg-[#20242b] border border-[#2e353e] disabled:opacity-30 disabled:cursor-not-allowed text-[#f3ede6] hover:bg-[#262c35]"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-[#9ca3af] px-2">
                Página <strong className="text-[#f3ede6]">{safeCurrentPage + 1}</strong> de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={safeCurrentPage >= totalPages - 1}
                className="p-2 rounded-xl bg-[#20242b] border border-[#2e353e] disabled:opacity-30 disabled:cursor-not-allowed text-[#f3ede6] hover:bg-[#262c35]"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetAnswers}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#20242b] hover:bg-[#262c35] text-[#9ca3af] hover:text-[#f87171] text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpar Respostas</span>
              </button>

              <button
                onClick={handleConfirmAllOnPage}
                className="px-5 py-2 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-bold text-xs font-mono transition-all shadow-md active:scale-95"
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
