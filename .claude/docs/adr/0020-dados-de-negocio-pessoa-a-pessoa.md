---
status: aceita
---

# 0020 · Mensagem de dados de negócio emitida pessoa a pessoa no WebSocket

Uma mensagem marcada "dados de negócio" sai pelo WebSocket num evento por pessoa: quem tem permissão de dados recebe o conteúdo, e os outros membros recebem a versão bloqueada. Assim, a mensagem aparece completa na hora para quem tem permissão.

Descartadas: a mesma versão bloqueada para todos, com o conteúdo buscado pelo REST por quem tem permissão; esconder a mensagem de quem não tem permissão (contraria o HLD 6.4 e o brief).
Custo aceito: o conteúdo de negócio fica guardado nos eventos de reconexão no Redis de quem tem permissão; essas mensagens são emitidas pessoa a pessoa, e não uma vez para a conversa.
