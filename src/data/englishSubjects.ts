import type { EnglishSubjectId, SubjectMetadata } from './questionBank';

/** Public subdivisions from the 1,500-question military English PDF. */
export const ENGLISH_SUBJECTS_CONFIG: SubjectMetadata[] = [
  { id: 'english_adjectives_adverbs', title: 'Adjectives and Adverbs', shortTitle: 'Adjectives & Adverbs', description: 'Adjetivos, advérbios e graus de comparação', iconName: 'Type' },
  { id: 'english_pronouns', title: 'Pronouns', shortTitle: 'Pronouns', description: 'Pronomes pessoais, demonstrativos, relativos e reflexivos', iconName: 'UserRound' },
  { id: 'english_quantifiers_intensifiers', title: 'Quantifiers and Intensifiers', shortTitle: 'Quantifiers & Intensifiers', description: 'Quantificadores, intensidade e expressões de quantidade', iconName: 'Gauge' },
  { id: 'english_verbs', title: 'Verbs', shortTitle: 'Verbs', description: 'Tempos, formas e usos dos verbos', iconName: 'Languages' },
  { id: 'english_modal_auxiliaries', title: 'Modal Auxiliaries', shortTitle: 'Modal Auxiliaries', description: 'Can, could, may, might, must, should e ought to', iconName: 'SlidersHorizontal' },
  { id: 'english_active_passive', title: 'Active and Passive Voice', shortTitle: 'Active & Passive Voice', description: 'Transformação e reconhecimento de vozes verbais', iconName: 'ArrowRightLeft' },
  { id: 'english_direct_indirect', title: 'Direct and Indirect Speech', shortTitle: 'Direct & Indirect Speech', description: 'Discurso direto, indireto e mudanças de referência', iconName: 'MessageSquareQuote' },
  { id: 'english_conditionals', title: 'Conditionals', shortTitle: 'Conditionals', description: 'Orações condicionais e inversões', iconName: 'GitBranch' },
  { id: 'english_question_tags', title: 'Question Tags', shortTitle: 'Question Tags', description: 'Question tags e concordância auxiliar', iconName: 'CircleHelp' },
  { id: 'english_rejoinders', title: 'Rejoinders', shortTitle: 'Rejoinders', description: 'Respostas de concordância e discordância', iconName: 'MessageCircle' },
  { id: 'english_articles', title: 'Articles', shortTitle: 'Articles', description: 'Artigos definidos, indefinidos e ausência de artigo', iconName: 'BookMarked' },
  { id: 'english_plural_nouns', title: 'Plural of the Nouns', shortTitle: 'Plural of Nouns', description: 'Plurais regulares e irregulares', iconName: 'Copy' },
  { id: 'english_genitive_case', title: 'Genitive Case', shortTitle: 'Genitive Case', description: 'Possessivo com ’s e of', iconName: 'KeyRound' },
  { id: 'english_numbers', title: 'Numbers', shortTitle: 'Numbers', description: 'Números cardinais, ordinais e leitura de valores', iconName: 'Hash' },
  { id: 'english_prepositions', title: 'Prepositions', shortTitle: 'Prepositions', description: 'Preposições de tempo, lugar, movimento e regência', iconName: 'MapPin' },
  { id: 'english_conjunctions', title: 'Conjunctions', shortTitle: 'Conjunctions', description: 'Conjunções coordenativas, subordinativas e conectores', iconName: 'Link2' },
  { id: 'english_subjunctive_imperative_infinitive_gerund', title: 'Subjunctive, Imperative, Infinitive and Gerund', shortTitle: 'Subjunctive & Non-finite Forms', description: 'Subjuntivo, imperativo, infinitivo e gerúndio', iconName: 'ListTree' },
  { id: 'english_phrasal_verbs', title: 'Phrasal Verbs', shortTitle: 'Phrasal Verbs', description: 'Verbos frasais recorrentes em provas', iconName: 'Combine' },
  { id: 'english_false_cognates', title: 'False Cognate Words', shortTitle: 'False Cognates', description: 'Falsos cognatos e armadilhas de tradução', iconName: 'Languages' },
  { id: 'english_mixed_topics', title: 'Mixed Topics', shortTitle: 'Mixed Topics', description: 'Revisão combinada de gramática', iconName: 'Layers3' },
  { id: 'english_idioms_vocabulary', title: 'Idioms and Vocabulary', shortTitle: 'Idioms & Vocabulary', description: 'Expressões idiomáticas e vocabulário contextual', iconName: 'MessageSquareText' },
  { id: 'english_synonyms_antonyms', title: 'Synonyms and Antonyms', shortTitle: 'Synonyms & Antonyms', description: 'Relações de sentido e vocabulário', iconName: 'AlignHorizontalSpaceAround' },
  { id: 'english_reading_review', title: 'Reading Skills and General Review', shortTitle: 'Reading & General Review', description: 'Interpretação de textos e revisão geral', iconName: 'BookOpenText' },
  { id: 'english_translations', title: 'Translations', shortTitle: 'Translations', description: 'Tradução contextual de frases e vocabulário', iconName: 'Languages' },
  { id: 'importadas', title: 'Importadas / Personalizadas', shortTitle: 'Importadas', description: 'Questões importadas via IA ou arquivos PDF do usuário', iconName: 'FileUp' },
];

export const ENGLISH_SUBJECT_IDS = ENGLISH_SUBJECTS_CONFIG
  .filter(subject => subject.id !== 'importadas')
  .map(subject => subject.id as EnglishSubjectId);
