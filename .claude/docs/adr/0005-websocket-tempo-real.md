---
status: aceita
---

# 0005 · WebSocket para o tempo real

Mensagens, "digitando", presença e notificações chegam ao navegador por WebSocket, aberto direto na API do chat. É um canal nos dois sentidos, natural para "digitando" e presença.

Descartadas: SSE para o que o servidor envia e REST para o que o cliente envia; polling.
Custo aceito: conexão com estado; a reconexão e a recuperação do que se perdeu ficam por conta do projeto (eventos no Redis).
