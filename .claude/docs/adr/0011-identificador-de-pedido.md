---
status: aceita
---

# 0011 · Identificador de pedido limita as ações dos bots

Ao gravar a mensagem com a menção, a API do chat emite um identificador de pedido; o bot o apresenta em cada ação, e a API só aceita ações ligadas a um pedido real, em nome de quem fez aquele pedido. Assim, o bot só age dentro de pedidos que existiram.

Descartadas: aceitar o "em nome de" informado pelo bot, conferindo só que as pessoas participam da conversa.
Custo aceito: mais um mecanismo, com prazo de validade do identificador.
