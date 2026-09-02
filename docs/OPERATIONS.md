# Operação e implantação

## Arquitetura necessária

O front-end Vite é servido pelo runtime Node em `server/index.ts`. O processo entrega `dist/`, `/api/health`, o job tracker `/api/import/jobs` e `/api/ai/import`. Execute `npm run build && npm start` ou use o `Dockerfile`. Um upload isolado de `dist/` mantém o acervo local, mas não oferece importação por IA.

Variáveis obrigatórias no servidor:

```text
OPENROUTER_API_KEY
OPENROUTER_MODEL (opcional)
OPENROUTER_FALLBACK_MODEL (opcional; ativa fallback/circuit breaker em 429/5xx)
PUBLIC_ORIGIN (origem HTTPS exata)
```

Nunca usar prefixo `VITE_` para segredos. Não registrar prompts, PDFs, respostas integrais da IA ou a chave.

## Controles obrigatórios da API

- Autenticação ou token de sessão, rate limit e limite de custo.
- A sessão atual é emitida por `/api/health` em cookie `HttpOnly`/`SameSite=Strict`; em múltiplas réplicas, substitua o armazenamento em memória por um backend compartilhado.
- Schema estrito da requisição; o cliente não deve controlar mensagens de sistema.
- Limites de bytes, páginas e questões por operação.
- Timeout e cancelamento do upstream.
- Tratamento explícito de 400, 413, 429 e 5xx.
- Jobs idempotentes por sessão, com progresso, cancelamento, relatório e publicação explícita; falhas de item vão para quarentena e nunca entram no banco de estudo.
- Cada página recebe manifesto, método (`native-text` ou `native-text+vision`), métricas e hash. Páginas com pouco texto, imagens incorporadas ou alta densidade vetorial recebem uma miniatura temporária para a passagem multimodal.
- Elementos visuais retornam coordenadas normalizadas; o navegador reabre o PDF e persiste somente recortes WebP validados no IndexedDB. Página inteira, recorte fora dos limites, confiança inferior a 0,92 e imagem exigida mas ausente provocam quarentena.
- CORS restrito, cabeçalhos de segurança e logs com request ID sem conteúdo educacional.
- Métricas de latência, taxa de erro, itens importados, itens com aviso e custo.

## Corpus Inglês Preview

O corpus provisório é distribuído separadamente do Inglês público. A geração
reprodutível usa `npm run import:english-preview` e a publicação só considera
itens `verified` ou `warning`; quarentenas, rejeições e duplicatas permanecem
no manifesto técnico. O relatório completo fica em
`reports/english-preview-audit.{md,json}` e a política editorial em
[ENGLISH_PREVIEW.md](./ENGLISH_PREVIEW.md). Os módulos de assunto são
carregados dinamicamente e os 62 recortes visuais publicados são arquivos
WebP individuais; nenhuma página completa do PDF é usada como imagem.

## Checklist de implantação

1. Rodar todos os comandos de [TESTING.md](./TESTING.md).
2. Confirmar que `.env.local` e chaves não estão no bundle nem no Git.
3. Testar `/api/import/jobs` (criar, atualizar, consultar, cancelar e relatório) e `/api/ai/import` no domínio final com um PDF pequeno, um scan e um grande.
4. Verificar carregamento direto e recarga de cada área suportada.
5. Testar migração e recuperação de `localStorage` com dados reais anonimizados.
6. Testar IndexedDB indisponível/quota excedida e confirmar que nenhuma questão dependente de imagem é publicada sem o asset.
7. Confirmar CSP, cache dos assets com hash e `Cache-Control: no-store` na API.
8. Registrar versão, commit, horário, responsável e artefatos implantados.
9. Fazer smoke test dos quatro temas, Tabelas, Banco, Listas e Configurações.

## Rollback

- Manter o artefato anterior e a configuração de runtime disponíveis.
- Não alterar ou apagar chaves persistidas sem uma migração reversível.
- Se a API falhar, desabilitar somente a importação e manter o acervo local acessível.
- Após rollback, validar abertura de listas existentes e registrar a causa do incidente.

## Privacidade e retenção

O produto armazena progresso localmente e envia conteúdo à OpenRouter somente durante uma importação. A interface pública deve informar esse envio antes da confirmação, identificar o provedor e esclarecer que o material submetido precisa estar autorizado para processamento. Definir e publicar política de privacidade, termos de uso e canal de contato antes de aceitar uploads públicos.
