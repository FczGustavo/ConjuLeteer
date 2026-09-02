# Prontidão para release

Revisão atualizada em **2 de setembro de 2026** para a versão **1.0.0**.

## Decisão atual

**APTO PARA RELEASE CONTROLADO**, condicionado à configuração de `PUBLIC_ORIGIN`, `OPENROUTER_API_KEY` e a um smoke test de importação no ambiente final. O acervo local, tabelas e listas independem da integração externa. A garantia do importador é operacional: nenhum item sem evidência suficiente é publicado; casos ambíguos são isolados automaticamente.

## Bloqueadores resolvidos

- Runtime Node com `/api/health`, importação, arquivos estáticos, CSP e cache.
- Contrato fechado da API, sessão HttpOnly/SameSite, prompt server-side, validação, rate limit, request ID e timeout.
- PDFs processados integralmente em lotes, com apêndice de gabarito e deduplicação.
- Pipeline multimodal com manifesto por página, coordenadas de spans, hash, renderização visual de páginas de baixa cobertura, evidência por campo e confiança mínima do gabarito.
- Job tracker com progresso, cancelamento, relatório e publicação; itens abaixo dos limiares ficam em quarentena persistente.
- UUID único por importação.
- Persistência agrupada, erro de quota visível e validação/migração de listas.
- Estado “não sei” isolado entre sessões e reset limitado a `conjuletter_*`.
- Error Boundary, limpeza de timers e melhorias de diálogo/foco/Escape.
- Carregamento sob demanda; Home com aproximadamente **101 KiB gzip**.
- Auditoria pós-normalização e CI com unitários, cobertura e Playwright.
- Auditoria editorial do Inglês relê os 1.500 cabeçalhos no PDF: 1.320 bancas com ano, 180 créditos de seção sem ano impresso e zero cargos inferidos.
- Corpus **Inglês Preview** isolado: 394 páginas, 2.270 posições, 40 pares de gabarito, 2.163 itens estudáveis (2.126 verificadas + 37 com aviso), 59 questões autorais rejeitadas, 45 duplicatas mantidas no manifesto, 62 recortes visuais úteis e 48 itens em quarentena (duas referências visuais sem ativo inequívoco e um gabarito incompatível; as demais são duplicatas).

## Evidências executadas

| Verificação | Resultado |
|---|---|
| `npm run check` | Aprovado |
| Unitários | 42/42 em 12 arquivos (inclui Preview, filtros de bancas, listas mistas e contrato de artefatos) |
| Cobertura | 71,32% statements; 54,17% branches; 82,37% functions; 76,79% lines |
| E2E | 23 aprovados; 9 skips intencionais de testes exclusivos do Chromium |
| Evidência visual | 16 capturas: 4 temas × 1440/1024/768/390 px em `reports/visual/` |
| Verbos | 163 verbos e 11 paradigmas |
| Português | 531 questões e 7 PDFs |
| Inglês | 1.500 questões, 24 tópicos, zero divergências; créditos auditados (1.320 banca/ano + 180 seção) |
| Inglês Preview | 2.270 posições auditadas; 2.163 publicáveis; 2.126 verificadas, 37 com aviso, 59 autorais rejeitadas, 48 em quarentena; 62 recortes WebP úteis |
| Pós-normalização | 2.031 questões; 242 mudanças editoriais registradas; zero alteração de estrutura/gabarito |
| Dependências de produção | zero vulnerabilidades conhecidas |
| Servidor local de produção | Home 200, health 200 + cookie; sem sessão 401; payload inválido autenticado 400; CSP presente |
| Job API | Criar, atualizar, consultar e relatório validados com sessão isolada |

## Pendências específicas do ambiente final

1. Definir o domínio em `PUBLIC_ORIGIN`.
2. Configurar a chave e testar uma importação pequena e uma grande, acompanhando custo e latência.
3. Publicar o canal de contato do operador em Privacidade e Segurança.
4. Construir a imagem no pipeline; Docker não estava instalado nesta máquina.

O Banco ainda possui um chunk de aproximadamente 953 KiB gzip, carregado somente quando essa área é aberta; o Inglês Preview permanece em módulos separados e lazy. A próxima otimização recomendada é separar também os dados legados por idioma e assunto.
