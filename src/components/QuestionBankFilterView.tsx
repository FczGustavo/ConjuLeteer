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
  statusFilter: 'all' | 'pending' | 'correct' | 'wrong';
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
  /** Internal visual-audit mode; includes the two hidden 30-question sheets. */
  includeAuditLists?: boolean;
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
  includeAuditLists = false
}) => {
  const [isTreeExpanded, setIsTreeExpanded] = useState<boolean>(true);
  const [simuladoQty, setSimuladoQty] = useState<number>(10);
  const subjectConfig = filterState.languageFilter === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG;
  const visibleQuestions = useMemo(
    () => allQuestions.filter(question => {
      const inLanguage = filterState.languageFilter === 'en' ? question.language === 'en' : question.language !== 'en';
      if (!inLanguage) return false;
      return includeAuditLists || question.subjectId !== 'verbos' || question.listId === 'pdf_7';
    }),
    [allQuestions, includeAuditLists, filterState.languageFilter]
  );

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
  const setStatusFilter = (st: 'all' | 'pending' | 'correct' | 'wrong') => {
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
      }

      return true;
    });
  }, [visibleQuestions, filterState.selectedSubjectIds, filterState.statusFilter, confirmedAnswers, userAnswers]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#181b20] border border-[#2e353e] shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8b949e]">
            <BookOpen className="w-3.5 h-3.5 text-[#e8a87c]" />
            <span>{filterState.languageFilter === 'en' ? 'Inglês' : 'Português'}</span>
            <span>/</span>
            <span className="text-[#e8a87c]">Banco de Questões</span>
            <span>/</span>
            <span className="text-[#f3ede6]">Seleção</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#f3ede6] mt-1 font-mono">
            Filtrar e Montar Questões
          </h1>
        </div>

        <button
          onClick={onOpenImportModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#20242b] hover:bg-[#282e37] border border-[#2e353e] hover:border-[#e8a87c] text-[#f3ede6] text-xs font-mono transition-all shadow-md active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-[#e8a87c]" />
          <span>Importar PDF</span>
        </button>
      </div>

      {/* Language subdivision */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[#2e353e] bg-[#181b20] p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#e8a87c]">Subdivisão do banco</p>
          <p className="mt-1 text-xs text-[#8b949e]">Escolha o idioma e filtre somente os assuntos daquela coleção.</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto">
          {([
            { id: 'pt' as const, label: 'Português', count: allQuestions.filter(question => question.language !== 'en').length },
            { id: 'en' as const, label: 'Inglês', count: allQuestions.filter(question => question.language === 'en').length },
          ]).map(language => (
            <button
              key={language.id}
              onClick={() => {
                const nextConfig = language.id === 'en' ? ENGLISH_SUBJECTS_CONFIG : SUBJECTS_CONFIG;
                onFilterChange({
                  ...filterState,
                  languageFilter: language.id,
                  selectedSubjectIds: nextConfig.filter(subject => subject.id !== 'todos').map(subject => subject.id),
                  selectedListIds: language.id === 'pt' ? ['pdf_7'] : [],
                  statusFilter: 'all',
                  limitQuantity: undefined,
                });
              }}
              className={`rounded-xl border px-4 py-2.5 text-xs font-mono transition-all ${
                filterState.languageFilter === language.id
                  ? 'border-[#e8a87c] bg-[#2a1d17] font-bold text-[#e8a87c] shadow-sm'
                  : 'border-[#2e353e] bg-[#20242b] text-[#9ca3af] hover:border-[#e8a87c]/50 hover:text-[#f3ede6]'
              }`}
            >
              {language.label} <span className="ml-1 opacity-70">({language.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Subjects Tree (5 cols) */}
        <div className="md:col-span-6 rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#262b33]">
            <button
              onClick={toggleSelectAllSubjects}
              className="flex items-center space-x-2 text-sm font-bold text-[#f3ede6] hover:text-[#e8a87c] transition-colors font-mono"
            >
              {isAllSubjectsSelected ? (
                <CheckSquare className="w-4 h-4 text-[#e8a87c]" />
              ) : (
                <Square className="w-4 h-4 text-[#6b7280]" />
              )}
              <span>{filterState.languageFilter === 'en' ? 'Inglês (Todos os Assuntos)' : 'Português (Todos os Assuntos)'}</span>
            </button>

            <button
              onClick={() => setIsTreeExpanded(!isTreeExpanded)}
              className="p-1 rounded-lg hover:bg-[#20242b] text-[#9ca3af]"
            >
              {isTreeExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

          {isTreeExpanded && (
            <div className="space-y-1 pl-1">
              {subjectConfig.filter(s => s.id !== 'todos').map(sub => {
                const isSelected = filterState.selectedSubjectIds.includes(sub.id);
                const count = visibleQuestions.filter(q => q.subjectId === sub.id).length;

                return (
                  <React.Fragment key={sub.id}>
                    <label
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#20242b] text-[#f3ede6] border border-[#e8a87c]/30'
                          : 'hover:bg-[#1a1d23] text-[#9ca3af] border border-transparent'
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
                          <CheckSquare className="w-4 h-4 text-[#e8a87c] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[#4b5563] shrink-0" />
                        )}
                        <span className="text-xs font-mono font-medium">{sub.shortTitle}</span>
                      </div>

                      <span className={`text-[10.5px] font-mono px-2 py-0.5 rounded-lg ${
                        isSelected ? 'bg-[#e8a87c]/20 text-[#e8a87c] font-bold' : 'bg-[#15181d] text-[#6b7280]'
                      }`}>
                        {count}Q
                      </span>
                    </label>

                  </React.Fragment>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Status & Active Chips (6 cols) */}
        <div className="md:col-span-6 space-y-5">
          
          {/* Status de Resolução */}
          <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#e8a87c] font-bold">
              <Filter className="w-3.5 h-3.5" />
              <span>Status das Questões</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'Todas as Questões' },
                { id: 'pending', label: 'Pendentes' },
                { id: 'correct', label: 'Acertos' },
                { id: 'wrong', label: 'Erros' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`p-2.5 rounded-xl text-xs font-mono text-center transition-all border ${
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
          <div className="rounded-2xl bg-[#181b20] border border-[#2e353e] p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-[#e8a87c] font-bold">
              <ListPlus className="w-3.5 h-3.5" />
              <span>Quantidade para Simulado Rápido</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[10, 20, 30, 0].map(qty => (
                <button
                  key={qty}
                  onClick={() => setSimuladoQty(qty)}
                  className={`py-2 px-1 rounded-xl text-xs font-mono text-center transition-all border ${
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
        className="flex w-full flex-col gap-3 rounded-2xl border border-[#3d4652] bg-[#181b20] p-3 shadow-xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between sm:p-4"
      >
        {/* Left Actions */}
        <div className="flex w-full items-center sm:w-auto">
          <button
            onClick={handleClearFilters}
            className="flex w-full items-center justify-center space-x-1.5 rounded-xl border border-[#2e353e] bg-[#20242b] px-3.5 py-2.5 text-xs font-mono text-[#9ca3af] transition-colors hover:bg-[#282e37] hover:text-[#f87171] sm:w-auto"
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
            className="flex h-10 w-full items-center justify-center space-x-2 rounded-xl border border-[#e8a87c]/60 bg-[#2a1d17] px-4 text-xs font-bold font-mono text-[#e8a87c] shadow-md transition-all hover:bg-[#38261e] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Eye className="h-4 w-4 shrink-0" />
            <span>Pré-visualizar ({simuladoQty === 0 ? 'Todas' : `${simuladoQty}Q`})</span>
          </button>

          <button
            onClick={() => onCreateList(simuladoQty === 0 ? undefined : simuladoQty)}
            disabled={matchingQuestions.length === 0}
            className="flex h-10 w-full items-center justify-center space-x-2 rounded-xl bg-[#e8a87c] px-4 text-xs font-bold font-mono text-[#16181b] shadow-lg transition-all hover:bg-[#f0b58e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Criar Lista ({simuladoQty === 0 ? matchingQuestions.length : Math.min(simuladoQty, matchingQuestions.length)} questões)</span>
          </button>
        </div>

      </section>

    </div>
  );
};
