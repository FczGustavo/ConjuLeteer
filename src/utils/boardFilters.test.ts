import { describe, expect, it } from 'vitest';
import type { QuestionBankItem } from '../data/questionBank';
import {
  PREVIEW_SMALL_BOARD_KEY,
  buildBoardFilterOptions,
  canonicalPreviewBoard,
  matchesBoardFilter,
} from './boardFilters';

function question(board: string, corpusId?: 'english_preview'): QuestionBankItem {
  return {
    id: board,
    corpusId,
    subjectId: 'preview_articles' as QuestionBankItem['subjectId'],
    subjectTitle: 'Articles',
    listId: 'english_preview',
    listTitle: 'Inglês Preview',
    questionNumber: 1,
    statement: 'Statement',
    options: [],
    correctLetter: 'A',
    banca: board,
    examMetadata: { board, source: 'pdf-header' },
    language: 'en',
    quality: { status: 'verified', warnings: [] },
  };
}

describe('filtros agrupados de bancas do Preview', () => {
  it('unifica variações de EEAR e agrupa bancas com menos de cinco itens', () => {
    const records = [
      question('EEAr 1.', 'english_preview'),
      question('EEAr BCT 2.', 'english_preview'),
      question('ACAPLAM', 'english_preview'),
      question('AMAUC', 'english_preview'),
    ];
    const options = buildBoardFilterOptions(records, 'en');
    expect(canonicalPreviewBoard('EEAr 1.')).toBe('EEAr');
    expect(canonicalPreviewBoard('EEAr BTC 1.')).toBe('EEAr BCT');
    expect(options.find(option => option.key === 'EEAr')?.count).toBe(1);
    expect(options.find(option => option.key === 'EEAr BCT')?.count).toBe(1);
    const small = options.find(option => option.key === PREVIEW_SMALL_BOARD_KEY);
    expect(small).toMatchObject({ count: 2 });
    expect(matchesBoardFilter(records[2], PREVIEW_SMALL_BOARD_KEY, 'en', options)).toBe(true);
    expect(matchesBoardFilter(records[0], PREVIEW_SMALL_BOARD_KEY, 'en', options)).toBe(false);
    expect(matchesBoardFilter(records[0], 'EEAr', 'en', options)).toBe(true);
  });

  it('mantém bancas do banco Inglês atual como opções exatas', () => {
    const records = [question('ITA'), question('ITA-SP'), question('AFA')];
    const options = buildBoardFilterOptions(records, 'en');
    expect(canonicalPreviewBoard('ITA-SP')).toBe('ITA');
    expect(options.map(option => option.key)).toEqual(['ITA', 'AFA']);
    expect(options.find(option => option.key === 'ITA')?.count).toBe(2);
    expect(matchesBoardFilter(records[0], 'ITA', 'en', options)).toBe(true);
    expect(matchesBoardFilter(records[1], 'ITA', 'en', options)).toBe(true);
  });
});
