import { describe, expect, it } from 'vitest';
import { ENGLISH_PREVIEW_MANIFEST } from './englishPreviewManifest';
import { ENGLISH_PREVIEW_SUBJECTS_CONFIG } from './englishPreviewSubjects';

describe('Inglês Preview audit manifest', () => {
  it('accounts for every source page, section and question position', () => {
    expect(ENGLISH_PREVIEW_MANIFEST.totalPages).toBe(394);
    expect(ENGLISH_PREVIEW_MANIFEST.expectedQuestions).toBe(2270);
    expect(ENGLISH_PREVIEW_MANIFEST.detectedQuestions).toBe(2270);
    expect(ENGLISH_PREVIEW_MANIFEST.expectedAnswerBlocks).toBe(40);
    expect(ENGLISH_PREVIEW_MANIFEST.sections).toHaveLength(40);
    expect(ENGLISH_PREVIEW_MANIFEST.sections.every(section => section.complete)).toBe(true);
    expect(ENGLISH_PREVIEW_MANIFEST.sections.reduce((total, section) => total + section.extracted, 0)).toBe(2270);
    expect(ENGLISH_PREVIEW_MANIFEST.sections.reduce((total, section) => total + section.duplicates, 0)).toBe(ENGLISH_PREVIEW_MANIFEST.duplicateCount);
    expect(ENGLISH_PREVIEW_MANIFEST.editorialTotals.status).toBe('passed');
    expect(ENGLISH_PREVIEW_MANIFEST.editorialTotals.declared).toEqual({
      questions: 2270,
      readingVocabulary: 967,
      grammar: 1303,
      subjects: 30,
      exams: 112,
    });
    expect(ENGLISH_PREVIEW_MANIFEST.editorialTotals.computed.answerPositions).toBe(2270);
    expect(ENGLISH_PREVIEW_MANIFEST.editorialTotals.computed.answerBlocks).toBe(40);
    expect(ENGLISH_PREVIEW_MANIFEST.editorialTotals.answerDuplicates).toHaveLength(0);
    expect(Object.keys(ENGLISH_PREVIEW_MANIFEST.extractionMethods)).toHaveLength(394);
    expect(ENGLISH_PREVIEW_MANIFEST.coverage).toBe(1);
    expect(ENGLISH_PREVIEW_MANIFEST.authorialRemovedCount).toBe(59);
    expect(ENGLISH_PREVIEW_MANIFEST.quality.rejected).toBe(59);
    expect(ENGLISH_PREVIEW_SUBJECTS_CONFIG).toHaveLength(40);
  });

  it('keeps deduplicated study count separate from the audit total', () => {
    expect(ENGLISH_PREVIEW_MANIFEST.publishedQuestions).toBe(2163);
    expect(ENGLISH_PREVIEW_MANIFEST.publishedQuestions).toBeLessThan(ENGLISH_PREVIEW_MANIFEST.detectedQuestions);
    expect(ENGLISH_PREVIEW_MANIFEST.duplicateCount).toBeGreaterThan(0);
    expect(ENGLISH_PREVIEW_MANIFEST.quality.quarantined).toBeGreaterThan(0);
    expect(ENGLISH_PREVIEW_MANIFEST.visualAudit.filter(item => item.assetIds.length > 0)).toHaveLength(62);
    expect(ENGLISH_PREVIEW_MANIFEST.visualAudit.filter(item => item.assetIds.length === 0)).toHaveLength(2);
  });

  it('loads only publishable records from isolated, lazy section modules', async () => {
    const { loadEnglishPreviewQuestions } = await import('./englishPreviewQuestionBank');
    const questions = await loadEnglishPreviewQuestions();
    expect(questions).toHaveLength(ENGLISH_PREVIEW_MANIFEST.publishedQuestions);
    expect(new Set(questions.map(question => question.id)).size).toBe(questions.length);
    expect(questions.every(question => question.id.startsWith('ep-029a154daaf7-'))).toBe(true);
    expect(questions.every(question => question.corpusId === 'english_preview')).toBe(true);
    expect(questions.every(question => !['quarantined', 'rejected'].includes(question.quality?.status ?? ''))).toBe(true);
    expect(questions.every(question => !question.authorialRemoved)).toBe(true);
    expect(questions.every(question => question.options.length === 4 || question.options.length === 5)).toBe(true);
    expect(questions.flatMap(question => question.media ?? []).every(media => media.caption === 'Recorte visual da questão' && !media.caption.includes('.pdf'))).toBe(true);
  });
});
