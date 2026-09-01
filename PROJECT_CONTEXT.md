# ConjuLetter - contexto vivo do projeto

> Memoria operacional obrigatoria. Este arquivo deve ser lido antes de qualquer alteracao e auditado depois de cada rodada de mudancas.

## 1. Proposito

O ConjuLetter e uma aplicacao educacional de Lingua Portuguesa voltada a concursos militares. O produto combina treino de conjugacao, simulados e um banco de questoes extraido de apostilas em PDF, com IA restrita a novas importacoes.

## 2. Arquitetura atual

- Stack: React 19, TypeScript 6, Vite 8 e Tailwind CSS 4.
- Execucao: SPA React no navegador, com uma rota de middleware Vite (`/api/ai/import`) para manter a credencial da IA no servidor durante o desenvolvimento/preview.
- Persistencia: `localStorage` para configuracoes, estatisticas SRS, atividade diaria, respostas e questoes importadas.
- Integracao externa: OpenRouter; a chave e o modelo sao lidos exclusivamente de `OPENROUTER_API_KEY`/`OPENROUTER_MODEL` no `.env.local` do servidor e usados somente pela importacao assistida de PDFs.
- Navegacao principal:
  - `Tabelas`: treino de conjugacao e comparacoes.
  - `Banco de Questoes`: filtro, importacao assistida por IA e resolucao das questoes extraidas dos PDFs.
- Fontes de dados:
  - `src/data/canonicalVerbs.ts`: verbos e conjugacoes canonicas; incorpora o catalogo gerado offline em `src/data/expandedVerbs.ts`.
  - `src/data/questionBank.ts`: 531 questoes publicas extraidas de sete PDFs.
  - `src/data/simuladoQuestions.ts`: 92 simulados publicos sincronizados com o caderno de Verbos.
- Servicos equivalentes ao backend:
  - `vite.config.ts`: proxy/middleware server-side da importacao para o OpenRouter, sem expor a chave ao cliente.
  - `src/services/pdfImportService.ts`: leitura/importacao de PDF e persistencia local.
  - `src/utils/srsEngine.ts`: pontuacao, revisao espacada e atividade.
  - `src/utils/grammarValidator.ts`: validacao das conjugacoes.
- Formatacao de enunciados: `src/utils/textFormatter.tsx` interpreta destaques, sublinhados, lacunas e paragrafos.
- PDFs oficiais: diretorio `lists/`.
- Scripts de extracao e auditoria: `src/scratch/`. Alguns possuem caminhos absolutos historicos e nao sao portaveis.

## 3. Fontes de verdade

1. O gabarito oficial contido no bloco final `Respostas:` ou `GABARITO` de cada PDF prevalece sobre qualquer dado gerado.
2. `correctLetter` e a letra canonica de uma questao; exatamente uma opcao deve ter `correct: true` e deve corresponder a ela.
3. O conteudo visivel deve preservar o sentido e a estrutura do PDF, removendo apenas artefatos de extracao, marcas d'agua e quebras indevidas.
4. Para conjugacoes, `canonicalVerbs.ts` e a fonte local; qualquer mudanca linguistica exige validacao explicita.

## 4. Inventario do Banco de Questoes

| Assunto | Questoes | PDF |
|---|---:|---|
| Fonetica e Fonologia | 81 | `1. Fonetica e Fonologia.pdf` |
| Acentuacao Grafica | 74 | `2. Acentuacao.pdf` |
| Estrutura e Formacao de Palavras | 94 | `3. Estrutura e Formacao de Palavras.pdf` |
| Classes Variaveis | 69 | `4. Classes de Palavras Variaveis.pdf` |
| Classes Invariaveis | 28 | `5. Classes de Palavras invariaveis.pdf` |
| Pronomes | 93 | `6. Pronomes.pdf` |
| Verbos | 92 | `7. Verbos.pdf` |
| **Total** | **531** | **7 PDFs públicos** |

## 5. Diagnostico inicial - 2026-08-28

### Integridade de gabaritos

- A auditoria historica confirmou resposta oficial para todos os itens entao importados.
- Foram encontradas 12 divergencias entre `questionBank.ts` e os PDFs:
  - Fonetica: Q1, banco B / PDF C.
  - Acentuacao: Q17, banco A / PDF C.
  - Formacao: Q17, banco A / PDF C; Q19, banco D / PDF B.
  - Classes invariaveis: Q8, banco B / PDF C; Q11, banco D / PDF A; Q22, banco C / PDF D.
  - Pronomes: Q19, banco D / PDF E.
  - Verbos: PDF 7 Q70, banco A / PDF D.
  - Os dois cadernos privados de verbos foram retirados do produto e nao fazem parte do estado atual.
- O estado atual nao preserva itens, gabaritos ou referencias desses cadernos privados.
- Causa-raiz: `parse_gabarito` analisa paginas inteiras e aceita pares `numero + letra` anteriores ao bloco oficial. Como conserva a primeira ocorrencia, referencias espurias podem sobrescrever respostas reais.

### Backend/logica

- A extracao de PDF no navegador tenta interpretar bytes comprimidos com expressoes regulares; nao e uma extracao PDF confiavel.
- A importacao envia apenas os primeiros 25 mil caracteres, podendo truncar questoes e gabaritos.
- A resposta da IA nao e validada estruturalmente antes de ser persistida.
- Existem usos de `any` em fronteiras relevantes e estados atualizados dentro de efeitos.
- O lint inicial passa com 7 avisos, incluindo inicializacao recursiva em `QuestionsView` e atualizacoes de estado em efeitos.
- Os scripts de auditoria possuem caminhos absolutos externos/locais e nao formam uma verificacao reproduzivel unica.

### Dados e formatacao

- O banco possui IDs unicos, 420 questoes com cinco opcoes e 171 com quatro.
- Ha artefatos de extracao, palavras com espacos indevidos e quebras de linha que nao representam paragrafos reais.
- O formatador atual transforma toda quebra de linha em paragrafo, ampliando visualmente quebras artificiais de PDF.
- O detector de corrupcoes sinaliza `tod@s`; nesse contexto pode ser conteudo deliberado e deve ser conferido no PDF antes de qualquer troca.

### Interface

- O desktop e visualmente coerente, mas usa muitas larguras/controles compactos e metadados pouco claros.
- Em viewport de 390 px, a pagina apresenta `scrollWidth` de 504 px: o cabecalho e a navegacao vazam horizontalmente.
- No botao de retorno do Banco ha uma seta do icone e outra seta textual duplicada.
- A pagina de questoes amplia quebras artificiais de linha e pode fragmentar enunciados.
- A tipografia monoespacada e aplicada amplamente, reduzindo legibilidade em textos longos.

## 6. Plano de correcao concluido nesta auditoria

1. Auditoria de PDFs reproduzivel e parser de gabaritos corrigido.
2. Doze divergencias e marcacao interna da Q19 corrigidas.
3. Importacao de PDF substituida por PDF.js e validacao estrutural adicionada.
4. Alternativas reais recuperadas em 60 questoes de Modos Verbais.
5. Ruido recorrente e ligaturas corrompidas normalizados na geracao.
6. Overflow mobile, cabecalho, controles e formatacao de enunciados corrigidos.
7. Lint, TypeScript, build, dados, desktop e mobile validados.

## 7. Protocolo obrigatorio de auditoria por atualizacao

Depois de cada rodada de mudancas:

1. Registrar abaixo os arquivos alterados, motivo e riscos.
2. Rodar o auditor do banco contra os sete PDFs públicos.
3. Rodar lint e build.
4. Testar o fluxo afetado no navegador em desktop e, quando houver UI, em 390 px.
5. Confirmar ausencia de erros no console.
6. Atualizar pendencias e decisoes deste arquivo.

## 8. Diario de mudancas auditadas

### 2026-08-28 - rodada 0: entendimento e linha de base

- Arquivos alterados: apenas `PROJECT_CONTEXT.md` (criado).
- Codigo e dados de producao: ainda nao alterados.
- Verificacoes executadas:
  - inventario completo do repositorio;
  - leitura da arquitetura, componentes, servicos, utilitarios, dados e scripts;
  - `npm run lint` (0 erros, 7 avisos);
  - extracao textual dos nove PDFs;
  - cruzamento das 591 respostas com os blocos oficiais;
  - revisao visual desktop e mobile no navegador local.
- Resultado: linha de base documentada; correcoes autorizadas para a proxima rodada.

### 2026-08-28 - rodada 1: integridade, backend e interface

- Arquivos principais alterados:
  - `src/data/questionBank.ts`: regenerado dos nove PDFs.
  - `src/scratch/parse_helpers.py`: parser limitado ao bloco oficial e suporte a alternativas minusculas.
  - `src/scratch/test_strict_parser.py`: reconhecimento consistente de A-E/a-e.
  - `src/scratch/text_purifier.py`: remocao de ruido e recuperacao de ligaturas corrompidas.
  - `src/scratch/audit_question_bank.py`: auditor deterministico e portavel criado.
  - `src/services/pdfImportService.ts`: extracao real com PDF.js, preservacao do final do documento e validacao antes de persistir.
  - `src/utils/textFormatter.tsx`: quebras simples de PDF deixaram de virar paragrafos artificiais.
  - `src/components/Header.tsx` e `src/components/QuestionBankView.tsx`: responsividade, controles e alinhamentos corrigidos.
  - `src/components/QuestionsView.tsx`, `src/utils/srsEngine.ts`: fluxo de inicializacao e avisos corrigidos.
  - `package.json` e `package-lock.json`: `pdfjs-dist` adicionado.
- Auditoria dos dados: 591/591 questoes, 9/9 PDFs, zero divergencia de gabarito, zero placeholder, zero opcao correta inconsistente.
- Lint: 0 erros; restam 3 avisos preexistentes de `set-state-in-effect` nos modulos de treino de tabelas.
- Build: concluido com sucesso. O Vite ainda alerta sobre o tamanho do chunk principal por causa dos grandes bancos estaticos; PDF.js foi separado em chunk sob demanda.
- Navegador: desktop e viewport movel auditados; em 385 px, `scrollWidth === clientWidth`; console sem erros ou avisos.
- Risco residual: textos longos extraidos por OCR/PDF podem conter espacamentos raros nao cobertos pelas normalizacoes conhecidas. O auditor garante estrutura e gabarito, nao equivalencia literal integral de cada caractere.

### 2026-08-28 - rodada 2: aba Questoes exclusivamente por IA

- `src/components/QuestionsView.tsx` foi refeito sem importar `MILITARY_QUESTIONS`: estado inicial vazio, geracao sob demanda e somente conteudo validado vindo do OpenRouter.
- `src/services/aiGenerator.ts` perdeu todo fallback local. A chave agora e obrigatoria, erros sao exibidos ao usuario e o JSON passa por validacao de enunciado, quatro alternativas A-D, gabarito unico, justificativas, resolucao e regra central.
- O prompt de geracao passou a proibir fontes/bancas/anos inventados, exigir questao autocontida, distratores homogeneos e verificacao interna do gabarito.
- O prompt de `pdfImportService.ts` passou a proibir inferencia e criacao de conteudo, aceitar somente gabaritos explicitos, preservar todas as alternativas e retornar um objeto JSON coerente com `response_format`.
- `SettingsModal.tsx` agora apresenta a chave OpenRouter como obrigatoria para Questoes e importacoes assistidas.
- Verificacoes: lint sem erros (3 avisos antigos fora deste fluxo), build aprovado, estado sem chave testado, console limpo e layout sem overflow em 385 px.

### 2026-08-28 - rodada 3: refinamentos visuais e auditoria verbal

- `src/components/TablesView.tsx`: o comando de expandir/recolher da Bandeja de Tempos passou a ocupar e alinhar corretamente a area disponivel, com chevron vetorial; o emoji de lampada foi removido do aviso do modo Confronto.
- `src/components/Header.tsx` e `src/components/Navbar.tsx`: o antigo icone de premio/estrela do Banco de Questoes foi substituido por um icone de biblioteca, semanticamente ligado ao acervo.
- `src/data/canonicalVerbs.ts`: corrigidos tres erros confirmados — `reponde` no imperativo afirmativo de `repor`, `intervens` para `intervéns` no presente de `intervir` e `mantedes` para `mantendes` no presente de `manter`.
- `scripts/audit-verbs.cjs` e `package.json`: criada a rotina reproduzivel `npm run audit:verbs`, que valida estrutura, formacao dos imperativos, formas criticas e a heranca dos paradigmas de `por`, `ver` e `vir` nos derivados.
- Auditoria verbal: 15 verbos, 11 paradigmas por verbo e derivacoes prefixais aprovados. Os vazios de `reaver`, `precaver` e `abolir` permanecem deliberados conforme a norma tradicional adotada no material de concursos.
- Auditoria do banco: 591/591 questoes e 9/9 PDFs consistentes.
- Verificacoes: `npm run audit:verbs`, `npm run build` e auditor do banco aprovados; `npm run lint` sem erros e com os mesmos 3 avisos preexistentes. Fluxos de Sessao Multi-Tempos e Confronto conferidos no navegador local; o emoji removido nao aparece na arvore acessivel.
- Risco residual: fontes lexicograficas podem registrar paradigmas modernos alternativos para alguns verbos defectivos; o sistema conserva conscientemente a abordagem tradicional documentada para provas militares.

### 2026-08-28 - rodada 4: cadernos ineditos de IA sem banca especifica

- `src/components/QuestionsView.tsx`: removido o seletor e o selo de banca da aba `Questoes`; adicionado seletor de 5, 10 ou 20 questoes e navegacao sequencial dentro do caderno gerado.
- `src/services/aiGenerator.ts`: criado gerador de lotes com contrato JSON estrito, contagem exata, validacao individual e instrucao explicita para nao mencionar, imitar ou atribuir as questoes genericas a uma banca especifica. O gerador unitario usado pelo simulador foi preservado.
- `src/types/verbs.ts`: adicionado o valor interno generico `Concurso Militar` para manter compatibilidade do modelo de dados sem exibi-lo como banca na aba de geracao sob demanda.
- A interface informa progresso (`Questao N de total`), conserva o placar e libera a proxima questao somente depois da resposta atual.
- Verificacoes: lint sem erros (os mesmos 3 avisos preexistentes), TypeScript/build e auditor verbal aprovados; auditor do banco confirmou 591 questoes e 9 PDFs consistentes. No navegador, as tres quantidades aparecem corretamente e o erro de chave OpenRouter ausente continua orientando o usuario.
- Risco operacional: lotes de 20 questoes consomem mais tokens e podem ser recusados ou truncados por modelos com limite de saida reduzido; nesse caso o lote e rejeitado integralmente para impedir um caderno incompleto.

### 2026-08-28 - rodada 5: pipeline de qualidade para questoes de IA

- `src/services/aiGenerator.ts` foi reestruturado em um pipeline `planejar -> gerar -> validar -> resolver sem gabarito -> aprovar/regenerar`.
- O blueprint distribui letras corretas de forma balanceada, alterna dificuldade, varia construcoes e seleciona verbos da base canonica; contrastes usam pares `ver/vir`, `prever/prover` e `reaver/precaver`.
- Cada bloco possui no maximo cinco questoes. Lotes de 10 e 20 sao processados em blocos para reduzir truncamento e erros correlacionados.
- A geracao recebe apenas as conjugacoes canonicas pertinentes de `canonicalVerbs.ts`, exemplos positivos/negativos de calibracao e um contrato JSON Schema estrito.
- O revisor recebe enunciado e alternativas sem o campo `correct` e resolve novamente. Uma questao somente e aceita quando a letra independente coincide e os criterios de assunto, unicidade e referencia canonica sao aprovados.
- Questoes estruturalmente invalidas, divergentes ou excessivamente semelhantes sao regeneradas isoladamente, ate tres tentativas; ao fim, conteudo duvidoso e rejeitado em vez de exibido.
- Validacoes locais adicionais confirmam letra reservada, dificuldade, presenca de forma verbal canonica, requisitos especificos de lacuna, imperativo, vozes e duplo participio. Verbos inexistentes e combinacoes sem suporte canonico produzem erro explicativo.
- Falhas transitorias 429/5xx recebem ate tres tentativas com espera progressiva; modelos sem suporte a JSON Schema sao recusados explicitamente.
- `src/components/QuestionsView.tsx` agora mostra o estagio atual de criacao/revisao e informa que ha uma segunda resolucao independente.
- Verificacoes: lint sem erros (3 avisos historicos), build/TypeScript e auditor verbal aprovados; auditor do banco confirmou 591 questoes e 9 PDFs consistentes. Interface e estado sem chave validados no navegador.
- Limitacao de teste: sem uma chave OpenRouter configurada no ambiente de auditoria, nao foi possivel executar uma geracao paga ponta a ponta; foram validados o contrato local, compilacao e todos os estados anteriores a rede.

### 2026-08-28 - rodada 6: listas persistentes do Banco de Questoes

- `src/components/Header.tsx` ganhou uma bandeja por hover/foco no botao Banco de Questoes, com acessos para `Filtrar banco` e `Listas salvas`; o foco tambem permite uso por toque e teclado.
- `src/services/questionListService.ts` centraliza criacao, leitura, atualizacao de progresso e exclusao das listas no `localStorage`.
- Cada lista salva conserva fotografia ordenada dos IDs das questoes, assuntos/filtros de origem, respostas, confirmacoes, pagina atual, tamanho de pagina e datas de criacao/atualizacao.
- `QuestionBankFilterView.tsx` separa as acoes: `Pre-visualizar` abre um caderno temporario e `Criar Lista` registra a selecao persistente produzida pelos mesmos filtros e limite de quantidade.
- `QuestionBankView.tsx` ganhou a tela `Listas salvas`, indicadores de progresso e precisao, retomada, exclusao confirmada e persistencia isolada por lista. Respostas da pre-visualizacao deixaram de ser gravadas.
- `App.tsx` passou a reconhecer a guia interna `listas` e abrir diretamente o gerenciador pela bandeja da homebar.
- Teste funcional no navegador: lista de 10 itens criada, uma resposta confirmada, aplicacao recarregada e progresso de 1/10 recuperado corretamente.
- Verificacoes: lint sem erros (os mesmos 3 avisos historicos), build/TypeScript e auditor verbal aprovados; auditor do banco confirmou 591 questoes e 9 PDFs consistentes.

### 2026-08-28 - rodada 7: proporcao dos botoes de lista

- `QuestionBankFilterView.tsx`: `Pre-visualizar` e `Criar Lista` agora ocupam colunas iguais, com a mesma altura, tipografia, espacamento interno e alinhamento de icones.
- O icone de brilho da pre-visualizacao foi substituido por `Eye`; o brilho do titulo de quantidade tambem foi trocado por `ListPlus`, eliminando a estrela nessa area.
- Verificacoes: revisao visual no navegador aprovada; lint sem erros (3 avisos historicos), build, auditor verbal e auditor das 591 questoes/9 PDFs aprovados.

### 2026-08-28 - rodada 8: ampliacao da Sessao Multi-Tempos

- `canonicalVerbs.ts`: adicionados 18 verbos regulares de uso frequente, com geracao deterministica dos 11 paradigmas completos; a base passou de 15 para 33 verbos.
- Novos verbos: falar, estudar, trabalhar, cantar, amar, chamar, viver, vender, beber, aprender, correr, receber, partir, decidir, cumprir, permitir, assistir e dividir.
- `TablesView.tsx`: o sorteio agora usa uma fila embaralhada sem reposicao; nenhum verbo se repete antes do encerramento do ciclo disponivel.
- A interface informa `33 verbos · sem repeticao` ao lado do botao em telas amplas.
- `scripts/audit-verbs.cjs`: expectativa ampliada para 33 verbos; todos os 11 paradigmas, imperativos, formas criticas e derivados continuam validados.
- Teste funcional: 20 sorteios consecutivos produziram 20 verbos unicos.
- Verificacoes: build aprovado, auditor verbal aprovado e auditor do banco manteve 591 questoes/9 PDFs consistentes.

### 2026-08-29 - rodada 9: auditoria textual integral do Banco de Questões

- `src/scratch/extract_pdfjs.mjs`, `generate_clean_bank.py`, `parse_helpers.py` e `text_purifier.py`: a extração passou a preservar melhor geometria e quebras dos PDFs; a limpeza ganhou correções conservadoras para ligaturas privadas, palavras partidas, espaços internos, pontuação colada, marcas de página e contaminação do gabarito.
- `src/data/questionBank.ts`: banco integralmente regenerado a partir dos 9 PDFs, mantendo 591 questões e as letras oficiais.
- A varredura item a item validou enunciado, 4/5 alternativas, alternativa correta, duplicidade de IDs, placeholders e integridade textual. Alternativas formadas apenas por números ou por uma palavra foram conferidas e preservadas quando eram respostas legítimas do PDF; a duplicidade da questão 15 de Classes Variáveis também existe no original e não foi inventada pelo parser.
- Páginas escaneadas sem camada textual foram renderizadas e conferidas visualmente. Foram restaurados os apoios de `Mulheres de Atenas` (Verbos q5), `A raposa e as uvas` (Classes Variáveis q39), `O silêncio incomoda` (Classes Variáveis q60-q62 e Classes Invariáveis q24-q25) e `Retrato` (Pronomes q45).
- Um caso de comando que dependia de texto inexistente foi corrigido durante a auditoria historica.
- `QuestionBankView.tsx`: título, corpo e fonte bibliográfica do texto de apoio são separados visualmente; citações autor-data/publicação entre parênteses também são reconhecidas como fonte.
- `audit_question_bank.py`: além de comparar os 591 gabaritos com os PDFs, agora reprova caractere corrompido, marcador `--- PAGE`, parágrafo colado, referência `TEXTO I/II/III` sem apoio e ausência dos textos escaneados restaurados.
- Resíduos finais: zero `�`, `¢`, `€`, `†`, marcadores de página, `aafirmativa`, `Websterr`, `LfiPM` e marcadores de parágrafo colados. Foram contabilizados 401 itens com texto de apoio.
- Verificações: auditor do banco aprovado (591 questões, 9 PDFs), build/TypeScript aprovado, auditor verbal aprovado (33 verbos, 11 paradigmas) e lint sem erros; permanecem os mesmos 3 avisos históricos de `set-state-in-effect` fora do Banco de Questões.
- Os 22 PNGs temporários usados na conferência visual foram removidos após a auditoria.

### 2026-08-31 - rodada 11: redesign editorial e remoção da aba de geração por IA

- `src/App.tsx` deixou de montar `QuestionsView`; a aba de geração inédita não faz mais parte do fluxo e `MainNavTab` não aceita mais `questoes`.
- `src/components/Header.tsx` removeu o item Questões do desktop e ganhou navegação móvel dedicada, com Banco e Listas sem dropdown sobreposto ao conteúdo.
- `src/components/SettingsView.tsx` mantém chave/modelo OpenRouter, mas comunica que a IA é exclusiva da importação de PDFs.
- `src/index.css` recebeu tokens de foco, superfície editorial, medida de leitura, hierarquia tipográfica, foco acessível e respeito a `prefers-reduced-motion`.
- `QuestionBankFilterView.tsx` e `QuestionBankView.tsx` foram refinados com menos caixas, espaçamento editorial, títulos mais legíveis, apoio em bloco único e alternativas com estados mais claros.
- A marcação pedagógica existente nos PDFs permanece disponível no Banco quando semanticamente necessária; não há mais marcações ou geração associadas a uma aba de IA sob demanda.
- Verificações: `npm run build` aprovado; `npm run lint` sem erros, com os 3 avisos históricos de `set-state-in-effect` em módulos de treino. Navegador validado em desktop e 390 px, sem a aba Questões e sem sobreposição na seleção do Banco.

### 2026-08-29 - rodada 10: revisão estrutural final de fontes, comandos e alternativas

- `src/scratch/text_purifier.py`: a separação de cabeçalhos `TEXTO I/II/III` passou a respeitar o numeral romano completo (evitando transformar `III` em `II` + `I`); delimitadores Markdown de negrito isolados são removidos somente quando ficam sem par, sem apagar destaques válidos.
- `src/scratch/parse_helpers.py`: comandos como `Leia:`, `Mantendo-se...`, `Optando-se...`, `Complete...` e `Com base no texto, responda à questão` são deslocados para o enunciado, mantendo o apoio integral; marcadores em negrito no início das linhas também são reconhecidos.
- `src/scratch/test_strict_parser.py` e `generate_clean_bank.py`: rótulos de alternativas e cabeçalhos em negrito dos PDFs 16/17 agora são normalizados antes da leitura. As alternativas reais foram recuperadas (os placeholders `Opção A/B/C/D` foram eliminados) e a tabela de gabarito deixou de ser confundida com questões.
- `src/data/questionBank.ts`: regenerado novamente com 591 questões, 2.803 alternativas e 401 textos de apoio; os 9 PDFs continuam com correspondência integral de gabarito.
- `src/components/QuestionBankView.tsx`: citações que chegam quebradas em duas linhas são agrupadas e removidas apenas do corpo, sendo exibidas no rodapé do mesmo bloco, com separação visual e espaçamento; nenhum parágrafo posterior à fonte é descartado.
- `src/scratch/audit_question_bank.py`: auditoria passou a reprovar negrito desbalanceado, marcador de alternativa vazado no apoio e comando genérico deixado como último parágrafo do apoio.
- Conferência visual no navegador: Q81 mantém os cinco destaques de `a`, Q3 separa `Leia:` do texto, e citações de Q6/Q41 aparecem no rodapé do cartão. Não há placeholders renderizados.
- Verificações: auditor do banco aprovado (591/591 gabaritos e estrutura), `npm run build` aprovado, `npm run audit:verbs` aprovado (33 verbos/11 paradigmas) e `npm run lint` sem erros; permanecem apenas os 3 avisos históricos de `set-state-in-effect` em `DrillGrid`/`TablesView`.

### 2026-08-29 - rodada 11: auditoria navegável de todas as listas

- A aplicação foi aberta no navegador local e cada filtro de assunto foi percorrido com a opção `Todas`: Fonética (81), Acentuação (74), Formação (94), Classes Variáveis (69), Classes Invariáveis (28), Pronomes (93) e Verbos (92). Total publico conferido na interface: 531 questões.
- A inspeção DOM de cada lista confirmou a sequência completa de itens, 401 blocos de texto de apoio, fontes no rodapé do cartão, ausência de overflow horizontal e nenhum placeholder, caractere corrompido ou marcador Markdown literal nas questões renderizadas.
- A navegação encontrou e corrigiu três resíduos: a frase `O homem deixou...` indevidamente classificada como título, notas de rodapé de autores exibidas como `*` e a referência de linha `(****. 34-36)`. O texto agora aparece como corpo formatado, sem asteriscos, e `(ℓ. 34-36)`.
- `getReadingMetadata` passou a limitar títulos compostos a linhas curtas sem várias frases; o rótulo duplicado `Fonte:` no início das citações é removido e marcadores de negrito são limpos no rodapé bibliográfico.
- `audit_question_bank.py` ganhou uma regra explícita para reprovar referências de linha que voltem a aparecer como `(****. n)`.
- Verificações finais no navegador: os sete assuntos abriram sem erro, todas as questões foram renderizadas, fontes e comandos permaneceram separados, `scrollWidth === clientWidth` em cada lista, e a busca por resíduos (`�`, `LfiPM`, `Websterr`, `aafirmativa`, `: ança`, `****. 34-36`, `e**`, `tos**`) retornou zero ocorrências.

### 2026-08-29 - rodada 12: título integrado e separação dos cadernos de Verbos

- `QuestionBankView.tsx`: o título do texto de apoio deixou de usar uma caixa interna própria; agora é uma linha integrada ao mesmo bloco do texto, enquanto a fonte permanece no rodapé com separação por borda e espaçamento.
- `QuestionBankFilterView.tsx`: o filtro `Verbos` exibe somente o caderno publico de 92 questoes, sem sublistas privadas.
- `FilterState` e os filtros de montagem/prática agora aplicam `selectedListIds` apenas às questões de Verbos; os nomes das listas selecionadas também aparecem no nome de uma lista persistente criada pelo usuário.
- `audit_question_bank.py`: os totais oficiais dos sete PDFs publicos passaram a ser verificados explicitamente.
- Auditoria web após a mudança: os sete PDFs publicos foram abertos integralmente. Total: 531 questões; zero resíduos de texto/formatação e zero overflow horizontal. A estrutura DOM confirmou que o título e o texto compartilham o mesmo bloco visual.
- Verificações: build aprovado, auditor do banco aprovado (531 questões/7 PDFs), auditor verbal aprovado (33 verbos/11 paradigmas) e lint sem erros, com os mesmos 3 avisos históricos fora desta área.

### 2026-08-29 - rodada 13: catalogo offline ampliado e geracao calibrada

- `scripts/build_expanded_verbs.py` extraiu ocorrencias dos nove PDFs, consultou paradigmas lexicograficos apenas durante a geracao do artefato e produziu `src/data/expandedVerbs.ts`. O runtime nao faz chamadas de IA nem de rede para tabelas: o catalogo e as conjugacoes ficam congelados no bundle.
- `src/data/canonicalVerbs.ts` passou a incorporar 130 verbos adicionais (163 no total), ordenados por frequencia observada nos PDFs para priorizacao de estudo. A frequencia e uma medida do corpus local, nao um ranking oficial de bancas. Foi corrigida tambem a forma `precavi` de `precaver`.
- `src/types/verbs.ts` documenta metadados opcionais de frequencia/prioridade; `scripts/audit-verbs.cjs` valida os 163 verbos, os 11 paradigmas, imperativos, formas criticas e derivados prefixais. `src/scratch/generate_high_value_verbs.py` agora delega ao gerador unico, evitando duas fontes de verdade.
- `src/services/aiGenerator.ts` continua sendo o unico caminho de IA para questoes. O prompt foi calibrado com sinais deterministas das questões verbais publicas (priorizando modo/tempo/flexao e correlacao), detalhou restricoes para os sete tipos de questao e passou a validar semanticamente lacunas, correlacao, imperativo, identificacao morfologica, vozes, duplo participio e homonimos. A ordenacao dos blueprints usa a frequencia local, sem copiar texto dos PDFs, inventar banca ou atribuir fonte.
- `src/components/Header.tsx` ajustou a bandeja do Banco de Questoes para nao causar overflow em 390 px. O fluxo de `Tabelas > Sessao Multi-Tempos` segue offline, sem reposicao, e agora exibe 163 verbos.
- Auditorias: `npm run audit:verbs` aprovado (163 verbos/11 paradigmas); `python src/scratch/audit_question_bank.py` aprovado (591 questoes/9 PDFs); `npm run build` aprovado; `npm run lint` sem erros, com 3 avisos historicos de `set-state-in-effect` em `DrillGrid`/`TablesView`; console do navegador sem erros/avisos.
- Navegador: 20 sorteios consecutivos da Sessao Multi-Tempos produziram 20 verbos unicos; o layout desktop e movel ficou sem overflow; a aba Questoes mostrou somente quantidade 5/10/20, conteudos e verbo opcional, sem seletor de banca.
- Risco residual: as formas foram geradas deterministicamente e auditadas contra regras locais, mas fontes lexicograficas podem atualizar variantes; convem reexecutar o script em uma rodada futura e ampliar os casos dourados antes de tratar o catalogo como imutavel.

### 2026-08-29 - rodada 14: revisão estrutural das questões e identidade da guia

- `src/utils/textFormatter.tsx`: a formatação passou a distinguir prosa, leitura, enunciado estruturado e alternativa. Quebras artificiais de PDF são unificadas, enquanto listas, itens numerados, lacunas e comandos são separados por parágrafos legíveis. Negritos soltos, rótulos numéricos em Markdown e separações de OCR dentro de palavras são normalizados sem retirar destaques linguísticos válidos.
- `src/components/QuestionBankView.tsx`, `src/components/SimuladosView.tsx` e `src/components/QuestionsView.tsx`: os novos modos do formatador foram aplicados ao texto de apoio, enunciado e alternativas para manter espaçamento e hierarquia visual consistentes.
- `src/scratch/generate_clean_bank.py`: foram adicionadas correções determinísticas para os sete PDFs publicos e para artefatos recorrentes de extração. As correções restauram lacunas, separam itens, listas e sequências C/E, removem comandos duplicados e fontes deslocadas e preservam distratores intencionais. `src/data/questionBank.ts` foi regenerado com 531 questões.
- `src/scratch/audit_question_bank.py`: casos dourados protegem as correções de lacunas, listas, citações e separação de enunciados dos PDFs publicos, além dos testes anteriores de gabarito e caracteres corrompidos.
- `index.html` e `public/favicon.svg`: o título da guia agora é `ConjuLetter | By Gustavo_Fcs` e o favicon foi substituído por um símbolo minimalista de conjugação, com fundo transparente e sem o antigo raio.
- Auditoria de conteúdo e interface: o banco publico (531/531) foi renderizado com busca de `**`, caracteres corrompidos e marcadores indevidos, todos com zero ocorrências. Em viewport de 390 px, `scrollWidth === clientWidth`, não houve elemento vazando após a verificação final e o console permaneceu sem erros/avisos.
- Verificações finais: auditor do banco aprovado (531 questões/7 PDFs), `npm run audit:verbs` aprovado (163 verbos/11 paradigmas), build aprovado e lint sem erros. Permanecem apenas os 3 avisos históricos de `set-state-in-effect` em `DrillGrid`/`TablesView` e o alerta de chunk grande do Vite.
- Risco residual: a limpeza é conservadora e reproduzível; novas edições dos PDFs devem passar pelo gerador e pelos casos dourados antes de entrar no banco.

### 2026-08-29 - rodada 15: bandeja fixa de ações e favicon transparente

- `src/components/QuestionBankFilterView.tsx`: a barra de ações deixou de usar `sticky` dentro do fluxo dos filtros, que fazia o painel sobrepor os cartões. Agora é uma bandeja fixa no rodapé, centralizada, com fundo translúcido, espaço inferior reservado no conteúdo e composição responsiva; no mobile o botão de limpar filtros ocupa a largura disponível e as ações principais empilham sem compressão.
- `index.html`: o título da guia foi ajustado para `ConjuLetter | By Gustavo_Fcs`, conforme a identidade solicitada.
- `public/favicon.svg`: o ícone foi reduzido a traços de uma letra C e linhas de texto, sem retângulo de fundo, mantendo leitura em tema claro ou escuro.
- Verificações: TypeScript/build e lint executados; no navegador a bandeja foi conferida em desktop e 390 px, com `scrollWidth === clientWidth` e sem sobreposição estrutural dos filtros. O console permaneceu sem erros.

### 2026-08-29 - rodada 16: gabarito comparativo e cópia rápida

- `src/components/QuestionBankView.tsx`: cada lista salva agora possui o botão `Ver gabarito` ao lado de `Começar`. A abertura exibe uma tabela compacta e rolável com número/assunto, resposta marcada, letra definitiva e resultado (`Correta`, `Incorreta` ou `Pendente`), usando a fotografia persistida de respostas da própria lista.
- No caderno em resolução foram adicionados `Copiar questão` e `Copiar enunciado` no cabeçalho de cada item. A primeira ação copia texto de apoio, enunciado e alternativas; a segunda copia somente o enunciado. O conteúdo é limpo de Markdown/HTML e possui fallback para navegadores sem `navigator.clipboard`, com confirmação visual temporária `Copiado`.
- `src/utils/textFormatter.tsx` permaneceu dedicado à renderização React; a limpeza para transferência foi mantida local ao fluxo de cópia para evitar exportações que prejudiquem o Fast Refresh.
- Verificações funcionais no navegador: tabela renderizada com cabeçalhos `QUESTÃO`, `MARCADA`, `DEFINITIVA`, `RESULTADO` e 10 linhas; os dois botões de cópia apareceram e ambos exibiram confirmação. Console sem erros/avisos.
- Verificações de projeto: auditor do banco aprovado (591 questões/9 PDFs), auditor verbal aprovado (163 verbos/11 paradigmas), build aprovado e lint sem erros novos; permanecem apenas os três avisos históricos de `set-state-in-effect`.

### 2026-08-29 - rodada 17: ancoragem da bandeja no viewport

- `src/components/QuestionBankFilterView.tsx`: a bandeja de ações deixou de ser apenas um descendente fixo do conteúdo e passou a ser renderizada via `createPortal` diretamente em `document.body`, com `position: fixed` explícito. Isso elimina qualquer interferência de contêineres de rolagem, transformações ou estilos ancestrais.
- Verificação no navegador: antes e depois de rolar, a bandeja manteve o mesmo `top`/`bottom`, confirmou `position: fixed` e teve `BODY` como pai; em 390 px continuou sem overflow (`scrollWidth === clientWidth`). Console sem erros ou avisos.
- Verificações de projeto: build, lint, auditoria do banco (591/591) e auditoria verbal (163/163) aprovados. Permanecem apenas os três avisos históricos de `set-state-in-effect` e o alerta de tamanho de chunk do Vite.

### 2026-08-29 - rodada 18: fixação reforçada da bandeja

- `src/components/QuestionBankFilterView.tsx`: a bandeja recebeu `data-fixed-action-tray`, posicionamento inline completo (`left`, `right`, `bottom`, `zIndex`) e permanece em portal no `document.body`.
- `src/index.css`: foi adicionada uma regra global com `!important` para garantir `position: fixed` e `inset: auto 0 0`, mesmo se o host aplicar estilos utilitários conflitantes.
- Verificação no navegador: em desktop e 390 px, antes e depois da rolagem a bandeja manteve a mesma posição, com `BODY` como pai e sem overflow horizontal; console sem erros ou avisos.

### 2026-08-29 - rodada 19: ações no fim da página, sem acompanhar o scroll

- A intenção foi esclarecida: a barra não deveria permanecer presa à viewport; deveria existir como rodapé do formulário e aparecer somente ao chegar ao final dos filtros.
- `src/components/QuestionBankFilterView.tsx`: removidos `createPortal`, `position: fixed`, estilos inline e o espaçamento artificial reservado para a barra flutuante. As ações agora são uma seção semântica no fluxo normal da página, com o mesmo alinhamento profissional e comportamento responsivo.
- `src/index.css`: removida a regra global de fixação com `!important`.
- Teste no navegador desktop: no topo, o rodapé começou em `top: 841` para uma viewport de 720 px e ficou invisível; no fim, apareceu em `top: 558`. A posição calculada no documento permaneceu constante, comprovando que não acompanha o scroll.
- Teste em 390 px: invisível no topo (`top: 1233`) e visível apenas no fim (`top: 592`), com `scrollWidth === clientWidth`. Console sem erros/avisos.
- Verificações de projeto: build, lint, auditoria do banco (591/591) e auditoria verbal (163/163) aprovados; permanecem apenas os três avisos históricos de `set-state-in-effect` e o alerta de chunk grande do Vite.

### 2026-08-29 - rodada 20: auditoria profissional de liberação

- As 163 tabelas foram comparadas por um auditor independente com uma referência brasileira, cobrindo 10.758 células nos 11 paradigmas exibidos. O processo encontrou e corrigiu formas europeias (`-ámos`, `dêmos`, `dêem`, `lêem`/`crêem`), células ausentes na fonte de geração, acentos fechados de `prover`/`precaver`/`valer` e imperativos irregulares/derivados (`tem`, `contém`, `traz`, `contradiz`, `revém`, entre outros).
- `scripts/audit-verbs-ptbr.py` passou a comparar todo o catálogo com páginas brasileiras, incluindo pessoas explícitas, variantes aceitas, verbos defectivos e normalização Unicode. `scripts/audit-verbs.cjs` ganhou saída JSON e casos dourados pós-Acordo Ortográfico; `scripts/build_expanded_verbs.py` agora reproduz deterministicamente as correções brasileiras e protege omissões ocasionais da fonte externa.
- O banco publico foi regenerado a partir dos sete PDFs e confrontado integralmente com os blocos oficiais de gabarito: 531 questões, 2.563 alternativas e correspondência de letra/numeração por PDF. O auditor também passou a reprovar dezenas de padrões de corrupção de ligaduras, caracteres e palavras coladas.
- A inspeção ortográfica identificou e corrigiu resíduos reais de `fi/fl` e OCR em textos de apoio, como `confiáveis`, `ráfia`, `filósofo`, `financeiramente`, `desconfiança`, `beneficiava`, `corporificada`, `diversificadas`, `garrafinha`, `Báltico`, `Salamina`, `home office`, `Floresta`, `fiordes`, `monóxido`, `chaminés` e `retribuído`. Grafias deliberadas de exercícios, variantes históricas, nomes próprios e citações estrangeiras foram preservadas para não alterar o conteúdo pedagógico nem o gabarito.
- A versão final foi aberta no navegador e as 531 questões publicas foram renderizadas simultaneamente (`Pré-visualização (531 questões)`), totalizando mais de 1,6 milhão de caracteres visíveis; as lacunas foram preservadas, não houve caractere corrompido, negrito solto nem marcador conhecido.
- Em viewport de 390 px, `scrollWidth` ficou abaixo de `innerWidth`, sem overflow horizontal; o console terminou sem erros ou avisos. Build aprovado e lint sem erros, mantendo apenas os três avisos históricos de `set-state-in-effect` e o alerta de chunk grande já documentados.
- Fechamento da rodada: a comparação externa terminou com `163` páginas de referência, `10.758` formas confrontadas, zero falha de consulta e zero divergência. Foram corrigidas ainda as pessoas `nós`/`vós` de `prover`, `precaver` e `valer` (vogal tônica fechada) e o imperativo de `revir` (`revenha`/`não revenha`). O gerador recompõe imperativos somente depois de restaurar eventuais células isoladas, evitando que omissões transitórias da fonte gerem `null`. A auditoria local, a auditoria externa, a auditoria das 591 questões, o lint e o build foram repetidos e aprovados.

### 2026-08-30 - rodada 21: progresso da sessão e simplificação de Verbos

- `src/components/TablesView.tsx`: a Sessão Multi-Tempos passou a controlar um ciclo fechado dos 163 verbos sem reposição. Ao esgotá-lo, o sorteio é encerrado e um novo ciclo somente começa pela ação explícita `Reiniciar ciclo`.
- O antigo contador de sessões foi substituído por progresso semântico: verbos praticados/total, dominados, feitos e pendentes. Uma área expansível lista cada verbo verificado, seu estado e o número de tentativas; reverificar o mesmo verbo atualiza o registro sem duplicar a contagem.
- `src/components/QuestionBankFilterView.tsx` e `src/components/QuestionBankView.tsx`: o assunto Verbos aponta diretamente e exclusivamente para o caderno publico com 92 questões, sem bandeja ou seletor de sublistas privadas.
- Teste no navegador: progresso mudou corretamente de `0/163` para `1/163`, exibindo `1 feito · 162 pendentes`; o filtro isolado de Verbos produziu `Criar Lista (92 questões)` sem seletor de sublistas. Console sem erros/avisos.
- Verificações: auditor verbal aprovado (163 verbos/11 paradigmas), auditor integral do banco aprovado (531 questões/7 PDFs), lint sem erros novos e build aprovado. Permanecem somente os três avisos históricos de `set-state-in-effect` e o alerta de tamanho do chunk.

### 2026-08-30 - rodada 22: progresso sem resumo duplicado

- `src/components/TablesView.tsx`: removido do cabeçalho o texto solto `Progresso: 0/163 verbos praticados · 0 dominados`. O acompanhamento permanece exclusivamente no box expansível `Progresso da sessão`, evitando informação repetida e mantendo feitos, pendentes e a relação individual de verbos.

### 2026-08-30 - rodada 23: README do produto

- `README.md`: substituído integralmente o texto padrão do template Vite e removido o título residual com codificação quebrada.
- A nova documentação apresenta proposta do produto, recursos das três áreas, pipeline de IA, números auditados, tecnologias, instalação, comandos de validação, estrutura do repositório, persistência, privacidade, estado conhecido e autoria.
- Foi documentada explicitamente a diferença entre as 591 questões preservadas/auditadas e as 531 atualmente expostas no filtro, evitando que a ocultação dos dois cadernos de 30 seja confundida com exclusão de dados.

### 2026-08-30 - rodada 24: Configurações como guia própria

- `src/components/SettingsModal.tsx` foi removido e substituído por `src/components/SettingsView.tsx`: Configurações deixou de ser um modal e passou a ocupar uma página interna completa.
- `src/App.tsx` e `src/components/Header.tsx`: adicionada a rota de interface `configuracoes`; o botão de engrenagem agora navega para a guia e exibe estado ativo.
- A nova tela separa experiência de estudo, integração OpenRouter e dados locais. Inclui seletor descritivo de colunas, acentuação estrita, mostrar/ocultar chave, modelo, status da IA, resumo atual, explicação de privacidade e confirmação de salvamento sem fechar a tela.
- O reset passou a explicar que apaga também listas, respostas, importações e progresso, mantendo confirmação explícita antes da operação.
- Teste no navegador: a engrenagem abriu uma página sem semântica de `dialog`; todas as três seções e a ação de salvar foram renderizadas. Desktop sem overflow e viewport 390 px com `scrollWidth` 385; console sem erros/avisos. Build e lint aprovados, mantendo apenas os três avisos históricos e o alerta de chunk.

### 2026-08-30 - rodada 25: remoção do confete nas questões

- `src/components/QuestionsView.tsx`, `QuestionBankView.tsx`, `SimuladosView.tsx` e `MilitaryExamSimulator.tsx`: removidos os imports e disparos de `canvas-confetti` acionados ao acertar questões, tanto na confirmação individual quanto na confirmação em lote.
- A validação da alternativa, o registro da tentativa, o placar e os estados de feedback foram preservados. O confete continua somente nos exercícios de conjugação/treino (Tabelas, Drill, Imperativos e Confronto), fora do fluxo de questões.
- Verificações: não há mais referências de confete nos quatro fluxos de questões; auditoria verbal aprovada (163 verbos/11 paradigmas); auditoria do banco aprovada (591 questões/9 PDFs); build aprovado; lint sem erros novos, mantendo apenas os três avisos históricos e o alerta de tamanho do chunk.
- Teste no navegador: a guia Questões abriu e exibiu a geração de questões; a guia Banco de Questões abriu e exibiu a pré-visualização; console sem erros ou avisos.

### 2026-08-30 - rodada 26: parágrafos dos textos de apoio e sublinhado da questão 1 de Verbos

- `src/components/QuestionBankView.tsx`: a extração de título e fonte passou a preservar as linhas vazias originais do texto de apoio. Quebras simples continuam tratadas como envolvimento artificial do PDF, enquanto intervalos reais geram parágrafos separados.
- Referências bibliográficas quebradas em mais de uma linha agora são recompostas com limite seguro de continuidade, impedindo que o fim da fonte apareça como parágrafo solto ou que uma fonte malformada absorva o corpo do texto.
- `src/utils/textFormatter.tsx`: marcadores numerados como `1§`, `2§`, `3§` e equivalentes passaram a iniciar blocos próprios mesmo quando o PDF não deixou uma linha vazia entre eles.
- `src/data/questionBank.ts` e `src/data/simuladoQuestions.ts`: restaurado o sublinhado de `<u>havia visto</u>` na questão que pede a identificação do tempo composto. `audit_question_bank.py` recebeu uma proteção de regressão específica para essa marcação.
- Teste no navegador: os dez parágrafos de `A complicada arte de ver` foram renderizados como dez blocos distintos; a fonte de Rubem Alves apareceu completa no fim do mesmo bloco; `havia visto` foi renderizado uma única vez com decoração de sublinhado; console sem erros ou avisos.
- Verificações: auditoria integral aprovada (591 questões/9 PDFs), build aprovado e lint sem erros novos, mantendo somente os três avisos históricos e o alerta de chunk grande.

### 2026-08-30 - rodada 27: auditoria integral de marcações pedagógicas

- Os 591 itens dos nove PDFs foram novamente processados, preservando os gabaritos oficiais e recuperando as marcações que dão sentido a comandos como “sublinhado”, “grifado”, “destacado” e “em negrito”.
- A recuperação passou a combinar dois sinais do PDF: estilos tipográficos e linhas vetoriais. A transferência geométrica agora identifica a ocorrência contextual exata, evitando marcar todas as repetições de uma letra ou palavra dentro da alternativa.
- Foram mantidas correções determinísticas para fontes que omitem visualmente o próprio destaque; entre elas, `havia visto`, `onde`, `fui germinada`, sinais de pontuação, formas pronominais e os seis casos finais de Fonética conferidos diretamente nas páginas renderizadas.
- `audit_question_bank.py` agora bloqueia marcação vazia ou desbalanceada, referência visual sem alvo, comandos genéricos vazados ao texto de apoio e regressões em casos representativos. O comando permanente é `npm run audit:questions`.
- Estado auditado: 531 questões publicas, 294 com marcação pedagógica, 186 trechos em negrito e 764 sublinhados; as 531 questões foram carregadas simultaneamente no navegador sem resíduos de conteúdo privado.
- Verificações: gabaritos e estrutura aprovados nos nove PDFs; auditoria verbal aprovada (163 verbos/11 paradigmas); build de produção aprovado; lint sem erros e apenas os três avisos históricos de efeitos; teste visual confirmou `havia visto`, `recorde` e o texto de apoio longo renderizados no conjunto integral.

### 2026-08-30 - rodada 28: alternativas destacadas e paragrafacao semantica

- A auditoria das alternativas foi ampliada para exigir cobertura completa quando o enunciado manda comparar formas destacadas, sublinhadas, grifadas ou em negrito. A varredura encontrou 49 itens com cobertura parcial e restaurou 116 marcacoes diretamente da geometria vetorial dos PDFs.
- Os casos ambiguos foram comparados visualmente com as paginas oficiais. Foram restaurados alvos como `tudo`, os pronomes `o`, `que`, `aquele`, `essa`, `este`, `conserve`, alem de `revelasse` e `fizera` na questao de referencia. Uma regressao dedicada agora exige que as cinco alternativas desse item mantenham seus destaques.
- `src/utils/textFormatter.tsx` passou a reconstruir paragrafos de leitura por sinais semanticos do PDF: dialogos iniciados por travessao e finais de linha curta com pontuacao seguidos de nova frase. Linhas apenas quebradas pela largura da pagina continuam unidas.
- A varredura renderizada carregou as 531 questoes expostas e 389 textos de apoio. O texto `As caridades odiosas`, antes exibido como bloco unico, passou a ter 31 paragrafos; somente dois textos longos permaneceram com um unico paragrafo, ambos assim estruturados nos originais.
- No navegador, as cinco alternativas da questao de referencia apresentaram marcacao, o console terminou sem erros ou avisos e nao houve falha de renderizacao. A base publica permanece com 531 questoes em sete PDFs.
- Verificacoes finais: `npm run audit:questions` aprovado com zero referencia visual sem marcacao; lint sem erros, mantendo apenas os tres avisos historicos; build de producao aprovado, com somente o alerta conhecido de chunk grande.

### 2026-08-30 - rodada 29: auditoria visual integral e normalizacao de apoio

- `src/scratch/repair_embedded_support.py` reorganizou 23 registros longos que estavam com o texto de apoio inteiro dentro do enunciado. Tres blocos que eram apenas citacoes de fonte foram preservados no enunciado, evitando criar caixas vazias ou fontes sem corpo.
- `src/utils/textFormatter.tsx` passou a separar inline fontes coladas ao corpo, instrucoes que vinham na mesma linha da fonte, cabecalhos de assunto que vazavam para o texto e continuacoes minusculas de paragrafo. O renderizador tambem normaliza espacos de OCR (`1§`, `e o`, `e a`, `um verbo`), remove marcadores Markdown/HTML cruzados e impede a exibicao de asteriscos, tags ou caracteres estranhos.
- `src/scratch/normalize_bank_formatting.py` materializa essa limpeza na base (marcadores cruzados, asteriscos residuais, ligaduras OCR e fontes/instrucoes coladas); `src/scratch/apply_vector_marks.py` recupera 146 sublinhados com contexto geometrico unico dos PDFs. O conteudo sincronizado de `simuladoQuestions.ts` preserva a mesma apresentacao.
- A questao `verbos-pdf_7-q1` agora abre com caixa de Texto de Apoio, rotulo `Texto I`, titulo `A complicada arte de ver`, paragrafos numerados legiveis, fonte separada e as cinco alternativas com o verbo destacado.
- Verificacao no navegador: 531 cartoes publicos, 352 caixas de texto de apoio, 381 blocos de fonte e 241 titulos. A varredura nao encontrou texto colado, cabecalho vazado, fonte absorvendo instrucao, tags ou marcadores literais, nem caracteres `�`, `¢`, `€` ou `†`; console sem erros/avisos.
- Comparacao independente com os sete PDFs publicos: 531/531 questoes, 0 divergencias de letra de gabarito e 0 inconsistencias entre `correctLetter` e a alternativa marcada. Build e lint aprovados; permanecem somente os tres avisos historicos de efeitos e o alerta de chunk grande do Vite.

### 2026-08-30 - rodada 30: restauração de apoios ausentes e revalidação final

- `src/scratch/restore_missing_support.py` passou a restaurar os trechos que os PDFs disponibilizam apenas como imagem: *Viagens de Gulliver*, a cena de Xantós, *O silêncio incomoda*, *Retrato* e *Mulheres de Atenas*. Cada um voltou ao campo de texto de apoio, preservando rótulo, título, parágrafos e fonte no mesmo bloco de leitura, sem absorção pelo enunciado.
- `src/scratch/normalize_bank_formatting.py` recebeu proteções adicionais de OCR e marcação pedagógica. Foram corrigidas formas como `privilégios`, `herbáceas`, `definitivamente`, `ser humano` e espaçamentos colados; a sincronização foi refeita para as 92 questões publicas de simulados.
- Revalidação no navegador: as 531 questões publicas carregaram de uma vez (1.633.408 caracteres), com 361 caixas de apoio, zero caractere de substituição e as quatro passagens restauradas verificadas na renderização.
- Verificações finais: normalização, sincronização e `audit_question_bank.py` aprovados para 531 questões / 7 PDFs, incluindo gabaritos e estrutura; `npm run lint` sem erros novos e `npm run build` aprovado. Permanecem apenas os três avisos históricos de `set-state-in-effect` e o aviso conhecido de tamanho do bundle.

### 2026-08-31 - rodada 31: suporte estruturado e importação auditável

- `src/data/questionBank.ts`: os registros nativos passaram a carregar `support` explícito (`label`, `title`, `author`, `paragraphs`, `source`), `provenance` (PDF e páginas), `quality` (`verified`/`warning`) e `emphasisNotes`; `readingText` permanece apenas como fallback de migração. Os 531 itens publicos foram migrados, com 369 apoios estruturados, 531 proveniências completas, 531 estados `verified` e zero aviso nativo.
- `src/utils/questionSupport.ts`: parser retrocompatível e normalizador determinístico separam título, autoria, parágrafos, fonte e comandos; títulos perdem `<u>`/`**`, enquanto destaques pedagógicos do corpo são preservados. A validação detecta corrupção, tags desbalanceadas, fonte sem corpo, referência visual sem alvo e importações sem justificativa semântica.
- `QuestionBankView.tsx` e `SimuladosView.tsx`: o renderizador usa uma única hierarquia editorial (rótulo em caixa alta, título sem sublinhado, autor discreto, parágrafos reais e fonte no rodapé do mesmo box), com atributos de auditoria visíveis no DOM. A questão `verbos-pdf_7-q5` remove o sublinhado decorativo de `castigadas` e mantém o destaque semanticamente necessário de `pros seus maridos`.
- `pdfImportService.ts` e `ImportPdfModal.tsx`: novas importações solicitam o objeto estruturado à IA, exigem justificativa para cada destaque, normalizam o resultado e salvam itens ambíguos sem bloquear o fluxo. Ao terminar, o modal mostra quantidade salva e a lista persistente de avisos por questão; itens com aviso recebem selo `Revisar` no banco.
- `audit_question_bank.py` agora reprova suporte inválido, metadados decorativos, páginas ausentes, qualidade nativa não verificada e regressões de marcação. Resultado: `OK: 531 questões, 7 PDFs, gabaritos e estrutura consistentes.`
- `sync_simulado_question_content.py` propagou suporte, proveniência e qualidade para as cópias dos simulados sem duplicar conteúdo. Lint e build de produção aprovados; permanecem somente os três avisos históricos de efeitos e o alerta de chunk grande do Vite.
- A auditoria visual utiliza o fluxo publico de 531 cartões, sem rota ou galeria para cadernos privados. A varredura final confirmou zero tags literais/caracteres corrompidos e zero overflow no desktop; em 390 px, a galeria pública manteve largura de 385 px sem overflow.

### 2026-08-31 - rodada 32: coleção independente de Inglês (1.500 questões)

- `src/scratch/import_english_questions.py` passou a importar deterministicamente `1500 Questões de Inglês para Concursos Militares.pdf`: 197 páginas, 1.500 questões, 24 subdivisões exatamente na ordem do índice e questões nas páginas 2–189.
- `src/data/englishQuestionBank.ts` contém a coleção nativa de Inglês com `language: "en"`, `listId`/`subjectId` por assunto, banca impressa quando disponível, páginas de origem e suporte estruturado para passagens de leitura. As traduções (páginas 177–189) ficam em sua própria subdivisão e não recebem banca inventada.
- A seção `Answers` das páginas 190–196 foi lida por tópico e número. Os 1.500 registros estão associados à letra oficial e à página exata do gabarito; não há divergências.
- A normalização corrige espaços de palavras partidos pelo texto extraído, hifens separados, o único glyph `¢` usado como travessão e o caso da questão `Verbs 171`, em que o PDF repetia `a)` nas cinco alternativas. Na questão `Reading 104`, a ordem impressa `A, B, C, E, D` foi preservada, mas todos os rótulos continuam utilizáveis e o gabarito permanece o oficial.
- `src/data/englishSubjects.ts` define as 24 subdivisões, contagens e descrições. `QuestionBankFilterView.tsx` ganhou o seletor explícito **Português / Inglês**; filtros, contadores, pré-visualização e listas persistentes não misturam idiomas. A base portuguesa e seus cadernos ocultos continuam inalterados.
- `src/scratch/audit_english_question_bank.py` valida quantidade, unicidade, assuntos, páginas, alternativas, letra marcada e gabarito relido do PDF. `npm run import:english` regenera o módulo e os relatórios; `npm run audit:english` retorna `1500 questões, 24 tópicos, 1500 respostas, 0 divergências, 0 avisos`.
- Relatórios gerados: [`reports/english-question-audit.md`](./reports/english-question-audit.md) e [`reports/english-question-audit.json`](./reports/english-question-audit.json). README atualizado com fonte, subdivisões, comandos e critérios de auditoria.
- Verificações: auditoria de Inglês aprovada, build de produção aprovado. O chunk principal aumentou por embarcar o acervo local e o alerta de tamanho do Vite permanece documentado; os três avisos históricos de efeitos React não foram alterados.

### 2026-08-31 - rodada 33: normalização OCR e parágrafos da coleção inglesa

- O importador inglês recebeu uma tabela explícita de reparos para palavras partidas pelo limite de fonte do PDF, incluindo ocorrências em inglês e português (`Fortunately`, `logistically`, `fingerprint`, `companhias`, `educação`, `comunicar-se`, `ataques`, `periódico`, entre outras). O reparo preserva caixa, acentos, contrações e expressões legítimas; respostas do gabarito usam apenas normalização de espaços para nunca juntar letras de alternativas (`B E`).
- Hifens com espaços laterais agora são recompostos (`eight-year-old`, `long-term`) e passagens longas sem linha vazia são divididas por fronteiras visuais de sentença. O apoio de *Sticky Fingers*, por exemplo, passou a ter cinco parágrafos legíveis; textos de leitura compartilham esses blocos sem duplicação.
- Nova execução de `npm run import:english` gerou 1.500 registros, 24 assuntos, 1.500 respostas oficiais e zero avisos. `npm run audit:english` confirmou zero divergências, páginas válidas, alternativas completas e exatamente um gabarito por questão.
- Varredura no navegador com todas as questões: 1.500 cartões, 124 caixas de apoio, 92 fontes, 71 títulos e 20 autorias; zero caracteres de substituição, tags literais, separação OCR conhecida ou overflow horizontal em viewport de 571 px. As fontes ficam no rodapé do mesmo box e as passagens continuam segmentadas.
- Auditorias de regressão (`audit:questions`, `audit:question-report`, `audit:verbs`), lint e build foram executados novamente. O lint mantém somente os três avisos históricos de `set-state-in-effect`; o build mantém apenas o alerta conhecido de chunk grande por causa do acervo local.
- Revisão de segunda passagem removeu divisões residuais em textos bilingues (por exemplo, `governments`, `financial`, `concluíram`, `opções`, `optam por tal sistema`, `reforços`, `comunicar-se`, `discretely`, `trustworthy` e `turtles`). Uma regra incorreta que transformava o legítimo `por tal` em `portal` foi retirada; o gabarito continua isolado da tabela lexical para não colapsar pares de letras.

### 2026-08-31 - rodada 34: cabeçalho editorial da pré-visualização

- `src/components/QuestionBankView.tsx`: o cabeçalho da resolução foi reorganizado em três níveis (retorno/título, métricas independentes e controles), removendo a linha única congestionada. Assuntos e caderno de Verbos agora têm leitura própria; paginação e status usam grupos alinhados.
- A hierarquia visual passou a usar títulos sans semibold, métricas em cards iguais e rótulos curtos, preservando todas as ações de pré-visualização, listas e cópia.
- Navegador: desktop e viewport de 390 px conferidos; `scrollWidth` permaneceu dentro da viewport e não houve sobreposição no cabeçalho. Build e lint aprovados (somente os três avisos históricos de efeitos React).

### 2026-08-31 - rodada 35: resumo de filtros e nomes de listas

- `src/components/QuestionBankView.tsx`: removido o seletor de status duplicado do cabeçalho da resolução; status continua sendo escolhido somente no menu de filtros.
- O texto `Caderno de Verbos · 92 questões` agora aparece apenas quando o tópico `Verbos` é o único selecionado, evitando informação incorreta ao selecionar todos os assuntos.
- Nomes de listas persistentes passaram a incluir o status quando aplicável (`Pendentes`, `Acertos` ou `Erros`), diferenciando listas com o mesmo assunto e filtros diferentes. O `statusFilter` já persistido continua sendo mantido no registro.
- Verificações: no navegador, “Todos os Assuntos” não exibiu o caderno de Verbos e “Verbos” isolado exibiu o resumo correto; build aprovado e lint sem erros, com os três avisos históricos de efeitos React.

### 2026-08-31 - rodada 36: IA de importacao no servidor e limpeza do fluxo de questoes

- `src/components/QuestionBankView.tsx` e `src/components/SimuladosView.tsx`: removidas as duas linhas decorativas que apareciam em todos os cartoes (a borda inferior do bloco da questao e a borda superior das acoes de confirmacao). O espaco entre alternativas, confirmacao e proxima questao permanece, sem criar divisores artificiais.
- `vite.config.ts`: adicionada a rota local `/api/ai/import`, com middleware para desenvolvimento e preview. A rota le `OPENROUTER_API_KEY` e `OPENROUTER_MODEL` exclusivamente do ambiente do servidor e encaminha as mensagens para o OpenRouter sem expor credenciais ao bundle.
- `src/services/pdfImportService.ts`: a importacao de PDF deixou de ler chave/modelo no navegador e passou a chamar somente `/api/ai/import`; mensagens de erro agora orientam a configuracao do servidor.
- `src/components/SettingsView.tsx`: removidos os campos para escolher modelo e digitar chave. A guia informa que a IA e gerenciada pelo servidor e documenta as variaveis esperadas em `.env.local`.
- Os componentes e o servico legados de geracao de questoes ineditas (`QuestionsView.tsx`, `MilitaryExamSimulator.tsx`, `Navbar.tsx` e `aiGenerator.ts`) foram removidos; nao existe mais uma aba ou caminho cliente para gerar questoes por IA.
- `src/utils/srsEngine.ts`: credenciais antigas encontradas no `localStorage` sao descartadas durante a leitura e nunca mais sao gravadas, evitando que configuracoes legadas permaneçam no cliente.
- `.env.local.example`: inclui o modelo e a chave de exemplo, sem prefixo `VITE_`; o arquivo `.env.local` real continua ignorado pelo Git.
- Verificacoes: `npm run build` aprovado; `npm run lint` sem erros, mantendo apenas os tres avisos historicos de efeitos React. A rota de importacao retorna aviso configuravel quando a chave nao esta presente, sem vazar credenciais.

### 2026-08-31 - rodada 37: simetria dos controles da pre-visualizacao

- `src/components/QuestionBankView.tsx`: cards de `Resolvidas` e `Precisao` agora pertencem a um grupo fixo de 224 px, com larguras iguais e alinhamento central responsivo.
- O controle `Por pag.` usa o mesmo comprimento total do grupo de metricas; seus cinco botoes dividem o espaco de forma uniforme, evitando que `Todas` fique mais largo ou que o conjunto pareca deslocado.
- A validacao visual no navegador conferiu o cabecalho em desktop e a composicao responsiva; nao houve sobreposicao ou overflow horizontal. Build e lint permanecem aprovados, com apenas os tres avisos historicos de efeitos React.

### 2026-08-31 - rodada 38: separacao editorial de apoios em Portugues e Ingles

- `src/scratch/normalize_bank_formatting.py` passou a ser idempotente: remove instrucoes de leitura que haviam vazado para o apoio (`Leia`, `Apos a leitura`, `Lido o texto`, `Para responder a questao`), separa titulo/autor/fonte sem repetir blocos e elimina cartoes formados apenas por citacao.
- Passagens longas que estavam embutidas no enunciado foram promovidas para `support.paragraphs` somente quando a fronteira era inequívoca. Foram promovidos 20 registros portugueses (incluindo os exemplos de encontros vocalicos, crase e modos verbais); o apoio nativo passou de 369 para 388 itens. A compatibilidade `readingText` foi regenerada em paralelo e os 152 itens de simulados foram sincronizados.
- Marcacoes solicitadas pelo proprio enunciado voltaram aos alvos corretos nas questoes 19 de Fonetica e 14/18 de Modos Verbais; o trecho explicitamente destacado de Transumanismo recebeu um unico alvo semântico. Nenhuma letra de gabarito ou alternativa foi alterada.
- `src/scratch/import_english_questions.py` aplica a mesma separacao durante novas importacoes. Foram promovidas 43 passagens inglesas (incluindo Articles, Active/Passive, Direct/Indirect, Mixed Topics e Synonyms); a colecao passou a 167 apoios estruturados, sem `null` e sem titulos que sejam apenas citacoes.
- `src/utils/questionSupport.ts` agora limpa instrucoes redundantes tambem em imports futuros e recalcula a qualidade apos a normalizacao. `audit_question_bank.py` e `audit_english_question_bank.py` reprovarao instrucoes de leitura no apoio ou passagens longas embutidas no enunciado.
- Auditorias: `audit:questions` confirmou 591/591, 9 PDFs e gabaritos consistentes; `audit:english` confirmou 1.500/1.500, 24 assuntos, 1.500 respostas e 0 divergencias. Build aprovado; lint aprovado com os tres avisos historicos de `set-state-in-effect` e o alerta conhecido de chunk grande do Vite.
- Navegador: a pré-visualização exibiu o apoio da questão 2 de Fonética em caixa própria, com enunciado separado, sem linha `Leia` duplicada, sem overflow ou sobreposição. A inspeção de todos os cartões e a checagem determinística dos 2.091 registros não encontraram instrução redundante no apoio.

### 2026-08-31 - rodada 39: revisão visual de cartões vazios e comandos nos metadados

- `src/scratch/normalize_bank_formatting.py` passou a mover citações que estavam no início do corpo para `support.source`, remover títulos que eram comandos (`Leia`, `Após a leitura`, `Texto para responder` e variantes) e conservar títulos literários curtos, inclusive os terminados em reticências.
- Apoios metadata-only repetidos entre questões agora reutilizam o trecho canônico identificado pelo título/citação. As páginas escaneadas de `A PIPOCA` foram recuperadas em `src/scratch/recovered_pipoca.txt` e aplicadas às três questões que antes exibiam apenas título/fonte; nenhuma caixa de apoio permanece sem corpo.
- `src/scratch/import_english_questions.py` e `audit_english_question_bank.py` deixam de aceitar URL/citação como apoio autônomo: questões baseadas em imagem/cartum não exibem balão textual vazio, enquanto passagens ativas continuam compartilhadas normalmente.
- Auditoria visual no navegador: pré-visualização portuguesa com 531 cartões montados, 373 caixas de apoio, zero caixas vazias, zero instruções genéricas isoladas e `bodyScrollWidth` dentro dos 1.280 px da viewport. A questão 2 de Fonética foi conferida com apoio e enunciado em blocos distintos.
- Verificações finais: `audit:questions` (591/591, 9 PDFs, gabaritos consistentes), `audit:english` (1.500/1.500, 0 divergências), `audit:question-report` (591 fichas, 591 verificadas, 0 avisos), auditoria verbal (163 verbos) e build TypeScript/Vite aprovados. O lint mantém somente os três avisos históricos de `set-state-in-effect`.

### 2026-08-31 - rodada 40: regeneração dos casos análogos e varredura completa

- O importador inglês agora separa, de forma determinística, trechos que chegam no mesmo bloco do comando: marcadores de lista, frases citadas, letras de música, diálogos e textos com instrução após o apoio. A limpeza remove a abertura redundante `Read/Leia/Observe` quando o trecho já está no card de apoio e conserva apenas a ordem operativa (por exemplo, `Fill in the gaps` ou `It may be inferred`).
- Apoios compostos por uma linha de fonte ou por uma instrução de imagem não são mais associados à passagem anterior. Isso corrigiu contaminações entre artigos da seção Reading Review, inclusive as questões da NMSU, a frase de afluência pública/privada, o trecho dos estaleiros japoneses e a letra de *The Big Bang Theory*. O caso específico de `A PIPOCA` continua hidratado pelo fixture recuperado das páginas digitalizadas.
- `paragraphs_from_text` preserva quebras de versos e diálogos curtos; `QuestionBankView.tsx` não cria uma caixa vazia quando o enunciado é somente uma instrução já absorvida pelo apoio. O auditor inglês passou a reprovar novamente comandos `Read/Leia/Observe` redundantes em cartões que tenham apoio.
- O grupo das métricas e o seletor `Por pág.` foram equalizados em 240 px; a largura extra comporta `Todas` sem overflow interno e preserva a simetria em desktop e celular.
- Regeneração concluída: 1.500 questões inglesas em 24 subdivisões, 251 apoios textuais válidos, 1.500 gabaritos oficiais; 591 questões portuguesas, 373 apoios públicos e 591 fichas de auditoria. Não há avisos, divergências de gabarito, apoios vazios ou fontes sem corpo.
- Varredura pelo navegador: 1.500 cartões ingleses e 531 cartões portugueses renderizados de uma vez em viewport de 1.280 px, `bodyScrollWidth` no máximo 1.280 px, sem overflow horizontal da página, zero caixas de apoio vazias e nenhum comando `Read/Leia/Observe` redundante no início de cartão com apoio.
- Verificações finais executadas novamente: `audit:questions`, `audit:english`, `audit:question-report`, `audit:verbs`, `npm run build` e `npm run lint`. O build passou; o lint mantém somente os três avisos históricos de `set-state-in-effect` e o Vite mantém o alerta conhecido de chunk grande do acervo local.

### 2026-08-31 - rodada 41: divisor entre questoes

- `src/components/QuestionBankView.tsx` e `src/components/SimuladosView.tsx`: removida a borda inferior do bloco de metadados que criava uma linha entre o contador e o enunciado.
- O divisor agora aparece no topo de cada questao a partir da segunda do conjunto, separando visualmente cartoes consecutivos sem inserir uma linha extra antes da primeira. O espacamento superior foi ajustado para manter a hierarquia entre o divisor e o contador.
- A estrutura interna do apoio, enunciado, alternativas e acoes permaneceu inalterada; a mudanca e somente de separacao visual entre questoes.

### 2026-08-31 - rodada 42: idiomas em bandejas no filtro do banco

- `src/components/QuestionBankFilterView.tsx`: removido o cartao separado de “Subdivisao do banco” com botoes lado a lado. Portugues e Ingles agora aparecem como duas bandejas empilhadas no painel de assuntos, sempre nessa ordem.
- A bandeja ativa exibe o seletor de assuntos e pode ser recolhida; a bandeja inativa permanece visivel logo abaixo/acima para troca imediata, com contagem propria. A troca de idioma continua resetando assuntos, status e quantidade para evitar misturas entre colecoes.
- Verificacao no navegador: as duas bandejas aparecem com estado `aria-pressed` correto, Inglês abre seus 24 assuntos ao ser selecionado, Portugues permanece como bandeja independente e `scrollWidth` (1.275 px) ficou dentro da viewport de 1.280 px. Build aprovado; lint sem erros, mantendo os tres avisos historicos.

### 2026-08-31 - rodada 43: configuracoes essenciais

- `src/components/SettingsView.tsx`: a guia de Configurações foi reduzida a um unico cartao objetivo, contendo somente quantidade de colunas, uso de acentuacao estrita, Resetar dados e Salvar.
- Removidos os paineis de IA, privacidade, resumo, textos auxiliares e status decorativos que poluiam a tela. As preferencias existentes continuam sendo lidas, editadas e salvas sem mudar o contrato de `UserSettings`.
- Verificacao no navegador: apenas os controles essenciais aparecem, os botoes de colunas mantem estado `aria-pressed`, o salvamento exibe confirmacao e a largura do documento permanece dentro da viewport (1.280 px). Build aprovado; lint sem erros, mantendo os tres avisos historicos.

### 2026-08-31 - rodada 44: tema claro acessivel

- `src/utils/srsEngine.ts`: `UserSettings.theme` agora aceita `dark` ou `light`, com normalizacao segura de valores antigos/invalidos.
- `src/App.tsx`, `src/main.tsx` e `index.html`: o tema persistido e aplicado antes da pintura inicial e atualizado imediatamente quando salvo, incluindo `color-scheme` para controles nativos.
- `src/components/SettingsView.tsx`: adicionada uma selecao compacta Escuro/Claro ao cartao essencial de configuracoes; o restante do painel continua sem paineis auxiliares.
- `src/index.css`: tokens e overrides claros para fundos, bordas, tipografia, estados semanticos, selecao, scrollbar, modal de importacao, tabelas e banco de questoes. As caixas de enunciado e apoio deixam de receber fundos escuros no tema claro.
- Verificacao visual no navegador: Configuracoes, Tabela Unica, modal de importacao e as colecoes completas foram conferidos em tema claro — 531 questoes portuguesas (373 apoios) e 1.500 inglesas (251 apoios). Nao houve fundos escuros residuais nos cartoes, textos ilegiveis ou overflow; `scrollWidth` ficou em 1.275 px numa viewport de 1.280 px. Tema escuro foi restaurado apos o teste. Build aprovado; lint sem erros, mantendo os tres avisos historicos e o alerta conhecido de chunk grande.

### 2026-08-31 - rodada 45: retirada definitiva dos cadernos privados de 30 verbos

- Solicitação do produto: os dois cadernos privados de 30 questões não são acervo público e não devem permanecer no código ou na distribuição.
- `src/data/questionBank.ts` passou de 591 para **531** registros: somente os sete PDFs públicos (81 + 74 + 94 + 69 + 28 + 93 + 92) permanecem no banco canônico.
- `src/data/simuladoQuestions.ts` passou de 152 para **92** cartões e o tipo `SimuladoQuestion.listId` agora aceita apenas `pdf_7`.
- Os PDFs privados foram removidos de `lists/`; o arquivo legado `src/data/militaryQuestions.ts`, que continha cópias das questões, também foi removido. O contrato `MilitaryQuestion` sem consumidores foi eliminado de `src/types/verbs.ts`.
- `QuestionBankView`, `QuestionBankFilterView`, `App` e `SimuladosView` não possuem mais modo de auditoria, filtros ou abas para cadernos privados. O parâmetro `?audit=questions` deixou de alterar o fluxo público.
- Geradores e auditores de manutenção foram ajustados para considerar somente os sete PDFs públicos; scripts históricos que dependiam exclusivamente dos cadernos privados foram aposentados. Snapshots temporários e bytecodes rastreados contendo os dados privados foram removidos.
- O relatório `reports/question-audit.{json,md}` foi regenerado com 531 fichas, 531 itens verificados, 0 avisos e 0 divergências de gabarito. A busca no código-fonte não encontra mais IDs, títulos ou conteúdos dos dois cadernos.
- Risco controlado: listas persistidas em `localStorage` de versões antigas podem conter IDs removidos; ao abrir uma lista, esses IDs são ignorados pelo mapa atual e não reaparecem no banco. Nenhum novo importador aceita esses identificadores.

### 2026-08-31 - rodada 46: seletor responsivo de paginação

- `QuestionBankView.tsx` e `SimuladosView.tsx`: a bandeja `Por pág.` deixou de comprimir o rótulo e os cinco botões em viewports estreitos. Em telas móveis, o rótulo ocupa sua própria linha e a segmentação usa toda a largura disponível; a partir de `sm`, o controle mantém largura fixa de 280px para preservar a simetria do cabeçalho.
- Os botões receberam altura e espaçamento consistentes, `whitespace-nowrap` e distribuição flexível uniforme; `Todas` não é mais esmagado junto dos valores numéricos.
- Verificação no navegador: viewport 360px sem overflow, bandeja de 280px com cinco opções de 54px; desktop 1280px com bandeja de 280px e segmento de 204px. Screenshot mobile conferido visualmente e viewport restaurado ao padrão.
- Verificações: `npm run build` aprovado; `npm run lint` aprovado com apenas os três avisos históricos de `set-state-in-effect`; `git diff --check` sem erros de conteúdo.

### 2026-08-31 - rodada 47: saneamento de sublinhados e fontes contaminadas

- A questão `verbos-pdf_7-q6` foi conferida diretamente na página 12 de `7. Verbos.pdf`: o parágrafo “Bons tempos aqueles...” não tem destaque no original. O sublinhado de parágrafo inteiro foi removido, `Acesso em ago. 2020` saiu do enunciado e voltou para a fonte no rodapé do mesmo apoio, e o comando passou a dizer “período apresentado” para não prometer um alvo visual inexistente.
- A questão `verbos-pdf_7-q10` foi conferida na página 25: o destaque pedagógico permanece em `NÃO` e nas formas verbais das alternativas, enquanto o sublinhado decorativo de `Assinale` foi removido. A cópia do simulado foi sincronizada com o banco canônico.
- `normalize_bank_formatting.py` agora remove marcação do iniciador de comandos no começo do enunciado, move linhas de acesso bibliográfico para `support.source` e mantém a exceção do PDF explicitamente registrada. `questionSupport.ts` aplica as mesmas regras a importações futuras, remove um parágrafo de apoio inteiramente marcado quando não há justificativa semântica e emite avisos para regressões.
- Conferência visual no navegador: q6 exibe o parágrafo em prosa normal e a fonte (URL + data de acesso) no rodapé do mesmo box; q10 exibe `Assinale` sem sublinhado e preserva somente `NÃO` e as formas verbais pedagógicas nas alternativas.
- Auditoria determinística: 531 questões públicas, 7 PDFs, gabaritos e estrutura consistentes; relatório regenerado com 531 fichas verificadas, 0 avisos e 0 divergências. A busca de regressão não encontrou `<u>Assinale</u>`, datas de acesso no início do enunciado ou marcação integral no apoio de q6.
- Verificações executadas: `npm run audit:questions`, `npm run audit:question-report`, `npm run audit:english`, `npm run audit:verbs` e `npm run build`, todos aprovados. O lint mantém somente os três avisos históricos de efeitos React e o Vite mantém o alerta conhecido de chunk grande.

### 2026-08-31 - rodada 48: simetria das métricas do cabeçalho

- `src/components/QuestionBankView.tsx`: o grupo de `Resolvidas` e `Precisão` foi reduzido de 240 px para 200 px, alinhando suas extremidades ao segmento útil dos cinco botões de `Por pág.` (sem o rótulo). Os dois cards continuam com a mesma largura e distribuição responsiva.
- A alteração preserva a leitura dos valores e evita que as métricas pareçam mais largas que o controle de paginação em telas estreitas; não há mudança de comportamento ou de dados.
- Verificações: `npm run build` e `npm run lint` aprovados; a inspeção visual no navegador confirmou as métricas com 200 px, o segmento de paginação com 204 px (incluindo borda/padding) e `scrollWidth` de 1.275 px em viewport de 1.280 px, sem overflow. O lint mantém somente os três avisos históricos de `set-state-in-effect`.

### 2026-08-31 - rodada 49: Home e gaveta de navegação

- `src/components/HomeView.tsx`: criada uma Home compacta com apresentação do ConjuLetter, escopo do acervo, importação assistida de PDFs e card externo do VocabLab (`https://vocablab-revolution.vercel.app/`). O texto deixa explícito que a IA organiza o material importado, sem criar questões.
- `src/components/Header.tsx`: a navegação superior agora inicia centralizada na pill Home. A seta abre/recolhe, com animação suave, as pills Tabelas e Banco de Questões; o menu do Banco preserva os acessos a Filtrar banco e Listas salvas. O logo também retorna à Home.
- `src/App.tsx`: `home` passou a ser a aba inicial e renderiza `HomeView`, mantendo Tabelas, Banco, Listas e Configurações como destinos existentes.
- `src/index.css`: adicionados estilos responsivos e acessíveis para a gaveta, estados ativos, transições, card editorial da Home e tema claro, sem criar uma landing page extensa.
- Verificações: Home renderizada no navegador, expansão/recolhimento da gaveta e navegação para Tabelas conferidos; link do VocabLab exposto com destino correto. `npm run build` aprovado; `npm run lint` aprovado com apenas os três avisos históricos de `set-state-in-effect`.

### 2026-08-31 - rodada 50: refinamento visual da Home e da gaveta

- `src/components/Header.tsx`: a navegação superior foi compactada e o indicador da gaveta passou a usar seta lateral (`ChevronRight`), apontando para a direita fechada e para a esquerda aberta.
- `src/components/HomeView.tsx`: removidos o hero, tags e cards da Home. O conteúdo ficou vertical e essencial, com apenas título, seção “Sobre o projeto” e seção/link do VocabLab.
- `src/index.css`: reduzidos altura, padding e tipografia das pills; a Home agora usa separadores discretos, sem caixas, e mantém transições de foco/hover.
- Verificação visual no navegador: Home sem blocos de fundo, navegação compacta e seta lateral conferidas; build aprovado.

### 2026-08-31 - rodada 51: texto institucional centralizado

- `src/components/HomeView.tsx`: o título passou a ser `A Nova Alexandria` e o conteúdo institucional foi substituído pelo texto aprovado, com `ConjuLetter` destacado semanticamente e a seção VocabLab preservada como destino relacionado.
- `src/index.css`: toda a composição textual da Home foi centralizada, com largura de leitura controlada e separadores discretos, mantendo o desenho editorial sem caixas.
- Verificação visual no navegador: título, Sobre o projeto e VocabLab ficaram centralizados e legíveis; build e lint aprovados (somente os três avisos históricos de `set-state-in-effect`).

### 2026-08-31 - rodada 52: tema Alexandria e arquitetura visual reversível

- `src/utils/srsEngine.ts`, `src/App.tsx` e `src/main.tsx`: o contrato de preferências passou a aceitar `alexandria`, preservando valores `dark`/`light` antigos e aplicando `color-scheme` coerente antes da pintura inicial.
- `src/components/SettingsView.tsx`: adicionadas três opções visuais (Original escuro, Original claro e Alexandria), com amostras, prévia imediata e restauração do tema persistido ao sair sem salvar.
- `src/index.css`: criados tokens semânticos de superfície, texto, borda, acento e estados; os valores atuais dos temas Original permanecem intactos. Alexandria traduz as classes legadas para azul-marinho, ardósia, creme e cobre, além de primitivas reutilizáveis para superfícies, controles, botões, métricas, opções e respostas.
- `src/components/HomeView.tsx` e `public/alexandria/`: a decoração espacial fica restrita à Home, com estrelas CSS e ilustrações transparentes originais de planeta e foguete, sem astronautas ou texto embutido. Tabelas, banco, importação, listas, modais e Configurações não recebem ilustrações.
- Verificação visual no navegador: Home, Configurações, Tabelas, Banco, questão, modal de importação e gaveta foram conferidos em Alexandria e nos temas Original; celular (390 px) e desktop (1280 px) ficaram sem overflow após corrigir a gaveta móvel. Build e lint aprovados; lint mantém apenas os três avisos históricos.

### 2026-08-31 - rodada 53: refinamento noturno e Lua da Home

- `src/components/HomeView.tsx`: o foguete foi substituído por uma Lua única, com asset transparente isolado; a referência antiga do foguete deixou de ser usada para impedir resíduos de outro planeta.
- `public/alexandria/moon.png`: novo asset lunar em paleta fria, sem texto, anéis, personagens ou outros corpos celestes. O arquivo foi reduzido para uso responsivo; apenas `planet.png` e `moon.png` permanecem ativos no tema.
- `src/index.css`: Alexandria passou de azul ardósia para carvão noturno (`#12131a`), com superfícies escuras e texto creme-lilás. Os acentos de interface, foco, seleção, checkbox, botões, marcadores e estados ativos agora usam lavanda fria; o laranja permanece apenas nas amostras dos temas Original.
- Verificação visual no navegador: Home e seção VocabLab conferidas em 1280 px, questões e controles conferidos sem laranja residual nos estados Alexandria, e questão em 390 px verificada sem overflow. Tema Original foi restaurado após os testes. Build e lint aprovados; lint mantém somente os três avisos históricos.

## 9. Pendencias e melhorias futuras

- Tratar os 3 avisos restantes de efeitos nos componentes de treino sem alterar a experiencia de reset/foco.
- Dividir `questionBank.ts` por assunto e carregar sob demanda para reduzir o chunk principal.
- Adicionar OCR automático para novas páginas que venham a ser importadas apenas como imagem; os casos atuais foram restaurados e protegidos por auditoria determinística.
- Trocar os caminhos absolutos remanescentes dos scripts historicos por caminhos relativos ou aposenta-los.
- Revalidar periodicamente as formas de maior recorrencia quando novas edicoes dos PDFs ou novas orientacoes normativas forem incorporadas.
