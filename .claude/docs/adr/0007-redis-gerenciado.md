---
status: aceita
---

# 0007 · Redis gerenciado para fila, eventos de reconexão e contadores

Um Redis gerenciado guarda a fila de pedidos demorados, os eventos recentes por pessoa para a reconexão do WebSocket e os contadores de limite e custo dos agentes. É feito para fila e serve aos três usos.

Descartadas: fila no próprio Postgres.
Custo aceito: mais um serviço pago; o Redis vira ponto único: na queda, agentes, fila e reconexão param.
