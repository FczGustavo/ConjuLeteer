# Documentação do ConjuLetter

Este diretório reúne os documentos necessários para preparar e operar uma versão pública do produto.

## Documentos ativos

- [Prontidão para release](./RELEASE_READINESS.md): decisão atual, riscos priorizados e critérios de liberação.
- [Estratégia de testes](./TESTING.md): cobertura existente, lacunas e matriz mínima de regressão.
- [Operação e implantação](./OPERATIONS.md): requisitos do ambiente, importação por IA, segurança e rollback.
- [Privacidade](./PRIVACY.md): dados locais e processamento de PDFs.
- [Segurança](./SECURITY.md): comunicação e controles implementados.

## Fontes de verdade relacionadas

- O [README principal](../README.md) descreve o produto e os comandos de desenvolvimento.
- A auditoria do banco de Português está em [reports/question-audit.md](../reports/question-audit.md).
- A auditoria do banco de Inglês está em [reports/english-question-audit.md](../reports/english-question-audit.md).
- O histórico técnico detalhado está em [PROJECT_CONTEXT.md](../PROJECT_CONTEXT.md).

Os relatórios de auditoria comprovam a integridade dos dados estáticos. Eles não substituem testes da interface, da persistência, da importação por IA ou do ambiente de produção.
