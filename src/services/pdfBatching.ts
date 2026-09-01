export function createPdfImportBatches(rawText: string): string[] {
  const pageBlocks = rawText.split(/(?=--- PAGINA \d+ ---)/g).filter(Boolean).flatMap(page => {
    if (page.length <= 80_000) return [page];
    const parts: string[] = [];
    for (let offset = 0; offset < page.length; offset += 80_000) parts.push(`${offset ? '[CONTINUAÇÃO DA PÁGINA]\n' : ''}${page.slice(offset, offset + 80_000)}`);
    return parts;
  });
  const appendix = rawText.length > 30_000 ? rawText.slice(-30_000) : '';
  const batches: string[] = []; let current = '';
  for (const page of pageBlocks.length ? pageBlocks : [rawText]) {
    if (current && current.length + page.length > 85_000) { batches.push(current); current = ''; }
    current += `${current ? '\n\n' : ''}${page}`;
  }
  if (current) batches.push(current);
  return batches.map(batch => appendix && !batch.includes(appendix) ? `${batch}\n\n--- APÊNDICE DE GABARITO ---\n${appendix}` : batch);
}
