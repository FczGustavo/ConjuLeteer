import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { createAiImportHandler, createHealthHandler } from './aiImport.js';
const port = Number(process.env.PORT || 4173); const dist = join(process.cwd(), 'dist'); const aiImport = createAiImportHandler(process.env); const health = createHealthHandler(process.env);
const types: Record<string,string> = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.svg':'image/svg+xml' };
createServer(async (request,response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (url.pathname === '/api/health') return health(request,response);
  if (url.pathname === '/api/ai/import') return aiImport(request,response);
  if (!['GET','HEAD'].includes(request.method || '')) { response.statusCode=405; response.end(); return; }
  const requested=normalize(url.pathname).replace(/^(\.\.[/\\])+/, ''); let file=join(dist,requested==='/'?'index.html':requested);
  if(!file.startsWith(dist)||!existsSync(file)||statSync(file).isDirectory()) file=join(dist,'index.html');
  response.setHeader('Content-Type',types[extname(file)]||'application/octet-stream'); response.setHeader('Cache-Control',file.endsWith('index.html')?'no-cache':'public, max-age=31536000, immutable'); response.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self'; script-src 'self'; font-src 'self' data:");
  if(request.method==='HEAD'){response.end();return;} createReadStream(file).pipe(response);
}).listen(port,()=>console.log(`ConjuLetter disponível na porta ${port}.`));
