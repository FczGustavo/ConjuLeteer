import type { SubjectId, SubjectMetadata } from './questionBank';

export interface UnifiedEnglishSubjectMetadata extends SubjectMetadata {
  matchingSubjectIds?: string[];
}

/**
 * Unified English subjects combining both public compilations and the 2,270-question
 * military exam bank without duplicate categories or "clássico" sub-labels.
 */
export const ENGLISH_SUBJECTS_CONFIG: UnifiedEnglishSubjectMetadata[] = [
  // --- Interpretação e Vocabulário por Banca Militar ---
  {
    id: 'preview_reading',
    title: 'Interpretação e Vocabulário — Colégio Naval',
    shortTitle: 'Interpretação: Colégio Naval',
    description: 'Questões de leitura e vocabulário do Colégio Naval (CN)',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading'],
  },
  {
    id: 'preview_reading_epcar',
    title: 'Interpretação e Vocabulário — EPCAR',
    shortTitle: 'Interpretação: EPCAR',
    description: 'Questões de leitura e vocabulário da EPCAR',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_epcar'],
  },
  {
    id: 'preview_reading_eam',
    title: 'Interpretação e Vocabulário — EAM',
    shortTitle: 'Interpretação: EAM',
    description: 'Questões de leitura e vocabulário da EAM',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_eam'],
  },
  {
    id: 'preview_reading_essa',
    title: 'Interpretação e Vocabulário — EsSA',
    shortTitle: 'Interpretação: EsSA',
    description: 'Questões de leitura e vocabulário da EsSA',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_essa'],
  },
  {
    id: 'preview_reading_eear',
    title: 'Interpretação e Vocabulário — EEAr',
    shortTitle: 'Interpretação: EEAr',
    description: 'Questões de leitura e vocabulário da EEAr',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_eear'],
  },
  {
    id: 'preview_reading_eear_bct',
    title: 'Interpretação e Vocabulário — EEAr BCT',
    shortTitle: 'Interpretação: EEAr BCT',
    description: 'Questões de leitura e vocabulário da EEAr BCT',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_eear_bct'],
  },
  {
    id: 'preview_reading_espcex',
    title: 'Interpretação e Vocabulário — EsPCEx',
    shortTitle: 'Interpretação: EsPCEx',
    description: 'Questões de leitura e vocabulário da EsPCEx',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_espcex'],
  },
  {
    id: 'preview_reading_afa',
    title: 'Interpretação e Vocabulário — AFA',
    shortTitle: 'Interpretação: AFA',
    description: 'Questões de leitura e vocabulário da AFA',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_afa'],
  },
  {
    id: 'preview_reading_efomm',
    title: 'Interpretação e Vocabulário — EFOMM',
    shortTitle: 'Interpretação: EFOMM',
    description: 'Questões de leitura e vocabulário da EFOMM',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_efomm'],
  },
  {
    id: 'preview_reading_en',
    title: 'Interpretação e Vocabulário — Escola Naval',
    shortTitle: 'Interpretação: Escola Naval',
    description: 'Questões de leitura e vocabulário da Escola Naval',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_en'],
  },
  {
    id: 'preview_reading_ita',
    title: 'Interpretação e Vocabulário — ITA',
    shortTitle: 'Interpretação: ITA',
    description: 'Questões de leitura e vocabulário do ITA',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['preview_reading_ita'],
  },
  {
    id: 'english_reading_review',
    title: 'Interpretação e Vocabulário — Geral e IME',
    shortTitle: 'Interpretação: Geral / IME',
    description: 'Textos de leitura, IME, vestibulares e revisão geral',
    iconName: 'BookOpenText',
    matchingSubjectIds: ['english_reading_review'],
  },

  // --- Gramática e Tópicos Estruturais ---
  {
    id: 'preview_articles',
    title: 'Articles (Artigos)',
    shortTitle: 'Articles',
    description: 'Artigos definidos, indefinidos e caso zero',
    iconName: 'BookMarked',
    matchingSubjectIds: ['preview_articles', 'english_articles'],
  },
  {
    id: 'preview_nouns_countable',
    title: 'Nouns: Countable x Uncountable',
    shortTitle: 'Nouns: Countable',
    description: 'Substantivos contáveis e incontáveis',
    iconName: 'Copy',
    matchingSubjectIds: ['preview_nouns_countable'],
  },
  {
    id: 'preview_nouns_plural',
    title: 'Nouns: Plural',
    shortTitle: 'Nouns: Plural',
    description: 'Plural regular e irregular dos substantivos',
    iconName: 'Copy',
    matchingSubjectIds: ['preview_nouns_plural', 'english_plural_nouns'],
  },
  {
    id: 'preview_nouns_gender',
    title: 'Nouns: Gender',
    shortTitle: 'Nouns: Gender',
    description: 'Gênero dos substantivos',
    iconName: 'Copy',
    matchingSubjectIds: ['preview_nouns_gender'],
  },
  {
    id: 'preview_adjectives',
    title: 'Adjectives (Adjetivos)',
    shortTitle: 'Adjectives',
    description: 'Adjetivos, comparativos e superlativos',
    iconName: 'Type',
    matchingSubjectIds: ['preview_adjectives'],
  },
  {
    id: 'preview_adverbs',
    title: 'Adverbs (Advérbios)',
    shortTitle: 'Adverbs',
    description: 'Advérbios de modo, tempo, lugar e frequência',
    iconName: 'Gauge',
    matchingSubjectIds: ['preview_adverbs'],
  },
  {
    id: 'english_adjectives_adverbs',
    title: 'Adjectives and Adverbs — Geral',
    shortTitle: 'Adjectives & Adverbs',
    description: 'Adjetivos, advérbios e estruturas comparativas',
    iconName: 'Type',
    matchingSubjectIds: ['english_adjectives_adverbs'],
  },
  {
    id: 'preview_pronouns_personal',
    title: 'Pronouns: Subject x Object',
    shortTitle: 'Pronouns: Subject / Object',
    description: 'Pronomes pessoais retos e oblíquos',
    iconName: 'UserRound',
    matchingSubjectIds: ['preview_pronouns_personal'],
  },
  {
    id: 'preview_pronouns_possessive',
    title: 'Pronouns: Possessives',
    shortTitle: 'Pronouns: Possessives',
    description: 'Adjetivos possessivos e pronomes possessivos',
    iconName: 'UserRound',
    matchingSubjectIds: ['preview_pronouns_possessive'],
  },
  {
    id: 'preview_pronouns_reflexive',
    title: 'Pronouns: Reflexive',
    shortTitle: 'Pronouns: Reflexive',
    description: 'Pronomes reflexivos e uso enfático',
    iconName: 'UserRound',
    matchingSubjectIds: ['preview_pronouns_reflexive'],
  },
  {
    id: 'preview_pronouns_relative',
    title: 'Pronouns: Relative',
    shortTitle: 'Pronouns: Relative',
    description: 'Pronomes relativos (who, which, that, whose, whom)',
    iconName: 'UserRound',
    matchingSubjectIds: ['preview_pronouns_relative'],
  },
  {
    id: 'preview_pronouns_demonstrative',
    title: 'Pronouns: Demonstrative',
    shortTitle: 'Pronouns: Demonstrative',
    description: 'Pronomes demonstrativos (this, that, these, those)',
    iconName: 'UserRound',
    matchingSubjectIds: ['preview_pronouns_demonstrative'],
  },
  {
    id: 'preview_pronouns_indefinite',
    title: 'Pronouns: Indefinite',
    shortTitle: 'Pronouns: Indefinite',
    description: 'Pronomes indefinidos (some, any, no, every e compostos)',
    iconName: 'UserRound',
    matchingSubjectIds: ['preview_pronouns_indefinite'],
  },
  {
    id: 'english_pronouns',
    title: 'Pronouns — Geral e Sintaxe',
    shortTitle: 'Pronouns (Geral)',
    description: 'Pronomes mistos e construções sintáticas',
    iconName: 'UserRound',
    matchingSubjectIds: ['english_pronouns'],
  },
  {
    id: 'preview_verbs',
    title: 'Verbs and Verb Tenses',
    shortTitle: 'Verbs & Verb Tenses',
    description: 'Tempos e formas verbais (Simple, Continuous, Perfect)',
    iconName: 'Languages',
    matchingSubjectIds: ['preview_verbs', 'english_verbs'],
  },
  {
    id: 'preview_modal_verbs',
    title: 'Modal Verbs',
    shortTitle: 'Modal Verbs',
    description: 'Verbos modais (can, could, may, might, must, should)',
    iconName: 'SlidersHorizontal',
    matchingSubjectIds: ['preview_modal_verbs', 'english_modal_auxiliaries'],
  },
  {
    id: 'preview_passive_active',
    title: 'Passive Voice and Active Voice',
    shortTitle: 'Passive & Active Voice',
    description: 'Transformação e reconhecimento de voz ativa e passiva',
    iconName: 'ArrowRightLeft',
    matchingSubjectIds: ['preview_passive_active', 'english_active_passive'],
  },
  {
    id: 'preview_reported_speech',
    title: 'Reported Speech',
    shortTitle: 'Reported Speech',
    description: 'Discurso direto e indireto',
    iconName: 'MessageSquareQuote',
    matchingSubjectIds: ['preview_reported_speech', 'english_direct_indirect'],
  },
  {
    id: 'preview_if_clauses',
    title: 'If Clauses (Conditionals)',
    shortTitle: 'If Clauses',
    description: 'Orações condicionais (Zero, 1st, 2nd, 3rd, Mixed)',
    iconName: 'GitBranch',
    matchingSubjectIds: ['preview_if_clauses', 'english_conditionals'],
  },
  {
    id: 'preview_question_tags',
    title: 'Question Tag e Tag Answers',
    shortTitle: 'Question Tags',
    description: 'Question tags e respostas curtas',
    iconName: 'CircleHelp',
    matchingSubjectIds: ['preview_question_tags', 'english_question_tags'],
  },
  {
    id: 'preview_wh_questions',
    title: 'Wh-Questions',
    shortTitle: 'Wh-Questions',
    description: 'Pronomes e advérbios interrogativos',
    iconName: 'CircleHelp',
    matchingSubjectIds: ['preview_wh_questions'],
  },
  {
    id: 'preview_so_too',
    title: 'so / too / either / neither / nor',
    shortTitle: 'So / Too / Either',
    description: 'Estruturas de concordância e rejoinders',
    iconName: 'MessageCircle',
    matchingSubjectIds: ['preview_so_too', 'english_rejoinders'],
  },
  {
    id: 'preview_numbers',
    title: 'Numbers (Numerais)',
    shortTitle: 'Numbers',
    description: 'Cardinais, ordinais, frações e datas',
    iconName: 'Hash',
    matchingSubjectIds: ['preview_numbers', 'english_numbers'],
  },
  {
    id: 'preview_prepositions',
    title: 'Prepositions (Preposições)',
    shortTitle: 'Prepositions',
    description: 'Preposições de tempo, lugar, movimento e regência',
    iconName: 'MapPin',
    matchingSubjectIds: ['preview_prepositions', 'english_prepositions'],
  },
  {
    id: 'preview_conjunctions',
    title: 'Conjunctions (Conjunções)',
    shortTitle: 'Conjunctions',
    description: 'Conjunções e conectivos oracionais',
    iconName: 'Link2',
    matchingSubjectIds: ['preview_conjunctions', 'english_conjunctions'],
  },
  {
    id: 'preview_phrasal_verbs',
    title: 'Phrasal Verbs',
    shortTitle: 'Phrasal Verbs',
    description: 'Verbos frasais mais cobrados em concursos militares',
    iconName: 'Combine',
    matchingSubjectIds: ['preview_phrasal_verbs', 'english_phrasal_verbs'],
  },
  {
    id: 'preview_determiners',
    title: 'Determiners',
    shortTitle: 'Determiners',
    description: 'Determinantes em inglês',
    iconName: 'ListTree',
    matchingSubjectIds: ['preview_determiners'],
  },
  {
    id: 'preview_quantifiers',
    title: 'Quantifiers',
    shortTitle: 'Quantifiers',
    description: 'Quantificadores (many, much, few, little, a lot)',
    iconName: 'Gauge',
    matchingSubjectIds: ['preview_quantifiers', 'english_quantifiers_intensifiers'],
  },
  {
    id: 'preview_infinitive_gerund',
    title: 'Infinitive x Gerund',
    shortTitle: 'Infinitive x Gerund',
    description: 'Infinitivo, gerúndio e particípio',
    iconName: 'ListTree',
    matchingSubjectIds: ['preview_infinitive_gerund', 'english_subjunctive_imperative_infinitive_gerund'],
  },
  {
    id: 'preview_genitive',
    title: 'Genitive Case',
    shortTitle: 'Genitive Case',
    description: 'Caso genitivo (’s e of)',
    iconName: 'KeyRound',
    matchingSubjectIds: ['preview_genitive', 'english_genitive_case'],
  },
  {
    id: 'preview_grammar_classes',
    title: 'Classes Gramaticais',
    shortTitle: 'Classes Gramaticais',
    description: 'Identificação morfossintática e tópicos mistos',
    iconName: 'Layers3',
    matchingSubjectIds: ['preview_grammar_classes', 'english_mixed_topics'],
  },
  {
    id: 'english_false_cognates',
    title: 'False Cognate Words',
    shortTitle: 'False Cognates',
    description: 'Falsos cognatos e armadilhas de tradução',
    iconName: 'Languages',
    matchingSubjectIds: ['english_false_cognates'],
  },
  {
    id: 'english_idioms_vocabulary',
    title: 'Idioms and Vocabulary',
    shortTitle: 'Idioms & Vocabulary',
    description: 'Expressões idiomáticas e vocabulário contextual',
    iconName: 'MessageSquareText',
    matchingSubjectIds: ['english_idioms_vocabulary'],
  },
  {
    id: 'english_synonyms_antonyms',
    title: 'Synonyms and Antonyms',
    shortTitle: 'Synonyms & Antonyms',
    description: 'Sinônimos e antônimos',
    iconName: 'AlignHorizontalSpaceAround',
    matchingSubjectIds: ['english_synonyms_antonyms'],
  },
  {
    id: 'english_translations',
    title: 'Translations',
    shortTitle: 'Translations',
    description: 'Tradução contextual de vocabulário e frases',
    iconName: 'Languages',
    matchingSubjectIds: ['english_translations'],
  },
  {
    id: 'importadas',
    title: 'Importadas / Personalizadas',
    shortTitle: 'Importadas',
    description: 'Questões importadas via IA ou arquivos PDF do usuário',
    iconName: 'FileUp',
    matchingSubjectIds: ['importadas'],
  },
];

export const ENGLISH_SUBJECT_IDS = ENGLISH_SUBJECTS_CONFIG
  .filter(subject => subject.id !== 'importadas')
  .map(subject => subject.id as SubjectId);

/**
 * Returns all raw subjectIds matching a selected configuration subject.
 */
export function getMatchingEnglishSubjectIds(selectedId: string): string[] {
  const config = ENGLISH_SUBJECTS_CONFIG.find(item => item.id === selectedId);
  return config?.matchingSubjectIds && config.matchingSubjectIds.length > 0
    ? config.matchingSubjectIds
    : [selectedId];
}

/**
 * Returns true if the question's subjectId matches any of the currently selected subject filters.
 */
export function matchesEnglishSubjectFilter(
  questionSubjectId: string,
  selectedSubjectIds: string[],
): boolean {
  if (!selectedSubjectIds || selectedSubjectIds.length === 0) return true;
  for (const selectedId of selectedSubjectIds) {
    const matchingIds = getMatchingEnglishSubjectIds(selectedId);
    if (matchingIds.includes(questionSubjectId)) return true;
    if (selectedId === questionSubjectId) return true;
  }
  return false;
}
