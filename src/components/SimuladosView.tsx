import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, BookOpen, ChevronDown, ChevronUp, Award, Layers, Scissors } from 'lucide-react';
import { SIMULADO_QUESTIONS, type SimuladoQuestion } from '../data/simuladoQuestions';

import { FormattedExamText } from '../utils/textFormatter';
import { getQuestionSupport } from '../utils/questionSupport';

interface SimuladosViewProps {
  onRecordAttempt?: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

export const SimuladosView: React.FC<SimuladosViewProps> = ({
  onRecordAttempt
}) => {
  const [selectedList, setSelectedList] = useState<'all' | 'pdf_7'>('all');
  const [pageSize, setPageSize] = useState<number>(1); // 1, 5, 10, 20 ou 92
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
  const [noIdeaQuestions, setNoIdeaQuestions] = useState<Record<string, boolean>>({});
  const [eliminatedOptions, setEliminatedOptions] = useState<Record<string, string[]>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'correct' | 'wrong' | 'noIdea'>('all');
  const [expandedReadingTexts, setExpandedReadingTexts] = useState<Record<string, boolean>>({});

  const filteredQuestions = useMemo(() => {
    let list = SIMULADO_QUESTIONS;
    if (selectedList !== 'all') {
      list = list.filter(q => q.listId === selectedList);
    }

    if (filterMode === 'pending') {
      list = list.filter(q => !confirmedAnswers[q.id]);
    } else if (filterMode === 'correct') {
      list = list.filter(q => confirmedAnswers[q.id] && userAnswers[q.id] === q.correctLetter);
    } else if (filterMode === 'wrong') {
      list = list.filter(q => confirmedAnswers[q.id] && userAnswers[q.id] !== q.correctLetter);
    } else if (filterMode === 'noIdea') {
      list = list.filter(q => noIdeaQuestions[q.id]);
    }

    return list;
  }, [selectedList, filterMode, userAnswers, confirmedAnswers, noIdeaQuestions]);

  // Pagination calculation
  const effectivePageSize = pageSize === 0 ? filteredQuestions.length : pageSize;
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / (effectivePageSize || 1)));
  const pageQuestions = filteredQuestions.slice(
    currentPage * effectivePageSize,
    (currentPage + 1) * effectivePageSize
  );

  // Overall Stats
  const listQuestions = selectedList === 'all' ? SIMULADO_QUESTIONS : SIMULADO_QUESTIONS.filter(q => q.listId === selectedList);
  const listTotal = listQuestions.length;
  const answeredCount = listQuestions.filter(q => confirmedAnswers[q.id]).length;
  const correctCount = listQuestions.filter(q => confirmedAnswers[q.id] && userAnswers[q.id] === q.correctLetter).length;

  const handleSelectOption = (qId: string, letter: string) => {
    if (confirmedAnswers[qId] || noIdeaQuestions[qId] || eliminatedOptions[qId]?.includes(letter)) return;
    setUserAnswers(prev => ({ ...prev, [qId]: letter }));
  };

  const toggleEliminatedOption = (qId: string, letter: string) => {
    if (confirmedAnswers[qId]) return;
    setEliminatedOptions(prev => {
      const current = prev[qId] ?? [];
      const isEliminated = current.includes(letter);
      const next = isEliminated ? current.filter(item => item !== letter) : [...current, letter];
      const updated = { ...prev };
      if (next.length) updated[qId] = next;
      else delete updated[qId];
      return updated;
    });
    if (!eliminatedOptions[qId]?.includes(letter)) {
      setUserAnswers(prev => {
        if (prev[qId] !== letter) return prev;
        const updated = { ...prev };
        delete updated[qId];
        return updated;
      });
    }
  };

  const handleConfirmQuestion = (q: SimuladoQuestion) => {
    const chosen = userAnswers[q.id];
    if (!chosen || confirmedAnswers[q.id] || noIdeaQuestions[q.id]) return;

    const isCorrect = chosen === q.correctLetter;
    setConfirmedAnswers(prev => ({ ...prev, [q.id]: true }));
    setNoIdeaQuestions(prev => {
      if (!prev[q.id]) return prev;
      const { [q.id]: _removed, ...rest } = prev;
      return rest;
    });

    if (onRecordAttempt) {
      onRecordAttempt('militar_simulado', 'indicativo' as any, 'presente' as any, isCorrect);
    }

  };

  const handleConfirmAllOnPage = () => {
    const newConfirmed = { ...confirmedAnswers };
    const newNoIdea = { ...noIdeaQuestions };

    pageQuestions.forEach(q => {
      if (userAnswers[q.id] && !newConfirmed[q.id] && !newNoIdea[q.id]) {
        newConfirmed[q.id] = true;
        delete newNoIdea[q.id];
        const isCorrect = userAnswers[q.id] === q.correctLetter;
        if (onRecordAttempt) {
          onRecordAttempt('militar_simulado', 'indicativo' as any, 'presente' as any, isCorrect);
        }
      }
    });

    setConfirmedAnswers(newConfirmed);
    setNoIdeaQuestions(newNoIdea);
  };

  const toggleNoIdeaQuestion = (qId: string) => {
    if (confirmedAnswers[qId]) return;
    const isMarked = Boolean(noIdeaQuestions[qId]);
    setNoIdeaQuestions(prev => {
      const next = { ...prev };
      if (isMarked) delete next[qId];
      else next[qId] = true;
      return next;
    });
    if (!isMarked) {
      setEliminatedOptions(prev => {
        if (!prev[qId]) return prev;
        const next = { ...prev };
        delete next[qId];
        return next;
      });
      setUserAnswers(prev => {
        if (!prev[qId]) return prev;
        const next = { ...prev };
        delete next[qId];
        return next;
      });
    }
  };

  const toggleReadingText = (qId: string) => {
    setExpandedReadingTexts(prev => ({
      ...prev,
      [qId]: prev[qId] === undefined ? false : !prev[qId] // default is open
    }));
  };

  const handleResetList = () => {
    if (confirm('Deseja reiniciar as respostas deste simulado?')) {
      const newAnswers = { ...userAnswers };
      const newConfirmed = { ...confirmedAnswers };
      listQuestions.forEach(q => {
        delete newAnswers[q.id];
        delete newConfirmed[q.id];
      });
      setUserAnswers(newAnswers);
      setConfirmedAnswers(newConfirmed);
      setNoIdeaQuestions(prev => {
        const updated = { ...prev };
        listQuestions.forEach(q => delete updated[q.id]);
        return updated;
      });
      setEliminatedOptions(prev => {
        const updated = { ...prev };
        listQuestions.forEach(q => delete updated[q.id]);
        return updated;
      });
      setCurrentPage(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2e353e]/60">
        <div>
          <div className="text-[11px] font-mono text-[#e8a87c] uppercase tracking-wider flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5" />
            <span>Simulados Oficiais (92 Questões Autênticas)</span>
          </div>
          <h2 className="text-xl font-bold text-[#f3ede6] mt-0.5">Bateria Completa de Provas</h2>
        </div>

        {/* Stats badge */}
        <div className="flex items-center space-x-3 text-xs font-mono text-[#9ca3af]">
          <div className="px-3 py-1.5 rounded-xl bg-[#1b1e23] border border-[#2e353e]">
            Respondidas: <strong className="text-[#f3ede6]">{answeredCount}</strong> / {listTotal}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1b1e23] border border-[#2e353e]">
            Acertos: <strong className="text-[#34d399]">{correctCount}</strong>
          </div>
        </div>
      </div>

      {/* Controls Bar: List Switcher + Questions per Page Selector + Status Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        
        {/* PDF List Tabs (Todos, G92) */}
        <div className="inline-flex p-1 rounded-xl bg-[#181b20] border border-[#2e353e]">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pdf_7', label: 'G92' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedList(tab.id as any);
                setCurrentPage(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all min-w-[56px] text-center ${
                selectedList === tab.id
                  ? 'bg-[#262c35] text-[#f3ede6] font-bold shadow-sm'
                  : 'text-[#9ca3af] hover:text-[#f3ede6]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Questions Per Page (1, 5, 10, 20 ou Todas) */}
        <div className="flex w-full max-w-[280px] flex-col gap-2 sm:w-[280px] sm:flex-row sm:items-center">
          <span className="flex shrink-0 items-center space-x-1 text-left text-[11px] font-mono text-[#8b949e] sm:w-[4.25rem] sm:justify-end">
            <Layers className="w-3.5 h-3.5 text-[#e8a87c]" />
            <span>Por pág:</span>
          </span>
          <div className="inline-flex min-w-0 w-full flex-1 rounded-xl border border-[#2e353e] bg-[#181b20] p-1 text-xs font-mono">
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

        {/* Status Filter Sub-Mode (Todas, Pendentes, Acertos, Erros) */}
        <div className="inline-flex p-1 rounded-xl bg-[#181b20] border border-[#2e353e] text-xs font-mono">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'correct', label: 'Acertos' },
            { id: 'wrong', label: 'Erros' },
            { id: 'noIdea', label: 'Marcadas como não sei' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setFilterMode(f.id as any);
                setCurrentPage(0);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all min-w-[56px] text-center ${
                filterMode === f.id
                  ? 'bg-[#2a3038] text-[#e8a87c] font-bold'
                  : 'text-[#8b949e] hover:text-[#f3ede6]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render All Questions for Current Page */}
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
                className={`question-sheet space-y-6 pb-10 sm:pb-12 ${idxOnPage > 0 ? 'border-t border-[#262b33] pt-8' : 'pt-2'}`}
              >
                <div className={`question-meta-support-group ${support ? 'has-support' : 'no-support'} space-y-6`}>
                {/* Question Top Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#9ca3af] pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="question-number-badge px-2.5 py-1 rounded-lg bg-[#242930] text-[#e8a87c] font-bold border border-[#343c46]">
                      Questão {q.questionNumber}
                    </span>
                    <span className="text-[#d1d5db] font-sans">{q.listTitle}</span>
                  </div>

                  <div className="text-xs text-[#8b949e]">
                    Item <strong className="text-[#f3ede6]">{currentPage * effectivePageSize + idxOnPage + 1}</strong> de {filteredQuestions.length}
                  </div>
                </div>

                {/* Formatted Support Text (Sem scroll interno, cabe por inteiro, fonte limpa e legível sem negrito) */}
                {support && (
                  <div data-reading-text className="rounded-xl bg-[#14161a] border border-[#262c33] overflow-hidden">
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
                      <div data-reading-body className="p-5 text-sm text-[#d1d5db] leading-relaxed font-sans select-text">
                        <div className="space-y-3">
                          {support.label && <p data-support-label className="text-[11px] uppercase tracking-[0.16em] text-[#e8a87c] font-semibold leading-tight">{support.label}</p>}
                          {support.title && <h3 data-support-title className="text-base sm:text-lg text-[#fff7ed] font-semibold leading-tight">{support.title}</h3>}
                          {support.author && <p data-support-author className="text-xs text-[#9ca3af] italic leading-relaxed">{support.author}</p>}
                          {support.paragraphs.length > 0 && (
                            <div data-support-paragraphs className="space-y-3">
                              {support.paragraphs.map((paragraph, paragraphIndex) => (
                                <FormattedExamText key={paragraphIndex} text={paragraph} mode="prose" preserveLineBreaks className="text-sm text-[#d1d5db] font-normal leading-[1.75]" />
                              ))}
                            </div>
                          )}
                          {support.source && <p data-support-source className="border-t border-[#343c46] pt-3 text-xs text-[#9ca3af] italic leading-relaxed break-words [overflow-wrap:anywhere]">{support.source}</p>}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                </div>

                <div className={`question-body-group ${support ? 'has-support' : 'no-support'} space-y-6`}>
                {/* Statement / Comando da Questão (Sem negrito pesado geral, respeitando destaques específicos e lacunas) */}
                <div className="statement-block text-sm sm:text-base leading-relaxed text-[#f3ede6] font-normal p-3.5 bg-[#1b1f25]/60 rounded-xl border border-[#262b33]/60">
                      <FormattedExamText text={q.statement} mode="statement" className="text-sm sm:text-base text-[#f3ede6] font-normal leading-relaxed" />
                </div>

                {/* Alternatives with Explanations directly BELOW each option */}
                <div className="question-option-list space-y-3 pt-1">
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
                      <div key={opt.letter} className={`question-option-row flex items-center gap-2 rounded-xl border p-3.5 text-left text-xs transition-all sm:text-sm ${btnStyle} ${isEliminated ? 'opacity-55' : ''}`}>
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
                {/* Individual Question Confirmation (se ainda não confirmada) */}
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
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="question-footer-action inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#20242b] text-xs font-mono text-[#9ca3af] transition-colors hover:bg-[#262c35] hover:text-[#f3ede6] disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Página Anterior</span>
              </button>

              <span className="text-xs font-mono text-[#8b949e] px-2">
                Página <strong className="text-[#f3ede6]">{currentPage + 1}</strong> de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage + 1 >= totalPages}
                className="question-footer-action inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-[#20242b] text-xs font-mono text-[#9ca3af] transition-colors hover:bg-[#262c35] hover:text-[#f3ede6] disabled:cursor-not-allowed disabled:opacity-30 sm:flex-none"
              >
                <span>Próxima Página</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex w-full flex-wrap items-center justify-end gap-3 sm:w-auto">
              <button
                onClick={handleResetList}
                className="question-footer-action inline-flex w-full items-center justify-center gap-1 rounded-xl bg-[#20242b] text-xs font-mono text-[#9ca3af] transition-colors hover:bg-[#262c35] hover:text-[#f3ede6] sm:w-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Respostas</span>
              </button>

              {pageSize > 1 && (
                <button
                  onClick={handleConfirmAllOnPage}
                  className="question-footer-action question-confirm-button inline-flex w-full items-center justify-center rounded-xl bg-[#e8a87c] text-xs font-semibold font-mono text-[#16181b] shadow-md transition-all hover:bg-[#f0b58e] active:scale-95 sm:w-auto"
                >
                  Confirmar Todas da Página
                </button>
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-8 text-center text-[#9ca3af] text-xs font-mono">
          Nenhuma questão encontrada para este filtro.
        </div>
      )}

    </div>
  );
};
