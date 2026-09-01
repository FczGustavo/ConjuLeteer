import { describe, expect, it } from 'vitest';
import { createPdfImportBatches } from './pdfBatching';

describe('lotes de PDF', () => {
  it('preserva marcadores de todas as páginas em documentos grandes', () => {
    const pages=Array.from({length:12},(_,index)=>`--- PAGINA ${index+1} ---\n${String(index+1).repeat(10_000)}`);
    const source=pages.join('\n\n'); const batches=createPdfImportBatches(source);
    expect(batches.length).toBeGreaterThan(1);
    for(let page=1;page<=12;page+=1) expect(batches.some(batch=>batch.includes(`--- PAGINA ${page} ---`))).toBe(true);
    expect(batches.every(batch=>batch.length<=130_000)).toBe(true);
  });
  it('mantém documento pequeno em um lote',()=>expect(createPdfImportBatches('texto curto')).toEqual(['texto curto']));
  it('não descarta o trecho intermediário de uma página grande', () => {
    const source = `--- PAGINA 1 ---\n${'INICIO '.repeat(8_000)}\nMARCADOR-MEIO\n${'FIM '.repeat(8_000)}`;
    const batches = createPdfImportBatches(source);
    expect(batches.join('\n')).toContain('MARCADOR-MEIO');
  });
});
