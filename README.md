# ConjuLetter

> Treino de Língua Portuguesa para concursos militares, com conjugação verbal, questões auditadas e importação inteligente de PDFs.

O **ConjuLetter** é uma aplicação educacional focada no domínio de verbos e nos assuntos de Português mais recorrentes em provas militares. O projeto combina estudo offline, um banco extraído de materiais em PDF e importação assistida por IA para novos acervos.

## Visão geral

| Área | O que oferece |
|---|---|
| **Tabelas** | Treino de 163 verbos em 11 paradigmas, tabela única, sessão multi-tempos, confrontos e imperativos |
| **Banco de Questões** | Filtros por idioma e assunto, pré-visualização, resolução e criação de listas persistentes |
| **Listas salvas** | Retomada do ponto exato, respostas persistidas, progresso, precisão e gabarito comparativo |

## Principais recursos

### Conjugação verbal

- Catálogo local com **163 verbos**, priorizados pela recorrência encontrada nos PDFs do projeto.
- **11 paradigmas** por verbo: indicativo, subjuntivo e imperativos afirmativo e negativo.
- Sessão Multi-Tempos com sorteio **sem repetição** durante o ciclo completo.
- Painel de progresso com verbos feitos, pendentes, resultado e número de tentativas.
- Modos especiais para confrontar pares problemáticos, como `ver × vir` e `prever × prover`.
- Funcionamento totalmente offline nas tabelas: nenhuma forma verbal é gerada por IA em tempo de execução.

### Banco de questões

- Acervo interno auditado com **531 questões públicas**, extraídas de **7 PDFs**.
- O assunto **Verbos** apresenta exclusivamente o caderno principal com **92 questões**.
- Textos de apoio, fontes, títulos, enunciados, alternativas e gabaritos passaram por limpeza e auditoria determinísticas.
- Listas persistentes ficam salvas no navegador e podem ser retomadas posteriormente.
- Ações para copiar somente o enunciado ou a questão completa.

#### Subdivisão de Inglês

O banco também inclui uma coleção independente de **1.500 questões de Inglês para Concursos Militares**, importada de `1500 Questões de Inglês para Concursos Militares.pdf`. A interface alterna entre **Português** e **Inglês** sem misturar filtros ou contagens.

- São **24 assuntos**, exatamente na ordem e com as quantidades do índice do PDF (Adjectives and Adverbs, Pronouns, Verbs, Modal Auxiliaries, Reading Skills and General Review, Translations e demais subdivisões).
- Os enunciados e alternativas são extraídos sem atribuir banca fictícia; a banca impressa é preservada quando existe e as traduções ficam identificadas como compilação.
- Cada item guarda a página da questão e a página exata do gabarito, localizado na seção `Answers` das páginas **190–196**.
- O importador determinístico restaura quebras de texto, marcadores de alternativa fora de ordem e o único caso em que o PDF repetia `a)` nas cinco alternativas. A ficha completa fica em [`reports/english-question-audit.md`](./reports/english-question-audit.md) e [`reports/english-question-audit.json`](./reports/english-question-audit.json).

### Importação de PDFs com IA

O único fluxo de IA disponível no produto é a importação de PDFs. Ela segue o pipeline:

```text
ler → estruturar → validar → salvar
```

- O PDF é lido e enviado para estruturação em JSON conforme o contrato do banco.
- A resposta é validada localmente antes de qualquer persistência.
- Gabaritos, alternativas e páginas são preservados para auditoria.
- A importação não cria uma banca ou questão fictícia: apenas organiza o material fornecido.
- Importações de PDF salvam os itens utilizáveis mesmo quando há ambiguidade; o modal lista avisos por questão e o Banco exibe o selo `Revisar` até a conferência.
- A chave da **OpenRouter** é configurada somente no servidor, em `.env.local`; a interface não oferece campo de chave nem de modelo e o navegador nunca recebe esses valores.

Para executar a importação localmente, copie `.env.local.example` para `.env.local` e preencha `OPENROUTER_API_KEY` (e, opcionalmente, `OPENROUTER_MODEL`) antes de iniciar o Vite.

## Qualidade e auditoria

O projeto possui verificações reproduzíveis para impedir regressões:

- **163 páginas de referência verbal** comparadas.
- **10.758 formas** confrontadas nos paradigmas exibidos.
- **531 questões**, **2.563 alternativas** e **7 gabaritos oficiais** verificados.
- **1.500 questões de Inglês**, **24 assuntos** e **1.500 gabaritos** do PDF militar conferidos individualmente, sem divergência.
- Auditoria de IDs, numeração, quantidade de alternativas, resposta única e padrões conhecidos de corrupção textual.
- Ficha individual das 531 questões em [`reports/question-audit.md`](./reports/question-audit.md) e versão legível por máquina em [`reports/question-audit.json`](./reports/question-audit.json).
- Testes visuais em desktop e viewport móvel, incluindo overflow e console do navegador.

Os PDFs em `lists/` e seus blocos oficiais de respostas são a fonte de verdade do banco. Para as conjugações, a fonte local é `src/data/canonicalVerbs.ts`.

## Tecnologias

- React 19
- TypeScript 6
- Vite 8
- Tailwind CSS 4
- Oxlint
- PDF.js
- Lucide React
- OpenRouter, somente na importação assistida de PDFs

## Executando localmente

### Pré-requisitos

- Node.js recente
- npm
- Python 3, apenas para os scripts de extração e auditoria dos PDFs

### Instalação

```bash
npm install
npm run dev
```

O Vite informará o endereço local da aplicação, normalmente `http://localhost:5173`.

### Build de produção

```bash
npm run build
npm run preview
```

## Comandos de verificação

```bash
# Qualidade do código
npm run lint

# Estrutura e formas críticas dos 163 verbos
npm run audit:verbs

# Integridade das 531 questões contra os 7 PDFs públicos
python src/scratch/audit_question_bank.py

# Regenerar as fichas individuais de auditoria
npm run audit:question-report

# Reimportar o PDF de Inglês (fonte padrão em C:\\Users\\gusta\\Downloads)
npm run import:english

# Conferir estrutura, páginas e 1.500 gabaritos de Inglês
npm run audit:english

# Comparação integral das formas verbais com a referência brasileira
python scripts/audit-verbs-ptbr.py
```

> A auditoria verbal externa realiza consultas de rede. As tabelas usadas pela aplicação continuam congeladas no bundle e funcionam offline.

## Estrutura do projeto

```text
ConjuLetter/
├── lists/                    # PDFs que originam o banco auditado
├── public/                   # favicon e recursos públicos
├── scripts/                  # geração e auditoria da base verbal
├── src/
│   ├── components/           # telas e componentes React
│   ├── data/                 # verbos, questões e conjuntos locais
│   ├── scratch/              # extração, limpeza e auditoria dos PDFs
│   ├── services/             # IA, importação e listas persistentes
│   ├── types/                # contratos TypeScript
│   └── utils/                # validação, formatação e SRS
├── PROJECT_CONTEXT.md        # memória técnica e histórico auditado
└── README.md
```

## Persistência e privacidade

- Configurações, listas, respostas, progresso e questões importadas são armazenados em `localStorage`.
- A importação de PDFs usa a rota server-side `/api/ai/import` do Vite para proteger a credencial; não há banco de dados remoto.
- As tabelas e o banco local não dependem de rede.
- Conteúdo só é enviado à OpenRouter quando o usuário importa um PDF e o servidor está configurado com uma chave válida.

## Estado conhecido

- Build e auditorias de dados estão aprovados.
- O lint não apresenta erros; há três avisos conhecidos de atualização de estado em efeitos React.
- O Vite alerta que o bundle principal é grande, principalmente porque os bancos de questões são embarcados estaticamente.
- Alguns scripts históricos em `src/scratch/` ainda podem conter caminhos locais e devem ser tratados como ferramentas de manutenção, não como API pública estável.

## Autoria

**ConjuLetter | By Gustavo_Fcs**

O histórico detalhado de decisões, correções e auditorias está em [`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md).
