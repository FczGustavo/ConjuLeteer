# Privacidade

Configurações, progresso, listas, respostas e questões importadas ficam no `localStorage`. O produto não possui conta nem banco remoto para esses dados.

Somente ao confirmar uma importação, o texto do PDF é enviado ao servidor e à OpenRouter para estruturação. A interface informa esse processamento. Logs devem conter apenas request ID, status, duração e contagens, nunca PDFs, respostas integrais ou chaves.

O usuário deve estar autorizado a processar o material e não deve enviar dados pessoais ou sigilosos. “Resetar dados” remove exclusivamente chaves do ConjuLetter.

Solicitações devem usar o canal publicado pelo operador da instância. Esse canal precisa ser definido antes da publicação pública.
