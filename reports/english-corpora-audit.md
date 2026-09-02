# Auditoria integrada dos corpora de Inglês

Status: **passed**

## Cobertura

- Inglês público: **1500 posições**, 1147 estudáveis, 180 em quarentena e 173 rejeitadas.
- Inglês Preview: **2270 posições**, 2163 estudáveis, 48 em quarentena e 59 rejeitadas.
- Duplicatas do Preview mantidas apenas no manifesto: **45**; duplicatas atravessando corpora publicados: **0**.
- Recortes visuais: público **49** descritores; Preview **62** descritores.
- Auditoria visual: público **27** questões com recorte e 0 sem resolução; Preview **62** recortes úteis em 64 referências e 2 sem ativo inequívoco.
- Revisão da quarentena: Preview **45** duplicatas excluídas, **2** referências visuais pendentes e **1** gabarito incompatível; nenhum motivo não classificado.

## Filtros e apresentação

- O front-end apresenta uma única categoria Inglês; `corpusId` mantém a origem em cada registro e `corpusIds` preserva listas mistas.
- ITA/ITA-SP/edições e EEAR/EEAR BCT são agrupados apenas no seletor; as tags de crédito continuam com a banca impressa.
- Textos de apoio usam regiões semânticas separadas para título, corpo e fonte; marcadores redundantes foram removidos.

## Qualidade e política

- Questões autorais são rejeitadas e não aparecem no estudo; itens ambíguos permanecem em quarentena.
- A garantia operacional é: nenhum item sem gabarito/evidência estrutural é publicado; a quarentena é exibida no relatório técnico.
