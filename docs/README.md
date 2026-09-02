# Documentação do ConjuLetter

Este diretório reúne os documentos necessários para preparar e operar uma versão pública do produto.

## Documentos ativos

- [Prontidão para release](./RELEASE_READINESS.md): decisão atual, riscos priorizados e critérios de liberação.
- [Estratégia de testes](./TESTING.md): cobertura existente, lacunas e matriz mínima de regressão.
- [Operação e implantação](./OPERATIONS.md): requisitos do ambiente, importação por IA, segurança e rollback.
- [Privacidade](./PRIVACY.md): dados locais e processamento de PDFs.
- [Segurança](./SECURITY.md): comunicação e controles implementados.
- [Inglês Preview](./ENGLISH_PREVIEW.md): cobertura auditada, política de quarentena,
  recortes visuais e procedimento de reauditoria do corpus provisório.
- Contratos do pipeline: [src/types/importPipeline.ts](../src/types/importPipeline.ts) documenta `ImportJob`, `PageArtifact`, evidências, confiança e manifesto compartilhados pelo cliente e pela API.

## Fontes de verdade relacionadas

- O [README principal](../README.md) descreve o produto e os comandos de desenvolvimento.
- A auditoria do banco de Português está em [reports/question-audit.md](../reports/question-audit.md).
- A auditoria do banco de Inglês está em [reports/english-question-audit.md](../reports/english-question-audit.md).
- O relatório inglês inclui a cobertura de créditos `examMetadata` (banca, ano/cargo quando impressos e seções sem esse dado), além das páginas e gabaritos.
- A auditoria integrada dos dois corpora está em [reports/english-corpora-audit.md](../reports/english-corpora-audit.md) (JSON para CI), incluindo deduplicação, recortes visuais e contratos do filtro Inglês unificado.
- [Auditoria de proveniência do banco de Inglês](./ENGLISH_PROVENANCE_AUDIT.md) registra os itens publicáveis, a quarentena preventiva e as evidências externas.
- O histórico técnico detalhado está em [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md).

Os relatórios de auditoria comprovam a integridade dos dados estáticos. Eles não substituem testes da interface, da persistência, da importação por IA ou do ambiente de produção. A importação segue a política “evidência ou quarentena”: a IA pode estruturar, mas não pode publicar uma questão sem prova do conteúdo e do gabarito.
