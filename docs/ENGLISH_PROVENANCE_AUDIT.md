# Auditoria de proveniência — banco de Inglês

Data da revisão: 1º de setembro de 2026.

## Resultado

- O PDF contém 1.500 questões e gabaritos para todas elas.
- 1.320 itens trazem banca e ano no próprio cabeçalho. Esses créditos são comparados novamente com o PDF pelo comando `npm run audit:english`.
- Os 180 itens da seção `Translations` não trazem banca, ano ou origem individual no PDF.
- A seção sem crédito foi colocada em `quarantined`: continua no corpus auditável, mas não aparece no banco de estudo.

## Evidência externa

Buscas por frase exata encontraram correspondências em páginas editoriais do Cambridge Dictionary, entre elas:

- `I started to feel queasy as soon as the boat left the harbour.` — [Cambridge Dictionary: queasy](https://dictionary.cambridge.org/dictionary/english/queasy)
- `Student grants these days are paltry.` — [Cambridge Dictionary: paltry](https://dictionary.cambridge.org/dictionary/english/paltry)
- `She sat through the whole meeting without uttering a word.` — [Cambridge Dictionary: utter](https://dictionary.cambridge.org/dictionary/english/utter)
- `The two older children tend to vie with the younger one for their mother's attention.` — [Cambridge Dictionary: vie](https://dictionary.cambridge.org/dictionary/english/vie)

As páginas atribuem o conteúdo lexicográfico à Cambridge University Press. O PDF compilador não apresenta uma licença que autorize a republicação dessas frases como banco derivado. A quarentena é uma medida preventiva de produto, não um parecer jurídico.

## Regra de publicação

Um item inglês só pode aparecer na prática quando tiver crédito verificável no documento-fonte e não estiver marcado como `quarantined` ou `rejected`. Para liberar os 180 itens isolados, é necessário documentar a origem e a licença de cada item ou substituí-los por conteúdo próprio/licenciado.

## Auditoria visual e editorial

As páginas públicas também foram conferidas contra a renderização do PDF. Foram
identificadas 99 questões com dependência visual e vinculados 107 recortes
individuais (tirinhas, anúncios, mapas, fotos e gráficos), sempre com a página,
coordenadas normalizadas e hash do arquivo de origem. O recorte é exibido no
item correspondente; não é usado um screenshot da página inteira.

Os destaques tipográficos (negrito e sublinhado) foram comparados com o texto
impresso: 58 questões receberam 94 marcações auditadas. A verificação também
normaliza quebras de palavras geradas pela camada de fonte (por exemplo,
`ou r` → `our`) sem juntar notações editoriais como `word -ING` ou `own - and`.

O relatório detalhado, incluindo a lista de recortes, hashes e cobertura, está
em [`reports/english-public-visual-audit.md`](../reports/english-public-visual-audit.md)
e em [`reports/english-public-visual-audit.json`](../reports/english-public-visual-audit.json).
