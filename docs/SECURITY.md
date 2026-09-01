# Segurança

Relate vulnerabilidades de forma privada ao mantenedor da instância. Não inclua chaves, PDFs ou dados pessoais.

## Controles implementados

- Segredos exclusivamente no servidor.
- Prompt do sistema controlado pelo servidor.
- Validação de origem, método, schema e tamanho.
- Sessão curta em cookie `HttpOnly`, `SameSite=Strict`, restrita a `/api` e renovada pelo health check.
- Rate limit, timeout e request ID.
- CSP, `nosniff`, cache de assets e `no-store` nas APIs.
- Auditoria de dependências e gates no CI.

Sessões e rate limit em memória atendem uma instância. Múltiplas réplicas devem usar armazenamento compartilhado e autenticação da plataforma.
