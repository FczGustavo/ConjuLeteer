# Prontidão para release

Revisão atualizada em **1º de setembro de 2026** para a versão **1.0.0**.

## Decisão atual

**APTO PARA RELEASE CONTROLADO**, condicionado à configuração de `PUBLIC_ORIGIN`, `OPENROUTER_API_KEY` e a um smoke test de importação no ambiente final. O acervo local, tabelas e listas independem da integração externa.

## Bloqueadores resolvidos

- Runtime Node com `/api/health`, importação, arquivos estáticos, CSP e cache.
- Contrato fechado da API, sessão HttpOnly/SameSite, prompt server-side, validação, rate limit, request ID e timeout.
- PDFs processados integralmente em lotes, com apêndice de gabarito e deduplicação.
- UUID único por importação.
- Persistência agrupada, erro de quota visível e validação/migração de listas.
- Estado “não sei” isolado entre sessões e reset limitado a `conjuletter_*`.
- Error Boundary, limpeza de timers e melhorias de diálogo/foco/Escape.
- Carregamento sob demanda; Home com aproximadamente **101 KiB gzip**.
- Auditoria pós-normalização e CI com unitários, cobertura e Playwright.

## Evidências executadas

| Verificação | Resultado |
|---|---|
| `npm run check` | Aprovado |
| Unitários | 16/16 |
| Cobertura | 63,87% statements; 49,04% branches; 72,35% functions; 67,61% lines |
| E2E | 11 aprovados; 9 skips intencionais de testes exclusivos do Chromium |
| Evidência visual | 16 capturas: 4 temas × 1440/1024/768/390 px em `reports/visual/` |
| Verbos | 163 verbos e 11 paradigmas |
| Português | 531 questões e 7 PDFs |
| Inglês | 1.500 questões, 24 tópicos, zero divergências |
| Pós-normalização | 2.031 questões; 79 mudanças registradas; zero alteração de estrutura/gabarito |
| Dependências de produção | zero vulnerabilidades conhecidas |
| Servidor local de produção | Home 200, health 200 + cookie; sem sessão 401; payload inválido autenticado 400; CSP presente |

## Pendências específicas do ambiente final

1. Definir o domínio em `PUBLIC_ORIGIN`.
2. Configurar a chave e testar uma importação pequena e uma grande, acompanhando custo e latência.
3. Publicar o canal de contato do operador em Privacidade e Segurança.
4. Construir a imagem no pipeline; Docker não estava instalado nesta máquina.

O Banco ainda possui um chunk de aproximadamente 918 KiB gzip, carregado somente quando essa área é aberta. A próxima otimização recomendada é separar dados por idioma e assunto.
