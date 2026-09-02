# Inglês Preview — corpus auditado

O **Inglês Preview** é um corpus provisório e isolado. Ele não altera nem
funde os 1.500 registros do banco atual de Inglês e não pode ser promovido
automaticamente.

## Cobertura da importação

Fonte: o PDF é mantido apenas na proveniência técnica do relatório. O hash
SHA-256 do documento é `029a154daaf7e1c2a2b4073bfbb76f16959b76e01f09a446d37024f92fa039b9`.

- 394 páginas recebidas e processadas;
- 2.270 posições impressas detectadas;
- 40 blocos de gabarito reconciliados, inclusive continuações em páginas seguintes;
- 30 assuntos, 40 pares de seção/gabarito e 112 provas declaradas (967 itens de interpretação e vocabulário e 1.303 de gramática);
- 2.163 questões estudáveis após a quarentena, a deduplicação e a remoção de conteúdo autoral;
- 2.126 `verified`, 37 `warning`, 48 isoladas e 59 rejeitadas por política autoral no manifesto;
- 45 duplicatas comprovadas preservadas no relatório, mas fora do conjunto estudável;
- 62 recortes visuais WebP, com coordenadas, hash e origem da página; duas referências sem ativo inequívoco permanecem isoladas.

Os IDs estáveis seguem `ep-<hash do documento>-<seção>-q<número impresso>`;
uma nova edição do PDF não colide com esta importação.

Os números auditados estão em [reports/english-preview-audit.md](../reports/english-preview-audit.md)
e no manifesto tipado [src/data/englishPreviewManifest.ts](../src/data/englishPreviewManifest.ts).

## Política editorial

Um registro só entra no estudo se possui enunciado, alternativas válidas e
gabarito localizado no bloco oficial da seção. Falhas estruturais, gabarito
órfão, caracteres corrompidos, ambiguidade de recorte ou imagem necessária
ausente ficam em `quarantined`; não são exibidos no filtro nem nas listas.

Ausência não essencial, como banca/ano não impressos, fica em `warning` e é
mostrada como alerta. Nenhum crédito é inventado. A auditoria visual recorta
somente elementos que participam da resolução (charges, tirinhas, mapas,
anúncios e diagramas); fotografias decorativas ou sem função pedagógica são
descartadas. A interface usa somente a
legenda **“Recorte visual da questão”**; autoria, veículo ou site só devem ser
adicionados quando comprovados por fonte oficial.

## Organização e carregamento

Os 40 módulos em `src/data/englishPreview/` são carregados dinamicamente por
`loadEnglishPreviewQuestions()`. Assim, o corpus não aumenta o JavaScript
inicial. Os arquivos em `public/assets/english-preview/` são recortes sob
demanda; páginas completas do PDF não são armazenadas como mídia.

O seletor mostra **Português** e uma categoria **Inglês** unificada (banco
público + Preview), mantendo `corpusId` na proveniência e nas listas salvas. O
selo de cobertura informa
as posições originais e a quantidade estudável sem apresentar os dois números
como se fossem iguais. Nas bancas de Inglês, bancas com menos de cinco questões aparecem
em um único filtro de “Concursos estaduais e outras bancas (<5Q)”; as variações
impressas de EEAR ficam em **EEAR** ou **EEAR BCT** e ITA/ITA-SP em **ITA**. A tag exibida na questão
preserva o crédito real, com link apenas quando há portal oficial cadastrado.

Questões identificadas como autorais do compilador são redigidas e rejeitadas
antes da geração dos módulos estudáveis. As posições continuam no relatório
de cobertura para manter a reconciliação das 2.270 posições, mas o conteúdo
não é entregue ao usuário.

## Reauditoria

```text
npm run import:english-preview
npm run audit:english-preview
npm run audit:english-corpora
npm run lint
npm test
npm run build
npm run check:bundle
```

O importador determinístico (`src/scratch/import_english_preview.py`) deve ser
executado novamente quando a fonte mudar. Ele calcula o hash, reprocessa as
páginas, verifica os gabaritos de forma independente, recorta imagens e
regenera o manifesto, os módulos e os relatórios. A auditoria falha se a
contagem de páginas, posições, seções, alternativas ou respostas não fechar.

## Critérios para futura promoção

Uma promoção exige uma etapa explícita e revisão humana dirigida: resolver
todas as quarentenas ou justificar cada exceção, confirmar imagens em fonte
oficial, comparar duplicatas com o banco principal, revisar amostras de cada
assunto/banca e executar os gates de release. Até lá, `corpusId:
'english_preview'` deve permanecer nos registros e nas listas salvas.
