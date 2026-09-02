// Loader assíncrono do corpus Inglês Preview.
import type { QuestionBankItem } from './questionBank';
export async function loadEnglishPreviewQuestions(): Promise<QuestionBankItem[]> {
  const loaders: Array<() => Promise<QuestionBankItem[]>> = [
    () => import('./englishPreview/preview_reading').then(module => module.PREVIEW_PREVIEW_READING_QUESTIONS),
    () => import('./englishPreview/preview_reading_epcar').then(module => module.PREVIEW_PREVIEW_READING_EPCAR_QUESTIONS),
    () => import('./englishPreview/preview_reading_eam').then(module => module.PREVIEW_PREVIEW_READING_EAM_QUESTIONS),
    () => import('./englishPreview/preview_reading_essa').then(module => module.PREVIEW_PREVIEW_READING_ESSA_QUESTIONS),
    () => import('./englishPreview/preview_reading_eear').then(module => module.PREVIEW_PREVIEW_READING_EEAR_QUESTIONS),
    () => import('./englishPreview/preview_reading_eear_bct').then(module => module.PREVIEW_PREVIEW_READING_EEAR_BCT_QUESTIONS),
    () => import('./englishPreview/preview_reading_espcex').then(module => module.PREVIEW_PREVIEW_READING_ESPCEX_QUESTIONS),
    () => import('./englishPreview/preview_reading_afa').then(module => module.PREVIEW_PREVIEW_READING_AFA_QUESTIONS),
    () => import('./englishPreview/preview_reading_efomm').then(module => module.PREVIEW_PREVIEW_READING_EFOMM_QUESTIONS),
    () => import('./englishPreview/preview_reading_en').then(module => module.PREVIEW_PREVIEW_READING_EN_QUESTIONS),
    () => import('./englishPreview/preview_reading_ita').then(module => module.PREVIEW_PREVIEW_READING_ITA_QUESTIONS),
    () => import('./englishPreview/preview_articles').then(module => module.PREVIEW_PREVIEW_ARTICLES_QUESTIONS),
    () => import('./englishPreview/preview_nouns_countable').then(module => module.PREVIEW_PREVIEW_NOUNS_COUNTABLE_QUESTIONS),
    () => import('./englishPreview/preview_nouns_plural').then(module => module.PREVIEW_PREVIEW_NOUNS_PLURAL_QUESTIONS),
    () => import('./englishPreview/preview_nouns_gender').then(module => module.PREVIEW_PREVIEW_NOUNS_GENDER_QUESTIONS),
    () => import('./englishPreview/preview_adjectives').then(module => module.PREVIEW_PREVIEW_ADJECTIVES_QUESTIONS),
    () => import('./englishPreview/preview_adverbs').then(module => module.PREVIEW_PREVIEW_ADVERBS_QUESTIONS),
    () => import('./englishPreview/preview_pronouns_personal').then(module => module.PREVIEW_PREVIEW_PRONOUNS_PERSONAL_QUESTIONS),
    () => import('./englishPreview/preview_pronouns_possessive').then(module => module.PREVIEW_PREVIEW_PRONOUNS_POSSESSIVE_QUESTIONS),
    () => import('./englishPreview/preview_pronouns_reflexive').then(module => module.PREVIEW_PREVIEW_PRONOUNS_REFLEXIVE_QUESTIONS),
    () => import('./englishPreview/preview_pronouns_relative').then(module => module.PREVIEW_PREVIEW_PRONOUNS_RELATIVE_QUESTIONS),
    () => import('./englishPreview/preview_pronouns_demonstrative').then(module => module.PREVIEW_PREVIEW_PRONOUNS_DEMONSTRATIVE_QUESTIONS),
    () => import('./englishPreview/preview_pronouns_indefinite').then(module => module.PREVIEW_PREVIEW_PRONOUNS_INDEFINITE_QUESTIONS),
    () => import('./englishPreview/preview_verbs').then(module => module.PREVIEW_PREVIEW_VERBS_QUESTIONS),
    () => import('./englishPreview/preview_numbers').then(module => module.PREVIEW_PREVIEW_NUMBERS_QUESTIONS),
    () => import('./englishPreview/preview_conjunctions').then(module => module.PREVIEW_PREVIEW_CONJUNCTIONS_QUESTIONS),
    () => import('./englishPreview/preview_prepositions').then(module => module.PREVIEW_PREVIEW_PREPOSITIONS_QUESTIONS),
    () => import('./englishPreview/preview_modal_verbs').then(module => module.PREVIEW_PREVIEW_MODAL_VERBS_QUESTIONS),
    () => import('./englishPreview/preview_phrasal_verbs').then(module => module.PREVIEW_PREVIEW_PHRASAL_VERBS_QUESTIONS),
    () => import('./englishPreview/preview_passive_active').then(module => module.PREVIEW_PREVIEW_PASSIVE_ACTIVE_QUESTIONS),
    () => import('./englishPreview/preview_wh_questions').then(module => module.PREVIEW_PREVIEW_WH_QUESTIONS_QUESTIONS),
    () => import('./englishPreview/preview_question_tags').then(module => module.PREVIEW_PREVIEW_QUESTION_TAGS_QUESTIONS),
    () => import('./englishPreview/preview_reported_speech').then(module => module.PREVIEW_PREVIEW_REPORTED_SPEECH_QUESTIONS),
    () => import('./englishPreview/preview_so_too').then(module => module.PREVIEW_PREVIEW_SO_TOO_QUESTIONS),
    () => import('./englishPreview/preview_if_clauses').then(module => module.PREVIEW_PREVIEW_IF_CLAUSES_QUESTIONS),
    () => import('./englishPreview/preview_determiners').then(module => module.PREVIEW_PREVIEW_DETERMINERS_QUESTIONS),
    () => import('./englishPreview/preview_quantifiers').then(module => module.PREVIEW_PREVIEW_QUANTIFIERS_QUESTIONS),
    () => import('./englishPreview/preview_infinitive_gerund').then(module => module.PREVIEW_PREVIEW_INFINITIVE_GERUND_QUESTIONS),
    () => import('./englishPreview/preview_genitive').then(module => module.PREVIEW_PREVIEW_GENITIVE_QUESTIONS),
    () => import('./englishPreview/preview_grammar_classes').then(module => module.PREVIEW_PREVIEW_GRAMMAR_CLASSES_QUESTIONS)
  ];
  const sections = await Promise.all(loaders.map(load => load()));
  return sections.flat();
}
