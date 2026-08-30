export type Mood = 
  | 'indicativo'
  | 'subjuntivo'
  | 'imperativo_af'
  | 'imperativo_neg'
  | 'formas_nominais';

export type Tense = 
  | 'presente'
  | 'pret_perfeito'
  | 'pret_imperfeito'
  | 'pret_mais_que_perfeito'
  | 'futuro_presente'
  | 'futuro_preterito'
  | 'futuro_subjuntivo'
  | 'infinitivo_pessoal'
  | 'participio'
  | 'gerundio';

export type Person = '1s' | '2s' | '3s' | '1p' | '2p' | '3p' | 'na';

export interface ConjugationForm {
  person: Person;
  pronoun: string;
  form: string | null; // null = forma defectiva / inexistente
  irregularHighlight?: string; // trecho irregular para destaque
}

export interface VerbConjugationTable {
  mood: Mood;
  tense: Tense;
  tenseLabel: string;
  forms: Record<Person, string | null>;
}

export interface VerbEntry {
  id: string;
  infinitive: string;
  primitiveRoot?: string; // ex: 'pôr' para 'compor'
  conjugationGroup: 1 | 2 | 3; // -ar, -er/-or, -ir
  isIrregular: boolean;
  isDefective: boolean;
  isAbundant: boolean;
  classification: 'regular' | 'irregular' | 'anomalo' | 'defectivo' | 'abundante';
  examTags: ('espcex' | 'eear' | 'afa' | 'efomm' | 'cn' | 'epcar')[];
  criticalTrapDescription?: string;
  /** Frequência observada nos nove PDFs locais (para priorização, nunca para corrigir a forma). */
  pdfFrequency?: number;
  /** Quantidade de PDFs nos quais o verbo ou uma forma flexionada foi encontrado. */
  pdfDocumentCount?: number;
  /** Ordem de prioridade editorial baseada no corpus local e na incidência gramatical. */
  studyPriority?: 'essencial' | 'alta' | 'complementar';
  doubleParticiple?: {
    regular: string; // ex: imprimido (com ter/haver)
    irregular: string; // ex: impresso (com ser/estar)
  };
  conjugations: Record<string, Record<Person, string | null>>; // key: `${mood}_${tense}`
}

export type QuestionArchetype = 
  | 'lacuna_derivado'
  | 'correlacao'
  | 'imperativo_conversao'
  | 'identificacao_morfologica'
  | 'vozes_verbais'
  | 'duplo_participio'
  | 'homonimos_temporais';

export type MilitaryBanca = 'EEAr' | 'EsPCEx' | 'AFA' | 'EFOMM' | 'Colégio Naval' | 'EPCAr' | 'Concurso Militar';

export interface QuestionOption {
  letter: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  correct: boolean;
  explanation: string;
}

export interface MilitaryQuestion {
  id: string;
  archetype: QuestionArchetype;
  bancaTarget: MilitaryBanca;
  statement: string;
  options: QuestionOption[];
  resolutionCommentary: string;
  targetVerbs: string[];
  ruleContext: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'insano';
  isAiGenerated?: boolean;
}

export interface MilitaryRank {
  level: number;
  title: string;
  abbreviation: string;
  minMasteryScore: number;
  badgeColor: string;
  description: string;
}

export interface UserVerbStat {
  verbId: string;
  mood: Mood;
  tense: Tense;
  correctCount: number;
  errorCount: number;
  masteryScore: number; // 0 to 100
  lastPracticed: string;
  nextReviewDate: string;
  easeFactor: number;
  intervalDays: number;
}

export interface DailyActivityLog {
  date: string; // YYYY-MM-DD
  cellsFilled: number;
  questionsAnswered: number;
  accuracy: number;
}
