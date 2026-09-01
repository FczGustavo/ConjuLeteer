import React, { useState, useMemo } from 'react';
import { 
  CheckSquare, 
  Square, 
  ChevronRight, 
  ChevronDown, 
  RotateCcw, 
  PlusCircle, 
  BookOpen, 
  Filter, 
  CheckCircle2, 
  Eye,
  ListPlus
} from 'lucide-react';
import { SUBJECTS_CONFIG, type SubjectId, type QuestionBankItem } from '../data/questionBank';
import { ENGLISH_SUBJECTS_CONFIG } from '../data/englishSubjects';

export interface FilterState {
  languageFilter: 'pt' | 'en';
  selectedSubjectIds: SubjectId[];
  /** Kept for compatibility with persisted filters; Verbos always uses PDF 7. */
  selectedListIds: string[];
  statusFilter: 'all' | 'pending' | 'correct' | 'wrong' | 'noIdea';
  limitQuantity?: number;
}

interface QuestionBankFilterViewProps {
  allQuestions: QuestionBankItem[];
  filterState: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onStartPractice: (quantity?: number) => void;
  onCreateList: (quantity?: number) => void;
  onOpenImportModal: () => void;
  userAnswers: Record<string, string>;
  confirmedAnswers: Record<string, boolean>;
  noIdeaQuestions: Record<string, boolean>;
}

export const QuestionBankFilterView: React.FC<QuestionBankFilterViewProps> = ({
  allQuestions,
  filterState,
  onFilterChange,
  onStartPractice,
  onCreateList,
  onOpenImportModal,
  userAnswers,
  confirmedAnswers,
  noIdeaQuestions
}) => {
  const [isTreeExpanded, setIsTreeExpanded] = useState<boolean>(true);
  const [simuladoQty, setSimuladoQty] = useState<number>(10);
  const subjectConfig = filterState.languageFilter === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG;
  const visibleQuestions = useMemo(
    () => allQuestions.filter(question => {
      if (question.quality?.status === 'quarantined' || question.quality?.status === 'rejected') return false;
      const inLanguage = filterState.languageFilter === 'en' ? question.language === 'en' : question.language !== 'en';
      if (!inLanguage) return false;
      return true;
    }),
    [allQuestions, filterState.languageFilter]
  );
  const subjectCounts = useMemo(() => {
    const counts = new Map<SubjectId, number>();
    visibleQuestions.forEach(question => counts.set(question.subjectId, (counts.get(question.subjectId) ?? 0) + 1));
    return counts;
  }, [visibleQuestions]);

  const languageCounts = useMemo(() => {
    const counts = { pt: 0, en: 0 };
    allQuestions.forEach(question => {
      if (question.quality?.status === 'quarantined' || question.quality?.status === 'rejected') return;
      if (question.language === 'en') counts.en++;
      else counts.pt++;
    });
    return counts;
  }, [allQuestions]);

  // Helper to toggle subject selection
  const toggleSubject = (subId: SubjectId) => {
    const isSelected = filterState.selectedSubjectIds.includes(subId);
    let next: SubjectId[];
    if (isSelected) {
      next = filterState.selectedSubjectIds.filter(id => id !== subId);
    } else {
      next = [...filterState.selectedSubjectIds, subId];
    }
    onFilterChange({ ...filterState, selectedSubjectIds: next });
  };

  // Select all or deselect all subjects
  const allSubIds = subjectConfig.filter(s => s.id !== 'todos').map(s => s.id);
  const isAllSubjectsSelected = allSubIds.length > 0 && allSubIds.every(id => filterState.selectedSubjectIds.includes(id));

  const toggleSelectAllSubjects = () => {
    if (isAllSubjectsSelected) {
      onFilterChange({ ...filterState, selectedSubjectIds: [] });
    } else {
      onFilterChange({ ...filterState, selectedSubjectIds: allSubIds, selectedListIds: filterState.languageFilter === 'pt' ? ['pdf_7'] : [] });
    }
  };

  // Set status filter
  const setStatusFilter = (st: FilterState['statusFilter']) => {
    onFilterChange({ ...filterState, statusFilter: st });
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      languageFilter: filterState.languageFilter,
      selectedSubjectIds: allSubIds,
      selectedListIds: filterState.languageFilter === 'pt' ? ['pdf_7'] : [],
      statusFilter: 'all',
      limitQuantity: undefined
    });
  };

  const handleLanguageChange = (language: 'pt' | 'en') => {
    const nextConfig = language === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG;
    onFilterChange({
      ...filterState,
      languageFilter: language,
      selectedSubjectIds: nextConfig.filter(subject => subject.id !== 'todos').map(subject => subject.id),
      selectedListIds: language === 'pt' ? ['pdf_7'] : [],
      statusFilter: 'all',
      limitQuantity: undefined,
    });
  };

  // Calculate matching questions count in real time
  const matchingQuestions = useMemo(() => {
    return visibleQuestions.filter(q => {
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
  }, [visibleQuestions, filterState.selectedSubjectIds, filterState.statusFilter, confirmedAnswers, userAnswers, noIdeaQuestions]);

  return (
    <div className="question-filter-page mx-auto max-w-5xl space-y-8 px-4 py-7 sm:px-6 sm:py-9">
      
      {/* Top Header Card */}
      <div className="flex flex-col justify-between gap-5 border-b border-[#343c46]/70 pb-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8b949e]">
            <BookOpen className="w-3.5 h-3.5 text-[#e8a87c]" />
            <span>{filterState.languageFilter === 'en' ? 'Inglês' : 'Português'}</span>
            <span>/</span>
            <span className="text-[#e8a87c]">Banco de Questões</span>
            <span>/</span>
            <span className="text-[#f3ede6]">Seleção</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#f3ede6] sm:text-3xl">
            Filtrar e Montar Questões
          </h1>
        </div>

        <button
          onClick={onOpenImportModal}
          className="flex shrink-0 items-center space-x-2 rounded-xl border border-[#343c46] bg-[#20242b] px-4 py-2.5 text-xs text-[#f3ede6] shadow-sm transition-all hover:border-[#e8a87c] hover:bg-[#282e37] active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-[#e8a87c]" />
          <span>Importar PDF</span>
        </button>
      </div>

      {/* 2-Column Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Subjects Tree (5 cols) */}
        <div className="question-filter-card question-filter-subjects md:col-span-6 overflow-hidden rounded-2xl border border-[#343c46]/80 bg-[#181b20]/70">
          {([
            { id: 'pt' as const, label: 'Português', count: languageCounts.pt },
            { id: 'en' as const, label: 'Inglês', count: languageCounts.en },
          ]).map((language, languageIndex) => {
            const isActiveLanguage = filterState.languageFilter === language.id;

            return (
              <div key={language.id} className={`question-filter-language ${languageIndex > 0 ? 'border-t border-[#262b33]' : ''}`}>
                <div className="flex items-center justify-between gap-3 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => isActiveLanguage ? toggleSelectAllSubjects() : handleLanguageChange(language.id)}
                    aria-pressed={isActiveLanguage && isAllSubjectsSelected}
                    data-language-active={isActiveLanguage}
                    className={`flex min-w-0 items-center gap-2.5 text-left text-sm font-semibold transition-colors hover:text-[#e8a87c] ${
                      isActiveLanguage ? 'text-[#f3ede6]' : 'text-[#9ca3af]'
                    }`}
                  >
                    {isActiveLanguage && isAllSubjectsSelected ? (
                      <CheckSquare className="h-4 w-4 shrink-0 text-[#e8a87c]" />
                    ) : (
                      <Square className="h-4 w-4 shrink-0 text-[#4b5563]" />
                    )}
                    <span className="truncate">{language.label} {isActiveLanguage && isAllSubjectsSelected ? '(Todos os Assuntos)' : ''}</span>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`question-filter-count inline-flex min-w-[3rem] justify-center rounded-lg px-2 py-0.5 text-[10.5px] font-mono ${
                      isActiveLanguage ? 'bg-[#e8a87c]/20 font-bold text-[#e8a87c]' : 'bg-[#15181d] text-[#6b7280]'
                    }`}>
                      {language.count}Q
                    </span>
                    <button
                      type="button"
                      onClick={() => isActiveLanguage ? setIsTreeExpanded(!isTreeExpanded) : handleLanguageChange(language.id)}
                      aria-label={isActiveLanguage
                        ? (isTreeExpanded ? 'Recolher assuntos' : 'Expandir assuntos')
                        : `Selecionar ${language.label} e ver assuntos`}
                      aria-expanded={isActiveLanguage ? isTreeExpanded : false}
                      className="question-filter-tree-trigger h-6 w-6 rounded-lg p-1 text-[#9ca3af] transition-colors hover:bg-[#20242b] hover:text-[#f3ede6]"
                    >
                      {isActiveLanguage && isTreeExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {isActiveLanguage && isTreeExpanded && (
                  <div className="space-y-1 border-t border-[#262b33] px-4 py-3 sm:px-5">
                    {subjectConfig.filter(s => s.id !== 'todos').map(sub => {
                      const isSelected = filterState.selectedSubjectIds.includes(sub.id);
                      const count = subjectCounts.get(sub.id) ?? 0;

                      return (
                        <label
                          key={sub.id}
                          data-selected={isSelected}
                          className={`question-filter-topic flex cursor-pointer items-center justify-between rounded-xl border p-2.5 transition-all ${
                            isSelected
                              ? 'border-[#e8a87c]/30 bg-[#20242b] text-[#f3ede6]'
                              : 'border-transparent text-[#9ca3af] hover:bg-[#1a1d23]'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSubject(sub.id)}
                              className="hidden"
                            />
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 shrink-0 text-[#e8a87c]" />
                            ) : (
                              <Square className="h-4 w-4 shrink-0 text-[#4b5563]" />
                            )}
                            <span className="text-sm font-medium">{sub.shortTitle}</span>
                          </div>

                          <span className={`question-filter-count inline-flex min-w-[3rem] justify-center rounded-lg px-2 py-0.5 text-[10.5px] font-mono ${
                            isSelected ? 'bg-[#e8a87c]/20 font-bold text-[#e8a87c]' : 'bg-[#15181d] text-[#6b7280]'
                          }`}>
                            {count}Q
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Status & Active Chips (6 cols) */}
        <div className="question-filter-controls md:col-span-6 space-y-5">
          
          {/* Status de Resolução */}
          <div className="question-filter-card question-filter-status-card space-y-3 rounded-2xl border border-[#343c46]/80 bg-[#181b20]/70 p-5">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#e8a87c] font-bold">
              <Filter className="w-3.5 h-3.5" />
              <span>Status das Questões</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Todas as Questões' },
                { id: 'pending', label: 'Pendentes' },
                { id: 'correct', label: 'Acertos' },
                { id: 'wrong', label: 'Erros' },
                { id: 'noIdea', label: 'Marcadas como não sei' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  aria-pressed={filterState.statusFilter === st.id}
                  data-selected={filterState.statusFilter === st.id}
                  className={`question-filter-status-option p-2.5 rounded-xl text-xs font-mono text-center transition-all border ${
                    filterState.statusFilter === st.id
                      ? 'bg-[#262c35] border-[#e8a87c] text-[#f3ede6] font-bold shadow-sm'
                      : 'bg-[#20242b] border-[#2e353e] text-[#8b949e] hover:text-[#f3ede6]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Opção de Criar Simulado Rápido */}
          <div className="question-filter-card question-filter-quantity-card space-y-3 rounded-2xl border border-[#343c46]/80 bg-[#181b20]/70 p-5">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#e8a87c] font-bold">
              <ListPlus className="w-3.5 h-3.5" />
              <span>Quantidade para Simulado Rápido</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 0].map(qty => (
                <button
                  key={qty}
                  onClick={() => setSimuladoQty(qty)}
                  aria-pressed={simuladoQty === qty}
                  data-selected={simuladoQty === qty}
                  className={`question-filter-quantity-option py-2 px-1 rounded-xl text-xs font-mono text-center transition-all border ${
                    simuladoQty === qty
                      ? 'bg-[#2a1d17] border-[#e8a87c] text-[#e8a87c] font-bold'
                      : 'bg-[#20242b] border-[#2e353e] text-[#8b949e] hover:text-[#f3ede6]'
                  }`}
                >
                  {qty === 0 ? 'Todas' : `${qty}Q`}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Final page actions: normal document flow, visible only at the end of the filters. */}
      <section
        aria-label="Ações do Banco de Questões"
        className="question-filter-card question-filter-actions flex w-full flex-col gap-3 rounded-2xl border border-[#3d4652] bg-[#181b20] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
      >
        {/* Left Actions */}
        <div className="flex w-full items-center sm:w-auto">
          <button
            onClick={handleClearFilters}
            className="question-filter-clear flex w-full items-center justify-center space-x-1.5 rounded-xl border border-[#2e353e] bg-[#20242b] px-3.5 py-2.5 text-xs font-mono text-[#9ca3af] transition-colors hover:bg-[#282e37] hover:text-[#f87171] sm:w-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar filtros</span>
          </button>
        </div>

        {/* Right Primary Action Buttons */}
        <div className="grid w-full grid-cols-1 gap-2 sm:w-[480px] sm:grid-cols-2">
          <button
            onClick={() => onStartPractice(simuladoQty === 0 ? undefined : simuladoQty)}
            disabled={matchingQuestions.length === 0}
            className="question-filter-preview flex h-10 w-full items-center justify-center space-x-2 rounded-xl border border-[#e8a87c]/60 bg-[#2a1d17] px-4 text-xs font-bold font-mono text-[#e8a87c] shadow-md transition-all hover:bg-[#38261e] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eye className="h-4 w-4 shrink-0" />
            <span>Pré-visualizar ({simuladoQty === 0 ? 'Todas' : `${simuladoQty}Q`})</span>
          </button>

          <button
            onClick={() => onCreateList(simuladoQty === 0 ? undefined : simuladoQty)}
            disabled={matchingQuestions.length === 0}
            className="question-filter-create flex h-10 w-full items-center justify-center space-x-2 rounded-xl bg-[#e8a87c] px-4 text-xs font-bold font-mono text-[#16181b] shadow-lg transition-all hover:bg-[#f0b58e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Criar Lista ({simuladoQty === 0 ? matchingQuestions.length : Math.min(simuladoQty, matchingQuestions.length)} questões)</span>
          </button>
        </div>

      </section>

    </div>
  );
};
