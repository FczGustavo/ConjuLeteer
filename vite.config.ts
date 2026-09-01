import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

type AiImportEnvironment = {
  OPENROUTER_API_KEY?: string;
  OPENROUTER_MODEL?: string;
};

async function readRequestBody(request: import('node:http').IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 2_000_000) throw new Error('Payload da importação excede o limite de 2 MB.');
    chunks.push(buffer);
  }
  return Buffer.concat(chunks).toString('utf8');
}

function aiImportServerPlugin(environment: AiImportEnvironment): Plugin {
  const handleRequest = async (
    request: import('node:http').IncomingMessage,
    response: import('node:http').ServerResponse
  ) => {
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'POST') {
      response.statusCode = 405;
      response.setHeader('Allow', 'POST');
      response.end(JSON.stringify({ error: 'Método não permitido.' }));
      return;
    }

    const apiKey = environment.OPENROUTER_API_KEY?.trim();
    if (!apiKey) {
      response.statusCode = 503;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'OPENROUTER_API_KEY não configurada no servidor (.env.local).' }));
      return;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(await readRequestBody(request));
    } catch (error) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'JSON inválido.' }));
      return;
    }

    const messages = payload && typeof payload === 'object' && 'messages' in payload
      ? (payload as { messages?: unknown }).messages
      : undefined;
    if (!Array.isArray(messages) || messages.length === 0) {
      response.statusCode = 400;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: 'A importação precisa enviar as mensagens para análise.' }));
      return;
    }

    try {
      const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://conjuletter.local',
          'X-Title': 'ConjuLetter Question Bank Import'
        },
        body: JSON.stringify({
          model: environment.OPENROUTER_MODEL?.trim() || 'google/gemini-3.7-flash',
          messages,
          temperature: 0,
          response_format: { type: 'json_object' }
        })
      });
      response.statusCode = upstream.status;
      // `fetch` already decompresses the upstream body. Forward only safe
      // response metadata so clients do not receive stale gzip/cookie headers.
      const contentType = upstream.headers.get('content-type');
      if (contentType) response.setHeader('Content-Type', contentType);
      for (const header of ['x-request-id', 'x-generation-id', 'x-provider-name']) {
        const value = upstream.headers.get(header);
        if (value) response.setHeader(header, value);
      }
      response.end(await upstream.text());
    } catch (error) {
      response.statusCode = 502;
      response.setHeader('Content-Type', 'application/json');
      response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Falha ao contactar o servidor de IA.' }));
    }
  };

  return {
    name: 'conjuletter-ai-import-server',
    configureServer(server) {
      server.middlewares.use('/api/ai/import', (request, response, next) => {
        void handleRequest(request, response).catch(next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ai/import', (request, response, next) => {
        void handleRequest(request, response).catch(next);
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '') as AiImportEnvironment;
  return {
    plugins: [
      react(),
      tailwindcss(),
      aiImportServerPlugin(environment)
    ],
    server: {
      watch: {
        ignored: ['**/lists/**', '**/*.pdf', '**/scratch/**']
      }
    }
  };
})
