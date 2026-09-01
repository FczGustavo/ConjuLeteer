import { describe, expect, it } from 'vitest';
import { artifactsToText } from './pdfArtifacts';

describe('artefatos de PDF', () => {
  it('reconstrói texto mantendo a página de origem', () => {
    expect(artifactsToText([
      { pageNumber: 1, width: 600, height: 800, extractionMethod: 'native-text', nativeText: 'Questão 1', spans: [], blocks: [], layout: { lineCount: 0, columnCount: 1, hasTables: false }, quality: { characterCount: 9, wordCount: 2, replacementCharacters: 0, textCoverage: 1, needsOcr: false } },
      { pageNumber: 2, width: 600, height: 800, extractionMethod: 'native-text+vision', nativeText: '', imageDataUrl: 'data:image/jpeg;base64,x', spans: [], blocks: [], layout: { lineCount: 0, columnCount: 1, hasTables: false }, quality: { characterCount: 0, wordCount: 0, replacementCharacters: 0, textCoverage: 0, needsOcr: true } },
    ])).toContain('--- PAGINA 1 ---\nQuestão 1');
  });
});
