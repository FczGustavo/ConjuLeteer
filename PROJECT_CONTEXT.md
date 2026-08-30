# ConjuLetter - contexto vivo do projeto

> Memoria operacional obrigatoria. Este arquivo deve ser lido antes de qualquer alteracao e auditado depois de cada rodada de mudancas.

## 1. Proposito

O ConjuLetter e uma aplicacao educacional de Lingua Portuguesa voltada a concursos militares. O produto combina treino de conjugacao, questoes procedurais, simulados e um banco de questoes extraido de apostilas em PDF.

## 2. Arquitetura atual

- Stack: React 19, TypeScript 6, Vite 8 e Tailwind CSS 4.
- Execucao: SPA inteiramente no navegador; nao existe servidor/backend proprio neste repositorio.
- Persistencia: `localStorage` para configuracoes, estatisticas SRS, atividade diaria, respostas e questoes importadas.
- Integracao externa: OpenRouter; a chave e obrigatoria para a aba `Questoes` e para importacoes assistidas por IA.
- Navegacao principal:
  - `Tabelas`: treino de conjugacao e comparacoes.
  - `Questoes`: geracao exclusivamente por IA, sob demanda, sem carregar questoes locais.
  - `Banco de Questoes`: filtro e resolucao das questoes extraidas dos PDFs.
- Fontes de dados:
  - `src/data/canonicalVerbs.ts`: verbos e conjugacoes canonicas; incorpora o catalogo gerado offline em `src/data/expandedVerbs.ts`.
  - `src/data/militaryQuestions.ts`: questoes procedurais curadas.
  - `src/data/questionBank.ts`: 591 questoes extraidas de nove PDFs.
  - `src/data/simuladoQuestions.ts`: conjunto legado de simulados de verbos.
- Servicos equivalentes ao backend:
  - `src/services/aiGenerator.ts`: chamada ao OpenRouter, planejamento/calibracao de lotes e validacao/revisao independente.
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
| Modos Verbais I | 30 | `16. Modos Verbais I - [check].pdf` |
| Modos Verbais II | 30 | `17. Modos Verbais II - [check].pdf` |
| **Total** | **591** | **9 PDFs** |

## 5. Diagnostico inicial - 2026-08-28

### Integridade de gabaritos

- Todas as 591 questoes possuem uma resposta oficial localizavel nos PDFs.
- Foram encontradas 12 divergencias entre `questionBank.ts` e os PDFs:
  - Fonetica: Q1, banco B / PDF C.
  - Acentuacao: Q17, banco A / PDF C.
  - Formacao: Q17, banco A / PDF C; Q19, banco D / PDF B.
  - Classes invariaveis: Q8, banco B / PDF C; Q11, banco D / PDF A; Q22, banco C / PDF D.
  - Pronomes: Q19, banco D / PDF E.
  - Verbos: PDF 7 Q70, banco A / PDF D.
  - Modos Verbais II: Q18, banco A / PDF C; Q28, banco A / PDF B; Q29, banco A / PDF B.
- Modos Verbais II Q19 possui `correctLetter: E`, mas nenhuma opcao esta marcada como correta.
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
2. Rodar o auditor do banco contra os nove PDFs.
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
- A questão 22 de Modos Verbais II deixou de referir-se a um texto inexistente e passou a nomear diretamente as três formas verbais que devem ser classificadas.
- `QuestionBankView.tsx`: título, corpo e fonte bibliográfica do texto de apoio são separados visualmente; citações autor-data/publicação entre parênteses também são reconhecidas como fonte.
- `audit_question_bank.py`: além de comparar os 591 gabaritos com os PDFs, agora reprova caractere corrompido, marcador `--- PAGE`, parágrafo colado, referência `TEXTO I/II/III` sem apoio e ausência dos textos escaneados restaurados.
- Resíduos finais: zero `�`, `¢`, `€`, `†`, marcadores de página, `aafirmativa`, `Websterr`, `LfiPM` e marcadores de parágrafo colados. Foram contabilizados 401 itens com texto de apoio.
- Verificações: auditor do banco aprovado (591 questões, 9 PDFs), build/TypeScript aprovado, auditor verbal aprovado (33 verbos, 11 paradigmas) e lint sem erros; permanecem os mesmos 3 avisos históricos de `set-state-in-effect` fora do Banco de Questões.
- Os 22 PNGs temporários usados na conferência visual foram removidos após a auditoria.

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

- A aplicação foi aberta no navegador local e cada filtro de assunto foi percorrido com a opção `Todas`: Fonética (81), Acentuação (74), Formação (94), Classes Variáveis (69), Classes Invariáveis (28), Pronomes (93) e Verbos (152, incluindo os cadernos 7, 16 e 17). Total conferido na interface: 591 questões.
- A inspeção DOM de cada lista confirmou a sequência completa de itens, 401 blocos de texto de apoio, fontes no rodapé do cartão, ausência de overflow horizontal e nenhum placeholder, caractere corrompido ou marcador Markdown literal nas questões renderizadas.
- A navegação encontrou e corrigiu três resíduos: a frase `O homem deixou...` indevidamente classificada como título, notas de rodapé de autores exibidas como `*` e a referência de linha `(****. 34-36)`. O texto agora aparece como corpo formatado, sem asteriscos, e `(ℓ. 34-36)`.
- `getReadingMetadata` passou a limitar títulos compostos a linhas curtas sem várias frases; o rótulo duplicado `Fonte:` no início das citações é removido e marcadores de negrito são limpos no rodapé bibliográfico.
- `audit_question_bank.py` ganhou uma regra explícita para reprovar referências de linha que voltem a aparecer como `(****. n)`.
- Verificações finais no navegador: os sete assuntos abriram sem erro, todas as questões foram renderizadas, fontes e comandos permaneceram separados, `scrollWidth === clientWidth` em cada lista, e a busca por resíduos (`�`, `LfiPM`, `Websterr`, `aafirmativa`, `: ança`, `****. 34-36`, `e**`, `tos**`) retornou zero ocorrências.

### 2026-08-29 - rodada 12: título integrado e separação dos cadernos de Verbos

- `QuestionBankView.tsx`: o título do texto de apoio deixou de usar uma caixa interna própria; agora é uma linha integrada ao mesmo bloco do texto, enquanto a fonte permanece no rodapé com separação por borda e espaçamento.
- `QuestionBankFilterView.tsx`: o filtro `Verbos` exibe uma bandeja com os três cadernos reais (`PDF 7 • Verbos (G92)`, `PDF 16 • Modos Verbais I (30T1)` e `PDF 17 • Modos Verbais II (30T2)`), com seleção múltipla e contagem individual.
- `FilterState` e os filtros de montagem/prática agora aplicam `selectedListIds` apenas às questões de Verbos; os nomes das listas selecionadas também aparecem no nome de uma lista persistente criada pelo usuário.
- `audit_question_bank.py`: os totais oficiais de PDF 7/16/17 (92/30/30) passaram a ser verificados explicitamente.
- Auditoria web após a mudança: PDF 7 (92), PDF 16 (30), PDF 17 (30), Fonética (81), Acentuação (74), Formação (94), Classes Variáveis (69), Classes Invariáveis (28) e Pronomes (93) foram abertos integralmente. Total: 591 questões; zero resíduos de texto/formatação e zero overflow horizontal. A estrutura DOM confirmou que o título e o texto compartilham o mesmo bloco visual.
- Verificações: build aprovado, auditor do banco aprovado (591 questões/9 PDFs), auditor verbal aprovado (33 verbos/11 paradigmas) e lint sem erros, com os mesmos 3 avisos históricos fora desta área.

### 2026-08-29 - rodada 13: catalogo offline ampliado e geracao calibrada

- `scripts/build_expanded_verbs.py` extraiu ocorrencias dos nove PDFs, consultou paradigmas lexicograficos apenas durante a geracao do artefato e produziu `src/data/expandedVerbs.ts`. O runtime nao faz chamadas de IA nem de rede para tabelas: o catalogo e as conjugacoes ficam congelados no bundle.
- `src/data/canonicalVerbs.ts` passou a incorporar 130 verbos adicionais (163 no total), ordenados por frequencia observada nos PDFs para priorizacao de estudo. A frequencia e uma medida do corpus local, nao um ranking oficial de bancas. Foi corrigida tambem a forma `precavi` de `precaver`.
- `src/types/verbs.ts` documenta metadados opcionais de frequencia/prioridade; `scripts/audit-verbs.cjs` valida os 163 verbos, os 11 paradigmas, imperativos, formas criticas e derivados prefixais. `src/scratch/generate_high_value_verbs.py` agora delega ao gerador unico, evitando duas fontes de verdade.
- `src/services/aiGenerator.ts` continua sendo o unico caminho de IA para questoes. O prompt foi calibrado com sinais deterministas das 152 questoes verbais do banco (priorizando modo/tempo/flexao e correlacao), detalhou restricoes para os sete tipos de questao e passou a validar semanticamente lacunas, correlacao, imperativo, identificacao morfologica, vozes, duplo participio e homonimos. A ordenacao dos blueprints usa a frequencia local, sem copiar texto dos PDFs, inventar banca ou atribuir fonte.
- `src/components/Header.tsx` ajustou a bandeja do Banco de Questoes para nao causar overflow em 390 px. O fluxo de `Tabelas > Sessao Multi-Tempos` segue offline, sem reposicao, e agora exibe 163 verbos.
- Auditorias: `npm run audit:verbs` aprovado (163 verbos/11 paradigmas); `python src/scratch/audit_question_bank.py` aprovado (591 questoes/9 PDFs); `npm run build` aprovado; `npm run lint` sem erros, com 3 avisos historicos de `set-state-in-effect` em `DrillGrid`/`TablesView`; console do navegador sem erros/avisos.
- Navegador: 20 sorteios consecutivos da Sessao Multi-Tempos produziram 20 verbos unicos; o layout desktop e movel ficou sem overflow; a aba Questoes mostrou somente quantidade 5/10/20, conteudos e verbo opcional, sem seletor de banca.
- Risco residual: as formas foram geradas deterministicamente e auditadas contra regras locais, mas fontes lexicograficas podem atualizar variantes; convem reexecutar o script em uma rodada futura e ampliar os casos dourados antes de tratar o catalogo como imutavel.

### 2026-08-29 - rodada 14: revisão estrutural das questões e identidade da guia

- `src/utils/textFormatter.tsx`: a formatação passou a distinguir prosa, leitura, enunciado estruturado e alternativa. Quebras artificiais de PDF são unificadas, enquanto listas, itens numerados, lacunas e comandos são separados por parágrafos legíveis. Negritos soltos, rótulos numéricos em Markdown e separações de OCR dentro de palavras são normalizados sem retirar destaques linguísticos válidos.
- `src/components/QuestionBankView.tsx`, `src/components/SimuladosView.tsx` e `src/components/QuestionsView.tsx`: os novos modos do formatador foram aplicados ao texto de apoio, enunciado e alternativas para manter espaçamento e hierarquia visual consistentes.
- `src/scratch/generate_clean_bank.py`: foram adicionadas correções determinísticas para os cadernos PDF 16 e 17 e para artefatos recorrentes dos demais PDFs. As correções restauram lacunas, separam itens I/II/III, listas e sequências C/E, removem comandos duplicados e fontes deslocadas e preservam distratores intencionais. `src/data/questionBank.ts` foi regenerado com 591 questões.
- `src/scratch/audit_question_bank.py`: casos dourados passaram a proteger as correções de lacunas, listas, citações e separação de enunciados dos PDFs 16/17, além dos testes anteriores de gabarito e caracteres corrompidos.
- `index.html` e `public/favicon.svg`: o título da guia agora é `ConjuLetter | By Gustavo_Fcs` e o favicon foi substituído por um símbolo minimalista de conjugação, com fundo transparente e sem o antigo raio.
- Auditoria de conteúdo e interface: PDF 16 (30) e PDF 17 (30) foram percorridos integralmente no navegador; o banco completo (591/591) foi renderizado com busca de `**`, `océu`, caracteres corrompidos e marcadores indevidos, todos com zero ocorrências. Em viewport de 390 px, `scrollWidth === clientWidth`, não houve elemento vazando após a verificação final e o console permaneceu sem erros/avisos.
- Verificações finais: auditor do banco aprovado (591 questões/9 PDFs), `npm run audit:verbs` aprovado (163 verbos/11 paradigmas), build aprovado e lint sem erros. Permanecem apenas os 3 avisos históricos de `set-state-in-effect` em `DrillGrid`/`TablesView` e o alerta de chunk grande do Vite.
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
- O banco foi regenerado a partir dos nove PDFs e confrontado integralmente com os nove blocos oficiais de gabarito: 591 questões, 2.803 alternativas e correspondência de letra/numeração por PDF. O auditor também passou a reprovar dezenas de padrões de corrupção de ligaduras, caracteres e palavras coladas.
- A inspeção ortográfica identificou e corrigiu resíduos reais de `fi/fl` e OCR em textos de apoio, como `confiáveis`, `ráfia`, `filósofo`, `financeiramente`, `desconfiança`, `beneficiava`, `corporificada`, `diversificadas`, `garrafinha`, `Báltico`, `Salamina`, `home office`, `Floresta`, `fiordes`, `monóxido`, `chaminés` e `retribuído`. Grafias deliberadas de exercícios, variantes históricas, nomes próprios e citações estrangeiras foram preservadas para não alterar o conteúdo pedagógico nem o gabarito.
- A versão final foi aberta no navegador e as 591 questões foram renderizadas simultaneamente (`Pré-visualização (591 questões)`), totalizando mais de 1,6 milhão de caracteres visíveis; as lacunas foram preservadas, não houve caractere corrompido, negrito solto nem marcador conhecido. As listas também foram percorridas separadamente, inclusive PDFs 7 (92), 16 (30) e 17 (30).
- Em viewport de 390 px, `scrollWidth` ficou abaixo de `innerWidth`, sem overflow horizontal; o console terminou sem erros ou avisos. Build aprovado e lint sem erros, mantendo apenas os três avisos históricos de `set-state-in-effect` e o alerta de chunk grande já documentados.
- Fechamento da rodada: a comparação externa terminou com `163` páginas de referência, `10.758` formas confrontadas, zero falha de consulta e zero divergência. Foram corrigidas ainda as pessoas `nós`/`vós` de `prover`, `precaver` e `valer` (vogal tônica fechada) e o imperativo de `revir` (`revenha`/`não revenha`). O gerador recompõe imperativos somente depois de restaurar eventuais células isoladas, evitando que omissões transitórias da fonte gerem `null`. A auditoria local, a auditoria externa, a auditoria das 591 questões, o lint e o build foram repetidos e aprovados.

### 2026-08-30 - rodada 21: progresso da sessão e simplificação de Verbos

- `src/components/TablesView.tsx`: a Sessão Multi-Tempos passou a controlar um ciclo fechado dos 163 verbos sem reposição. Ao esgotá-lo, o sorteio é encerrado e um novo ciclo somente começa pela ação explícita `Reiniciar ciclo`.
- O antigo contador de sessões foi substituído por progresso semântico: verbos praticados/total, dominados, feitos e pendentes. Uma área expansível lista cada verbo verificado, seu estado e o número de tentativas; reverificar o mesmo verbo atualiza o registro sem duplicar a contagem.
- `src/components/QuestionBankFilterView.tsx` e `src/components/QuestionBankView.tsx`: os cadernos PDF 16 e PDF 17 continuam preservados na base auditada, mas foram ocultados do fluxo do Banco de Questões. O assunto Verbos agora aponta diretamente e exclusivamente para `PDF 7 • Verbos (G92)`, com 92 questões, sem bandeja ou seletor de sublistas.
- Teste no navegador: progresso mudou corretamente de `0/163` para `1/163`, exibindo `1 feito · 162 pendentes`; o filtro isolado de Verbos produziu `Criar Lista (92 questões)` e não renderizou `30T1`, `30T2` nem `Escolha o caderno`. Console sem erros/avisos.
- Verificações: auditor verbal aprovado (163 verbos/11 paradigmas), auditor integral do banco aprovado (591 questões/9 PDFs), lint sem erros novos e build aprovado. Permanecem somente os três avisos históricos de `set-state-in-effect` e o alerta de tamanho do chunk.

### 2026-08-30 - rodada 22: progresso sem resumo duplicado

- `src/components/TablesView.tsx`: removido do cabeçalho o texto solto `Progresso: 0/163 verbos praticados · 0 dominados`. O acompanhamento permanece exclusivamente no box expansível `Progresso da sessão`, evitando informação repetida e mantendo feitos, pendentes e a relação individual de verbos.

## 9. Pendencias e melhorias futuras

- Tratar os 3 avisos restantes de efeitos nos componentes de treino sem alterar a experiencia de reset/foco.
- Dividir `questionBank.ts` por assunto e carregar sob demanda para reduzir o chunk principal.
- Adicionar OCR automático para novas páginas que venham a ser importadas apenas como imagem; os casos atuais foram restaurados e protegidos por auditoria determinística.
- Trocar os caminhos absolutos remanescentes dos scripts historicos por caminhos relativos ou aposenta-los.
- Revalidar periodicamente as formas de maior recorrencia quando novas edicoes dos PDFs ou novas orientacoes normativas forem incorporadas.
