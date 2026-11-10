---
status: aceita
---

# 0015 · O BFF envia identidade e permissões no pedido ao agente

O BFF envia ao Serviço de agentes a identidade de quem pediu e as permissões dela (permissão de dados, papel de administrador), com a credencial de serviço. Assim, não há chamada a mais por pedido.

Descartadas: o Serviço de agentes perguntar as permissões à API do chat a cada pedido.
Custo aceito: o Serviço de agentes confia nas permissões que o BFF diz; uma permissão retirada no meio de um pedido demorado não é percebida.
