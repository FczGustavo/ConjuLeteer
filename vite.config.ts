import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createAiImportHandler, createHealthHandler } from './server/aiImport.js'

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '');
  const aiImport = createAiImportHandler(environment);
  const health = createHealthHandler(environment);
  const apiPlugin: Plugin = {
    name: 'conjuletter-local-api',
    configureServer(server) {
      server.middlewares.use('/api/ai/import', (request, response, next) => void aiImport(request, response).catch(next));
      server.middlewares.use('/api/health', health);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/ai/import', (request, response, next) => void aiImport(request, response).catch(next));
      server.middlewares.use('/api/health', health);
    }
  };
  return { plugins: [react(), tailwindcss(), apiPlugin], server: { watch: { ignored: ['**/lists/**', '**/*.pdf', '**/scratch/**'] } } };
})
