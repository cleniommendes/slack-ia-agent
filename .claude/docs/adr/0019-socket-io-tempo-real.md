---
status: aceita
---

# 0019 · Socket.IO no tempo real

O WebSocket da API do chat (ADR 0005) usa o Socket.IO, no gateway do NestJS e no Frontend. O porquê está a definir.

Descartadas: `ws` com o `WsAdapter` do NestJS.
Custo aceito: protocolo próprio do Socket.IO, e o Frontend depende do `socket.io-client`; a recuperação pelo Redis (HLD 6.2) continua por conta do projeto; demais custos a definir.
