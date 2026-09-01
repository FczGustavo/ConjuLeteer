import type { QuestionMediaDescriptor } from '../types/importPipeline';
import { validateMediaRequest, type RawMediaRequest } from './questionMediaValidation';
export { validateMediaRequest, type RawMediaRequest } from './questionMediaValidation';

const DB_NAME = 'conjuletter-media-v1';
const STORE_NAME = 'assets';
const DB_VERSION = 1;
const MAX_EDGE = 1800;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('IndexedDB indisponível.'));
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) database.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Falha ao abrir o armazenamento de mídia.'));
  });
}

async function hashBlob(blob: Blob): Promise<string> {
  if (!globalThis.crypto?.subtle) return `${blob.size}-${blob.type}`;
  const digest = await crypto.subtle.digest('SHA-256', await blob.arrayBuffer());
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function saveQuestionMediaAsset(assetId: string, blob: Blob): Promise<void> {
  const database = await openDatabase();
  const record = { bytes: await blob.arrayBuffer(), type: blob.type || 'image/png' };
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(record, assetId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Falha ao salvar o recorte.'));
    transaction.onabort = () => reject(transaction.error || new Error('Gravação do recorte cancelada.'));
  });
  database.close();
}

export async function loadQuestionMediaAsset(assetId: string): Promise<Blob | undefined> {
  const database = await openDatabase();
  const result = await new Promise<Blob | undefined>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(assetId);
    request.onsuccess = () => {
      const value = request.result;
      if (value instanceof Blob) return resolve(value);
      if (value?.bytes instanceof ArrayBuffer) return resolve(new Blob([value.bytes], { type: typeof value.type === 'string' ? value.type : 'image/png' }));
      resolve(undefined);
    };
    request.onerror = () => reject(request.error || new Error('Falha ao carregar o recorte.'));
  });
  database.close();
  return result;
}

export function clearQuestionMediaAssets(): void {
  if (!globalThis.indexedDB) return;
  indexedDB.deleteDatabase(DB_NAME);
}

export async function canvasToOptimizedBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const encode = (type: string, quality?: number) => new Promise<Blob | undefined>(resolve => {
    if (typeof canvas.toBlob !== 'function') return resolve(undefined);
    canvas.toBlob(blob => resolve(blob || undefined), type, quality);
  });
  const encoded = (await encode('image/webp', 0.86)) || (await encode('image/png'));
  if (encoded) return encoded;
  const dataUrl = canvas.toDataURL('image/png');
  const response = await fetch(dataUrl);
  if (!response.ok) throw new Error('Falha ao codificar o recorte.');
  return response.blob();
}

export async function cropAndStoreQuestionMedia(
  sourceData: Uint8Array,
  requests: RawMediaRequest[],
  importId: string,
): Promise<{ media: QuestionMediaDescriptor[]; warnings: string[] }> {
  if (!requests.length) return { media: [], warnings: [] };
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;
  const loadingTask = pdfjs.getDocument({ data: sourceData.slice() });
  const documentProxy = await loadingTask.promise;
  const media: QuestionMediaDescriptor[] = [];
  const warnings: string[] = [];
  const pageCache = new Map<number, { canvas: HTMLCanvasElement; width: number; height: number }>();
  try {
    for (let index = 0; index < requests.length; index += 1) {
      const request = requests[index];
      const validation = validateMediaRequest(request, documentProxy.numPages);
      if (validation.length) { warnings.push(...validation); continue; }
      let rendered = pageCache.get(request.page);
      if (!rendered) {
        const page = await documentProxy.getPage(request.page);
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(3, Math.max(1.7, MAX_EDGE / Math.max(base.width, base.height)));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d', { alpha: false });
        if (!context) throw new Error('Canvas indisponível para recorte.');
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        rendered = { canvas, width: canvas.width, height: canvas.height };
        pageCache.set(request.page, rendered);
      }
      const padding = 0.008;
      const x = Math.max(0, request.crop.x - padding);
      const y = Math.max(0, request.crop.y - padding);
      const right = Math.min(1, request.crop.x + request.crop.width + padding);
      const bottom = Math.min(1, request.crop.y + request.crop.height + padding);
      const sx = Math.floor(x * rendered.width);
      const sy = Math.floor(y * rendered.height);
      const sw = Math.max(1, Math.ceil((right - x) * rendered.width));
      const sh = Math.max(1, Math.ceil((bottom - y) * rendered.height));
      const output = document.createElement('canvas');
      output.width = sw;
      output.height = sh;
      const outputContext = output.getContext('2d', { alpha: false });
      if (!outputContext) throw new Error('Canvas indisponível para o asset.');
      outputContext.drawImage(rendered.canvas, sx, sy, sw, sh, 0, 0, sw, sh);
      const blob = await canvasToOptimizedBlob(output);
      const hash = await hashBlob(blob);
      const assetId = `${importId}-${hash.slice(0, 20)}`;
      await saveQuestionMediaAsset(assetId, blob);
      media.push({
        id: `media-${index + 1}`,
        assetId,
        kind: request.kind,
        placement: request.placement,
        optionLetter: request.optionLetter,
        page: request.page,
        crop: request.crop,
        width: sw,
        height: sh,
        mimeType: blob.type === 'image/png' ? 'image/png' : blob.type === 'image/jpeg' ? 'image/jpeg' : 'image/webp',
        altText: request.altText.trim(),
        caption: request.caption?.trim() || undefined,
        source: request.source?.trim() || undefined,
        hash,
        confidence: request.confidence,
      });
      output.width = output.height = 1;
    }
  } finally {
    for (const rendered of pageCache.values()) rendered.canvas.width = rendered.canvas.height = 1;
    await loadingTask.destroy();
  }
  return { media, warnings: [...new Set(warnings)] };
}
