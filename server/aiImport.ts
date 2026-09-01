import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';
import type { ImportJob, ImportManifest } from '../src/types/importPipeline.js';
import { cancelOwnedJob, clearExpiredJobs, createImportJob, getOwnedJob, updateOwnedJob } from './importJobs.js';

export interface AiImportEnvironment { OPENROUTER_API_KEY?: string; OPENROUTER_MODEL?: string; OPENROUTER_FALLBACK_MODEL?: string; PUBLIC_ORIGIN?: string }
const requestsByAddress = new Map<string, number[]>();
const importSessions = new Map<string, number>();
const WINDOW_MS = 10 * 60_000;
const SESSION_MS = 30 * 60_000;
let providerCircuitOpenUntil = 0;
const SYSTEM_PROMPT = `Você é o estágio editorial de um pipeline de importação. Reconstrua somente o que estiver comprovado no texto ou nas imagens recebidas. Não invente, complete, corrija ou resolva uma questão por conhecimento próprio. Separe support, statement, options, source e destaques. Leia o gabarito oficial em passagem independente e retorne answerEvidence com página e trecho literal. Para cada item retorne evidence (campo, página, coordenadas se disponíveis, texto original e método) e fieldConfidence (0 a 1 por campo). Se um campo ou o gabarito não tiver evidência suficiente, inclua o item mesmo assim para quarentena, nunca suponha um valor. Retorne somente JSON válido no formato {"questions":[{"questionNumber":1,"questionPage":1,"answerPage":10,"answerEvidence":"Gabarito 1-B","support":{"label":"","title":"","author":"","paragraphs":[],"source":""},"statement":"","options":[{"letter":"A","text":"","correct":false}],"correctLetter":"B","banca":"Concurso Militar","emphasisNotes":[],"evidence":[{"field":"answer","page":10,"originalText":"Gabarito 1-B","method":"independent-pass"}],"fieldConfidence":{"statement":{"confidence":0.99,"method":"native-text"},"answer":{"confidence":0.99,"method":"independent-pass"}}}]}.`;


function sendJson(response: ServerResponse, status: number, value: unknown): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(value));
}
async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of request) { const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk); size += buffer.length; if (size > 2_400_000) throw new Error('TOO_LARGE'); chunks.push(buffer); }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
function allowedOrigin(request: IncomingMessage, configured?: string): boolean {
  const origin = request.headers.origin; if (!origin) return true;
  if (configured) return origin === configured.replace(/\/$/, '');
  try { return new URL(origin).host === request.headers.host; } catch { return false; }
}
function rateLimited(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress || 'unknown'; const now = Date.now();
  const recent = (requestsByAddress.get(address) || []).filter(time => now - time < WINDOW_MS);
  if (recent.length >= 6) return true; recent.push(now); requestsByAddress.set(address, recent); return false;
}

function sessionToken(request: IncomingMessage): string | undefined {
  return request.headers.cookie?.split(';').map(part => part.trim()).find(part => part.startsWith('conjuletter_import_session='))?.split('=')[1];
}

function hasValidSession(request: IncomingMessage): boolean {
  const token = sessionToken(request); if (!token) return false;
  const expiresAt = importSessions.get(token);
  if (!expiresAt || expiresAt < Date.now()) { importSessions.delete(token); return false; }
  importSessions.set(token, Date.now() + SESSION_MS);
  return true;
}

function validSessionOwner(request: IncomingMessage): string | undefined {
  const token = sessionToken(request);
  return token && hasValidSession(request) ? token : undefined;
}

export function createHealthHandler(environment: AiImportEnvironment) {
  return (_request: IncomingMessage, response: ServerResponse): void => {
    const token = randomUUID(); importSessions.set(token, Date.now() + SESSION_MS);
    const secure = environment.PUBLIC_ORIGIN?.startsWith('https://') ? '; Secure' : '';
    response.setHeader('Set-Cookie', `conjuletter_import_session=${token}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${SESSION_MS / 1000}${secure}`);
    sendJson(response, 200, { ok: true, aiImport: Boolean(environment.OPENROUTER_API_KEY) });
  };
}

function parseJobId(url: string | undefined): string | undefined {
  const match = url?.match(/^(?:\/api\/import\/jobs|\/jobs)\/([^/?#]+)(?:$|[/?#])/u) || (url && !/^\/?$/u.test(url) && !url.startsWith('/api/') ? url.match(/^\/([^/?#]+)(?:$|[/?#])/u) : null);
  return match ? decodeURIComponent(match[1]) : undefined;
}

function jobAction(url: string | undefined): 'report' | 'publish' | undefined {
  if (/(?:\/|^)(?:jobs\/)?[^/]+\/report(?:[/?#]|$)/u.test(url || '') || /^(?:\/)?report(?:[/?#]|$)/u.test(url || '')) return 'report';
  if (/(?:\/|^)(?:jobs\/)?[^/]+\/publish(?:[/?#]|$)/u.test(url || '') || /^(?:\/)?publish(?:[/?#]|$)/u.test(url || '')) return 'publish';
  return undefined;
}

/** Job status facade. AI requests remain independently retryable and idempotent. */
export function createImportJobsHandler(environment: AiImportEnvironment = {}) {
  return async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const requestId = randomUUID(); response.setHeader('X-Request-Id', requestId);
    if (!allowedOrigin(request, environment.PUBLIC_ORIGIN)) return sendJson(response, 403, { error: 'Origem não permitida.', requestId });
    const owner = validSessionOwner(request);
    if (!owner) return sendJson(response, 401, { error: 'Sessão de importação ausente ou expirada.', requestId });
    clearExpiredJobs();
    const id = parseJobId(request.url);
    if (request.method === 'POST' && !id) {
      let payload: unknown;
      try { payload = await readJson(request); } catch { return sendJson(response, 400, { error: 'Metadados da importação inválidos.', requestId }); }
      const record = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
      const job = createImportJob(owner, {
        fileName: typeof record.fileName === 'string' ? record.fileName.slice(0, 240) : undefined,
        fileHash: typeof record.fileHash === 'string' ? record.fileHash.slice(0, 128) : undefined,
        totalPages: Number(record.totalPages),
        totalBatches: Number(record.totalBatches),
      });
      return sendJson(response, 201, { job, requestId });
    }
    if (!id) return sendJson(response, 404, { error: 'Job não encontrado.', requestId });
    const action = jobAction(request.url);
    if (action === 'report' && request.method === 'GET') {
      const job = getOwnedJob(id, owner);
      return job ? sendJson(response, 200, { job, report: { manifest: job.manifest, coverage: job.manifest.coverage, verifiedCount: job.verifiedCount, quarantinedCount: job.quarantinedCount }, requestId }) : sendJson(response, 404, { error: 'Job não encontrado.', requestId });
    }
    if (action === 'publish' && request.method === 'POST') {
      const job = getOwnedJob(id, owner);
      if (!job) return sendJson(response, 404, { error: 'Job não encontrado.', requestId });
      if (job.status !== 'completed') return sendJson(response, 409, { error: 'O job precisa estar concluído antes da publicação.', requestId });
      return sendJson(response, 200, { published: true, verifiedCount: job.verifiedCount, requestId });
    }
    if (request.method === 'GET') {
      const job = getOwnedJob(id, owner);
      return job ? sendJson(response, 200, { job, requestId }) : sendJson(response, 404, { error: 'Job não encontrado.', requestId });
    }
    if (request.method === 'DELETE') {
      const job = cancelOwnedJob(id, owner);
      return job ? sendJson(response, 202, { job, requestId }) : sendJson(response, 404, { error: 'Job não encontrado.', requestId });
    }
    if (request.method === 'PATCH') {
      let payload: unknown;
      try { payload = await readJson(request); } catch { return sendJson(response, 400, { error: 'Atualização inválida.', requestId }); }
      const record = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
      const allowedStatuses = new Set(['queued', 'processing', 'cancelling', 'completed', 'cancelled', 'failed']);
      const status = typeof record.status === 'string' && allowedStatuses.has(record.status) ? record.status as ImportJob['status'] : undefined;
      const manifest = record.manifest && typeof record.manifest === 'object' ? record.manifest as Partial<ImportManifest> : undefined;
      const job = updateOwnedJob(id, owner, {
        status,
        processedPages: Number.isFinite(Number(record.processedPages)) ? Math.max(0, Number(record.processedPages)) : undefined,
        completedBatches: Number.isFinite(Number(record.completedBatches)) ? Math.max(0, Number(record.completedBatches)) : undefined,
        verifiedCount: Number.isFinite(Number(record.verifiedCount)) ? Math.max(0, Number(record.verifiedCount)) : undefined,
        quarantinedCount: Number.isFinite(Number(record.quarantinedCount)) ? Math.max(0, Number(record.quarantinedCount)) : undefined,
        attempts: Number.isFinite(Number(record.attempts)) ? Math.max(0, Number(record.attempts)) : undefined,
        error: typeof record.error === 'string' ? record.error.slice(0, 500) : undefined,
        manifest,
      });
      return job ? sendJson(response, 200, { job, requestId }) : sendJson(response, 404, { error: 'Job não encontrado.', requestId });
    }
    response.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return sendJson(response, 405, { error: 'Método não permitido.', requestId });
  };
}

export function createAiImportHandler(environment: AiImportEnvironment) {
  return async (request: IncomingMessage, response: ServerResponse): Promise<void> => {
    const requestId = randomUUID(); response.setHeader('X-Request-Id', requestId);
    if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); return sendJson(response, 405, { error: 'Método não permitido.', requestId }); }
    if (!allowedOrigin(request, environment.PUBLIC_ORIGIN)) return sendJson(response, 403, { error: 'Origem não permitida.', requestId });
    if (!hasValidSession(request)) return sendJson(response, 401, { error: 'Sessão de importação ausente ou expirada.', requestId });
    if (rateLimited(request)) { response.setHeader('Retry-After', '600'); return sendJson(response, 429, { error: 'Limite temporário de importações atingido.', requestId }); }
    const apiKey = environment.OPENROUTER_API_KEY?.trim();
    if (!apiKey) return sendJson(response, 503, { error: 'Importação por IA não configurada.', requestId });
    let payload: unknown;
    try { payload = await readJson(request); } catch (error) { return sendJson(response, error instanceof Error && error.message === 'TOO_LARGE' ? 413 : 400, { error: 'Requisição inválida.', requestId }); }
    const record = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
    const rawText = typeof record.rawText === 'string' ? record.rawText.trim() : '';
    const rawImages = Array.isArray(record.images) ? record.images : [];
    if (rawImages.length > 2 || rawImages.some(value => typeof value !== 'string' || !/^data:image\/(?:jpeg|png);base64,/u.test(value))) return sendJson(response, 400, { error: 'Imagens de evidência inválidas.', requestId });
    const images = rawImages.filter((value): value is string => typeof value === 'string').slice(0, 2);
    const batch = Number(record.batch); const totalBatches = Number(record.totalBatches);
    if (rawText.length < 20 || rawText.length > 130_000 || images.some(image => image.length > 900_000) || !Number.isInteger(batch) || !Number.isInteger(totalBatches) || batch < 1 || totalBatches < batch || totalBatches > 50) return sendJson(response, 400, { error: 'Texto, imagens ou metadados do lote inválidos.', requestId });
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const userContent: Array<Record<string, unknown>> = [{ type: 'text', text: `Lote ${batch} de ${totalBatches}. Extraia todas as questões completas com gabarito explícito. Faça uma segunda leitura independente do gabarito e registre as evidências.\n\n${rawText}` }];
      for (const image of images) userContent.push({ type: 'image_url', image_url: { url: image } });
      const primaryModel = environment.OPENROUTER_MODEL?.trim() || 'google/gemini-3.7-flash';
      const fallbackModel = environment.OPENROUTER_FALLBACK_MODEL?.trim();
      const models = Date.now() < providerCircuitOpenUntil && fallbackModel ? [fallbackModel] : [primaryModel, ...(fallbackModel ? [fallbackModel] : [])];
      let upstream: Response | undefined;
      for (const model of models) {
        upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'HTTP-Referer': environment.PUBLIC_ORIGIN || 'http://localhost', 'X-Title': 'ConjuLetter Question Bank Import' }, body: JSON.stringify({ model, temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userContent }] }) });
        if (![429, 500, 502, 503, 504].includes(upstream.status) || model === fallbackModel) break;
        providerCircuitOpenUntil = Date.now() + 30_000;
      }
      if (!upstream) throw new Error('Nenhum provedor disponível.');
      response.statusCode = upstream.status; response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json'); response.setHeader('Cache-Control', 'no-store'); response.end(await upstream.text());
    } catch (error) { sendJson(response, error instanceof Error && error.name === 'AbortError' ? 504 : 502, { error: error instanceof Error && error.name === 'AbortError' ? 'O provedor excedeu 45 segundos.' : 'Falha ao contactar o provedor.', requestId }); }
    finally { clearTimeout(timeout); }
  };
}
