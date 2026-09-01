import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

export interface AiImportEnvironment { OPENROUTER_API_KEY?: string; OPENROUTER_MODEL?: string; PUBLIC_ORIGIN?: string }
const requestsByAddress = new Map<string, number[]>();
const importSessions = new Map<string, number>();
const WINDOW_MS = 10 * 60_000;
const SESSION_MS = 30 * 60_000;
const SYSTEM_PROMPT = `Transcreva fielmente questões educacionais e associe somente gabaritos explicitamente presentes. Não invente, complete ou corrija conteúdo. Preserve número, apoio, enunciado, alternativas, destaques e páginas. Retorne apenas {"questions":[{"questionNumber":1,"questionPage":1,"answerPage":10,"support":{"label":"","title":"","author":"","paragraphs":[],"source":""},"statement":"","options":[{"letter":"A","text":"","correct":true}],"correctLetter":"A","banca":"Concurso Militar","emphasisNotes":[]}]}. Inclua somente itens completos, com exatamente uma alternativa correta.`;

function sendJson(response: ServerResponse, status: number, value: unknown): void {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(value));
}
async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = []; let size = 0;
  for await (const chunk of request) { const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk); size += buffer.length; if (size > 180_000) throw new Error('TOO_LARGE'); chunks.push(buffer); }
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

export function createHealthHandler(environment: AiImportEnvironment) {
  return (_request: IncomingMessage, response: ServerResponse): void => {
    const token = randomUUID(); importSessions.set(token, Date.now() + SESSION_MS);
    const secure = environment.PUBLIC_ORIGIN?.startsWith('https://') ? '; Secure' : '';
    response.setHeader('Set-Cookie', `conjuletter_import_session=${token}; HttpOnly; SameSite=Strict; Path=/api; Max-Age=${SESSION_MS / 1000}${secure}`);
    sendJson(response, 200, { ok: true, aiImport: Boolean(environment.OPENROUTER_API_KEY) });
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
    const batch = Number(record.batch); const totalBatches = Number(record.totalBatches);
    if (rawText.length < 50 || rawText.length > 130_000 || !Number.isInteger(batch) || !Number.isInteger(totalBatches) || batch < 1 || totalBatches < batch || totalBatches > 50) return sendJson(response, 400, { error: 'Texto ou metadados do lote inválidos.', requestId });
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 45_000);
    try {
      const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', { method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'HTTP-Referer': environment.PUBLIC_ORIGIN || 'http://localhost', 'X-Title': 'ConjuLetter Question Bank Import' }, body: JSON.stringify({ model: environment.OPENROUTER_MODEL?.trim() || 'google/gemini-3.7-flash', temperature: 0, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: `Lote ${batch} de ${totalBatches}. Extraia todas as questões completas com gabarito explícito:\n\n${rawText}` }] }) });
      response.statusCode = upstream.status; response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json'); response.setHeader('Cache-Control', 'no-store'); response.end(await upstream.text());
    } catch (error) { sendJson(response, error instanceof Error && error.name === 'AbortError' ? 504 : 502, { error: error instanceof Error && error.name === 'AbortError' ? 'O provedor excedeu 45 segundos.' : 'Falha ao contactar o provedor.', requestId }); }
    finally { clearTimeout(timeout); }
  };
}
