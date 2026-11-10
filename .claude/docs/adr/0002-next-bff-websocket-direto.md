---
status: aceita
---

# 0002 · Next.js como BFF, com WebSocket direto na API do chat

O navegador faz todas as chamadas REST ao Next.js, que serve de BFF para a API do chat e para o Serviço de agentes; só o WebSocket vai direto à API do chat. Assim, o navegador tem um só ponto de entrada REST, e o tempo real não passa pelo BFF.

Descartadas: navegador chamando a API do chat e o Serviço de agentes diretamente; REST do navegador direto para a API do chat.
Custo aceito: um salto a mais em cada chamada REST; a sessão precisa valer no BFF e na API do chat, o que exige subdomínios do mesmo domínio.
