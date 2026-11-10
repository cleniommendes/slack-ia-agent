---
status: aceita
---

# 0009 · O BFF dispara o agente

O BFF grava a mensagem pela API do chat, reconhece a menção a um agente conectado, ou a resposta a uma pergunta pendente, e chama o Serviço de agentes sem esperar a resposta. Assim, a API do chat não precisa saber que agentes existem.

Descartadas: a API do chat disparar o agente ao gravar a mensagem.
Custo aceito: a continuação sem menção e os botões de resposta pronta dependem do BFF; só o caminho pelo BFF dispara agentes.
