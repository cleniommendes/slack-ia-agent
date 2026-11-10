---
status: aceita
---

# 0016 · A API do chat é dona da sessão

A API do chat confere a senha e cria a sessão no Banco do chat; o identificador vai num cookie httpOnly que vale para o BFF e para o WebSocket. Assim, há um dono só, revogar é apagar a sessão, e o WebSocket confere a mesma sessão sem token no navegador.

Descartadas: o BFF dono da autenticação, emitindo um token curto para a API do chat.
Custo aceito: cada requisição e cada conexão consultam a sessão no Banco do chat.
