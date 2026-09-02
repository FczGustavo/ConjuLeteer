# Estratégia de testes

## Cobertura atual

O projeto possui build TypeScript, lint, Vitest, cobertura V8, Playwright e auditorias determinísticas dos bancos antes e depois da normalização. O gate completo é `npm run check`; o navegador é validado por `npm run test:e2e` e no CI.

O módulo que coordena PDF.js/canvas (`src/services/pdfArtifacts.ts`) fica fora da métrica unitária porque worker e rasterização real não executam em jsdom; sua cobertura é feita na matriz Playwright e no smoke test do ambiente final.

## Suíte mínima antes do release

### Testes unitários

- `questionSupport`: fonte fragmentada, fonte já normalizada, falsos positivos de sobrenomes em caixa alta, marcação ausente, marcação já presente, palavras repetidas, acentos, pontuação e múltiplos destaques.
- `textFormatter`: HTML permitido, Markdown, conteúdo malformado, espaços em hífens e proteção contra injeção.
- `srsEngine`: JSON corrompido, números não finitos, datas inválidas, migração de tema, limites de domínio e falha de armazenamento.
- `questionListService`: migração, deduplicação, página fora do intervalo, `pageSize` inválido, quota excedida e listas parcialmente corrompidas.
- importador: resposta vazia, JSON inválido, letras duplicadas, gabarito ausente, 4/5 alternativas, páginas inválidas, IDs estáveis, evidência/confiança ausentes e isolamento em quarentena.
- banco inglês: os 1.500 cabeçalhos da fonte são relidos e comparados item a item com `examMetadata`; a suíte exige 1.320 créditos verificáveis, 180 itens sem banca/ano em quarentena e nenhum crédito inferido.
- Inglês Preview: 59 questões autorais são rejeitadas e redigidas, 45 duplicatas ficam apenas no manifesto, bancas pequenas são agrupadas apenas no seletor, ITA/ITA-SP e EEAR/EEAR BCT são canônicos no filtro e as tags preservam a banca impressa.
- pipeline multimodal: páginas nativas, scans sem camada de texto, páginas com caracteres corrompidos, hash repetido, manifesto de cobertura, renderização e cancelamento entre páginas.
- mídia de questões: limites normalizados, rejeição de página inteira, confiança mínima, associação a alternativas, recorte WebP, hash, IndexedDB e quarentena quando a figura mencionada estiver ausente.

### Testes de componentes

- Troca de tema com prévia, salvar, sair sem salvar e migração de `alexandria`.
- Alternativa selecionada, eliminada, confirmada, correta e incorreta.
- “I have no idea”: texto permanece em inglês, comportamento de gabarito e métrica conforme a especificação, desmarcação e persistência.
- Transição lista salva → filtros → nova prévia sem herdar respostas ou marcas.
- Filtros Português/Inglês, assunto, pendentes, acertos, erros e “não sei”.
- Paginação em zero itens, 1, 5, 10, 20 e “Todas”; redução do conjunto enquanto a página atual deixa de existir.
- Copiar questão com e sem permissão da Clipboard API e fallback legado.
- Importação: progresso, cancelamento, erro recuperável, aviso editorial e sucesso.
- Recortes visuais: imagem responsiva, legenda/fonte, texto alternativo, zoom, Escape, restauração de foco e asset ausente.
- Jobs de importação: criar/status/patch/cancelar/relatório/publicar, isolamento por cookie de sessão e ausência de vazamento entre sessões.

### Testes de navegador

- Fluxo completo em Chromium, Firefox e WebKit, desktop e 390 px.
- Navegação apenas por teclado, foco visível, Escape, restauração de foco e leitor de tela nos diálogos.
- Recarga e retomada de lista; duas abas alterando a mesma lista; armazenamento indisponível ou cheio.
- API em produção: 400, 401/403, 413, 429, timeout, 5xx e resposta parcial.
- Quatro temas em Home, Tabelas, Banco, Listas, Importação e Configurações, com `prefers-reduced-motion`.

## Casos de regressão dos bancos

As auditorias existentes devem continuar no CI:

```bash
npm run lint
npm run build
npm run audit:verbs
npm run audit:questions
npm run audit:english
npm run audit:english-preview
npm run audit:english-corpora
```

Para o corpus provisório, `npm run audit:english-preview` valida 394 páginas,
2.270 posições, 40 blocos de gabarito, ausência de respostas órfãs, alternativas
válidas e existência dos recortes publicados. A auditoria visual também confirma
que cada ativo publicado é um recorte semântico útil (charge, tirinha, mapa,
anúncio ou diagrama), descartando fotografias decorativas. A saída completa fica em
`reports/english-preview-audit.{md,json}`; itens em quarentena são esperados e
não entram no conjunto estudável.

`npm run audit:normalized` audita o banco **depois** de `normalizeQuestionSupport` e grava o diff revisável em `reports/normalized-question-audit.json`.

`npm run audit:english-corpora` reconcilia os dois PDFs (páginas, posições,
gabaritos, metadados, duplicatas, recortes, filtros canônicos e contratos da
interface unificada) e grava `reports/english-corpora-audit.{md,json}`.

## Critérios de aprovação

- Zero erro de build, lint ou auditoria.
- Zero teste instável e zero erro no console nos fluxos críticos.
- Nenhuma perda silenciosa de questão ou progresso.
- Cada questão inglesa publicada possui crédito rastreável na fonte original; quando a fonte não imprime banca/ano, o relatório identifica explicitamente a seção de compilação.
- Nenhum item sem evidência independente do gabarito é publicado; itens ambíguos permanecem em `quarantined`.
- Cobertura de branches elevada nas rotinas de parsing, normalização e persistência; o percentual exato deve ser definido após a primeira linha de base, sem substituir testes de cenários.
- Evidência visual dos quatro temas em 1440, 1024, 768 e 390 px.
- As 16 capturas reproduzíveis ficam em `reports/visual/` e são regeneradas pelo teste visual Playwright.
- Orçamento obrigatório: até 250 kB gzip para a Home; o gate atual mede aproximadamente 101 kB. Bancos e PDF.js são carregados somente quando necessários.
