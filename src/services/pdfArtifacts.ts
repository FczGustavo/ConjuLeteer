import type { ImportManifest, PageArtifact, PageLayoutBlock, PageTextSpan } from '../types/importPipeline';

export interface PdfArtifactProgress {
  page: number;
  totalPages: number;
  method: PageArtifact['extractionMethod'];
}

export interface PdfArtifactResult {
  importId: string;
  fileName: string;
  fileHash: string;
  artifacts: PageArtifact[];
  manifest: ImportManifest;
  /** In-memory source used only to render verified crops after extraction. */
  sourceData: Uint8Array;
}

function abortIfNeeded(signal?: AbortSignal): void {
  if (signal?.aborted) throw new DOMException('Importação cancelada.', 'AbortError');
}

function countWords(value: string): number {
  return value.trim() ? value.trim().split(/\s+/u).length : 0;
}

function inferLayout(spans: PageTextSpan[], pageWidth: number, pageHeight: number): { blocks: PageLayoutBlock[]; layout: PageArtifact['layout'] } {
  const lines = new Map<number, PageTextSpan[]>();
  for (const span of spans) {
    const key = Math.round(span.y / 4) * 4;
    const current = lines.get(key) || [];
    current.push(span);
    lines.set(key, current);
  }
  const blocks: PageLayoutBlock[] = [...lines.entries()].sort((a, b) => b[0] - a[0]).map(([y, lineSpans]) => {
    const ordered = [...lineSpans].sort((a, b) => a.x - b.x);
    const text = ordered.map(span => span.text).join(' ').replace(/\s+/gu, ' ').trim();
    const x = Math.min(...ordered.map(span => span.x));
    const right = Math.max(...ordered.map(span => span.x + span.width));
    const height = Math.max(...ordered.map(span => span.height || 0));
    const bold = ordered.some(span => span.fontWeight === 'bold');
    const type: PageLayoutBlock['type'] = y > pageHeight * 0.88 ? 'header' : y < pageHeight * 0.12 ? 'footer' : bold && text.length < 140 ? 'heading' : /(?:gabarito|respostas?\s+oficiais?)/iu.test(text) ? 'answer-key' : /^\s*\d{1,3}[.)-]\s*/u.test(text) ? 'question' : 'paragraph';
    return { type, text, coordinates: { x, y, width: Math.max(0, right - x), height } };
  }).filter(block => block.text.length > 0);
  const leftColumn = spans.filter(span => span.x < pageWidth * 0.48).length;
  const rightColumn = spans.filter(span => span.x > pageWidth * 0.52).length;
  const columnCount = leftColumn > 3 && rightColumn > 3 ? 2 : 1;
  const hasTables = blocks.some(block => lineSpansHaveTableShape(spans, block.coordinates.y));
  return { blocks, layout: { lineCount: blocks.length, columnCount, hasTables } };
}

function lineSpansHaveTableShape(spans: PageTextSpan[], y: number): boolean {
  const line = spans.filter(span => Math.abs(span.y - y) < 4).sort((a, b) => a.x - b.x);
  return line.length >= 3 && line.some((span, index) => index > 0 && span.x - (line[index - 1].x + line[index - 1].width) > 36);
}

async function sha256(data: Uint8Array): Promise<string> {
  if (!globalThis.crypto?.subtle) return '';
  const digest = await globalThis.crypto.subtle.digest('SHA-256', data.slice().buffer as ArrayBuffer);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

function renderPage(page: { getViewport: (args: { scale: number }) => { width: number; height: number }; render: (args: any) => { promise: Promise<void> } }): Promise<{ dataUrl?: string; width: number; height: number }> {
  if (typeof document === 'undefined') return Promise.resolve({ width: 0, height: 0 });
  const viewport = page.getViewport({ scale: 1.35 });
  const canvas = document.createElement('canvas');
  canvas.width = Math.min(Math.ceil(viewport.width), 1800);
  canvas.height = Math.min(Math.ceil(viewport.height), 2400);
  const context = canvas.getContext('2d');
  if (!context) return Promise.resolve({ width: viewport.width, height: viewport.height });
  return page.render({ canvasContext: context, viewport }).promise.then(() => {
    let dataUrl: string | undefined;
    try { dataUrl = canvas.toDataURL('image/jpeg', 0.52); } catch { dataUrl = undefined; }
    canvas.width = 1;
    canvas.height = 1;
    return { dataUrl, width: viewport.width, height: viewport.height };
  });
}

/**
 * Reads every page as a structured artifact. Native text remains the source of
 * truth whenever it is healthy; low-text pages are rendered so the server can
 * use a vision/OCR pass instead of silently dropping a scan.
 */
export async function extractPdfArtifacts(
  file: File,
  signal?: AbortSignal,
  onProgress?: (progress: PdfArtifactProgress) => void,
): Promise<PdfArtifactResult> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
  const data = new Uint8Array(await file.arrayBuffer());
  const sourceData = data.slice();
  const fileHash = await sha256(data);
  const loadingTask = pdfjsLib.getDocument({ data });
  const documentProxy = await loadingTask.promise;
  if (documentProxy.numPages > 500) {
    await loadingTask.destroy();
    throw new Error('O PDF excede o limite de 500 páginas por importação.');
  }
  const artifacts: PageArtifact[] = [];
  const processedPages: number[] = [];
  const reprocessedPages: number[] = [];
  const rejectedPages: number[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
      abortIfNeeded(signal);
      const page = await documentProxy.getPage(pageNumber);
      const operatorList = await page.getOperatorList();
      const visualOperators = new Set([
        pdfjsLib.OPS.paintImageXObject,
        pdfjsLib.OPS.paintInlineImageXObject,
        pdfjsLib.OPS.paintImageMaskXObject,
        pdfjsLib.OPS.paintSolidColorImageMask,
      ]);
      const imageOperatorCount = operatorList.fnArray.filter(operator => visualOperators.has(operator)).length;
      const vectorPathCount = operatorList.fnArray.filter(operator => operator === pdfjsLib.OPS.constructPath).length;
      const content = await page.getTextContent();
      const spans: PageTextSpan[] = [];
      let nativeText = '';
      for (const rawItem of content.items) {
        const item = rawItem as { str?: string; transform?: number[]; width?: number; height?: number; fontName?: string; hasEOL?: boolean };
        if (typeof item.str !== 'string') continue;
        const transform = Array.isArray(item.transform) ? item.transform : [];
        const fontSize = Math.max(1, Math.abs(Number(transform[3] || transform[0] || item.height || 0)));
        spans.push({
          text: item.str,
          x: Number(transform[4] || 0),
          y: Number(transform[5] || 0),
          width: Number(item.width || 0),
          height: Number(item.height || fontSize),
          fontName: item.fontName,
          fontSize,
          fontWeight: /bold|black|heavy/iu.test(item.fontName || '') ? 'bold' : 'normal',
          italic: /italic|oblique/iu.test(item.fontName || ''),
          hasEOL: Boolean(item.hasEOL),
        });
        nativeText += item.str + (item.hasEOL ? '\n' : ' ');
      }
      nativeText = nativeText.replace(/[ \t]+\n/gu, '\n').replace(/\n{3,}/gu, '\n\n').trim();
      const viewport = page.getViewport({ scale: 1 });
      const replacementCharacters = (nativeText.match(/�/gu) || []).length;
      const characterCount = nativeText.length;
      const wordCount = countWords(nativeText);
      const needsOcr = characterCount < 80 || wordCount < 12 || replacementCharacters > Math.max(2, Math.floor(characterCount * 0.01));
      const hasVisualContent = imageOperatorCount > 0 || vectorPathCount >= 40;
      // Only pages requiring vision are rasterized. The original PDF bytes are
      // retained in memory so final assets can later be rendered as true crops.
      const rendered = needsOcr || hasVisualContent ? await renderPage(page) : { width: viewport.width, height: viewport.height };
      let imageDataUrl: string | undefined;
      if (needsOcr || hasVisualContent) {
        imageDataUrl = rendered.dataUrl;
        if (needsOcr) reprocessedPages.push(pageNumber);
        onProgress?.({ page: pageNumber, totalPages: documentProxy.numPages, method: 'native-text+vision' });
      } else {
        onProgress?.({ page: pageNumber, totalPages: documentProxy.numPages, method: 'native-text' });
      }
      const artifact: PageArtifact = {
        pageNumber,
        width: Number(viewport.width || 0),
        height: Number(viewport.height || 0),
        extractionMethod: needsOcr || hasVisualContent ? 'native-text+vision' : 'native-text',
        nativeText,
        spans,
        ...inferLayout(spans, Number(viewport.width || 0), Number(viewport.height || 0)),
        imageDataUrl,
        quality: {
          characterCount,
          wordCount,
          replacementCharacters,
          textCoverage: characterCount > 0 ? Math.min(1, wordCount / Math.max(1, characterCount / 6)) : 0,
          needsOcr,
          hasVisualContent,
        },
      };
      artifacts.push(artifact);
      processedPages.push(pageNumber);
      page.cleanup();
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    throw error;
  } finally {
    await loadingTask.destroy();
  }

  const importId = globalThis.crypto?.randomUUID?.() || `import-${Date.now()}`;
  const extractionMethods = Object.fromEntries(artifacts.map(artifact => [artifact.pageNumber, artifact.extractionMethod]));
  const manifest: ImportManifest = {
    importId,
    fileName: file.name,
    fileHash,
    totalPages: documentProxy.numPages,
    receivedPages: artifacts.map(artifact => artifact.pageNumber),
    processedPages,
    reprocessedPages,
    rejectedPages,
    extractionMethods,
    questionCountDetected: 0,
    verifiedCount: 0,
    quarantinedCount: 0,
    coverage: documentProxy.numPages ? processedPages.length / documentProxy.numPages : 0,
  };
  return { importId, fileName: file.name, fileHash, artifacts, manifest, sourceData };
}

export function artifactsToText(artifacts: PageArtifact[]): string {
  return artifacts.map(artifact => `--- PAGINA ${artifact.pageNumber} ---\n${artifact.nativeText}`.trim()).join('\n\n');
}
