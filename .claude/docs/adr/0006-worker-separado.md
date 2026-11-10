---
status: aceita
---

# 0006 · Worker separado para pedidos demorados

Pedidos demorados, como o relatório em PDF, vão para uma fila e são executados por um Worker separado do Serviço de agentes. Assim, o pedido demorado não atrasa os outros (objetivo c).

Descartadas: segundo plano dentro do Serviço de agentes.
Custo aceito: mais um contêiner pago e mais uma peça, a fila.
