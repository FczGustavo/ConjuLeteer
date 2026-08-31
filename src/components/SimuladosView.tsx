import React, { useState, useMemo } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, BookOpen, ChevronDown, ChevronUp, Award, Layers } from 'lucide-react';
import { SIMULADO_QUESTIONS, type SimuladoQuestion } from '../data/simuladoQuestions';

import { FormattedExamText } from '../utils/textFormatter';

interface SimuladosViewProps {
  onRecordAttempt?: (verbId: string, mood: any, tense: any, isCorrect: boolean) => void;
}

export const SimuladosView: React.FC<SimuladosViewProps> = ({
  onRecordAttempt
}) => {
  const [selectedList, setSelectedList] = useState<'all' | 'pdf_7' | 'pdf_16' | 'pdf_17'>('all');
  const [pageSize, setPageSize] = useState<number>(1); // 1, 5, 10, 20 ou 152
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [confirmedAnswers, setConfirmedAnswers] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'correct' | 'wrong'>('all');
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
    }

    return list;
  }, [selectedList, filterMode, userAnswers, confirmedAnswers]);

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
    if (confirmedAnswers[qId]) return;
    setUserAnswers(prev => ({ ...prev, [qId]: letter }));
  };

  const handleConfirmQuestion = (q: SimuladoQuestion) => {
    const chosen = userAnswers[q.id];
    if (!chosen || confirmedAnswers[q.id]) return;

    const isCorrect = chosen === q.correctLetter;
    setConfirmedAnswers(prev => ({ ...prev, [q.id]: true }));

    if (onRecordAttempt) {
      onRecordAttempt('militar_simulado', 'indicativo' as any, 'presente' as any, isCorrect);
    }

  };

  const handleConfirmAllOnPage = () => {
    const newConfirmed = { ...confirmedAnswers };

    pageQuestions.forEach(q => {
      if (userAnswers[q.id] && !newConfirmed[q.id]) {
        newConfirmed[q.id] = true;
        const isCorrect = userAnswers[q.id] === q.correctLetter;
        if (onRecordAttempt) {
          onRecordAttempt('militar_simulado', 'indicativo' as any, 'presente' as any, isCorrect);
        }
      }
    });

    setConfirmedAnswers(newConfirmed);
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
            <span>Simulados Oficiais (152 Questões Autênticas)</span>
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
        
        {/* PDF List Tabs (Todos, G92, 30T1, 30T2) */}
        <div className="inline-flex p-1 rounded-xl bg-[#181b20] border border-[#2e353e]">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pdf_7', label: 'G92' },
            { id: 'pdf_16', label: '30T1' },
            { id: 'pdf_17', label: '30T2' }
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
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-[#8b949e] flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-[#e8a87c]" />
            <span>Por pág:</span>
          </span>
          <div className="inline-flex p-1 rounded-xl bg-[#181b20] border border-[#2e353e] text-xs font-mono">
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
                className={`px-2.5 py-1 rounded-lg transition-all ${
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
            { id: 'wrong', label: 'Erros' }
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
            const isExpanded = expandedReadingTexts[q.id] !== false; // default expanded

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
                    <span className="text-[#d1d5db] font-sans">{q.listTitle}</span>
                  </div>

                  <div className="text-xs text-[#8b949e]">
                    Item <strong className="text-[#f3ede6]">{currentPage * effectivePageSize + idxOnPage + 1}</strong> de {filteredQuestions.length}
                  </div>
                </div>

                {/* Formatted Support Text (Sem scroll interno, cabe por inteiro, fonte limpa e legível sem negrito) */}
                {q.readingText && q.readingText.trim() !== '' && (
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
                      <div className="p-5 text-sm text-[#d1d5db] leading-relaxed font-sans select-text">
                        <FormattedExamText text={q.readingText} mode="reading" className="text-sm text-[#d1d5db] font-normal leading-relaxed" />
                      </div>
                    )}
                  </div>
                )}

                {/* Statement / Comando da Questão (Sem negrito pesado geral, respeitando destaques específicos e lacunas) */}
                <div className="text-sm sm:text-base leading-relaxed text-[#f3ede6] font-normal p-3.5 bg-[#1b1f25]/60 rounded-xl border border-[#262b33]/60">
                      <FormattedExamText text={q.statement} mode="statement" className="text-sm sm:text-base text-[#f3ede6] font-normal leading-relaxed" />
                </div>

                {/* Alternatives with Explanations directly BELOW each option */}
                <div className="space-y-3 pt-1">
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

                {/* Individual Question Confirmation (se ainda não confirmada) */}
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
                disabled={currentPage === 0}
                className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-[#20242b] hover:bg-[#262c35] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                className="flex items-center space-x-1 px-3.5 py-2 rounded-xl bg-[#20242b] hover:bg-[#262c35] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <span>Próxima Página</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetList}
                className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#20242b] hover:bg-[#262c35] text-[#9ca3af] hover:text-[#f3ede6] text-xs font-mono transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Respostas</span>
              </button>

              {pageSize > 1 && (
                <button
                  onClick={handleConfirmAllOnPage}
                  className="px-5 py-2 rounded-xl bg-[#e8a87c] hover:bg-[#f0b58e] text-[#16181b] font-semibold text-xs font-mono transition-all shadow-md active:scale-95"
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
