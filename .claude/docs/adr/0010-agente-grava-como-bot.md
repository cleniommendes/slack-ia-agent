---
status: aceita
---

# 0010 · O agente grava na conversa pela API do chat, como bot

O Serviço de agentes e o Worker gravam respostas, tarefas e entregas pela API do chat, como bots com credencial própria, e leem por ela as mensagens de que o resumo precisa. Assim, o mesmo caminho serve ao pedido comum e ao demorado, e o BFF não espera.

Descartadas: o BFF esperar a resposta do agente e gravá-la pela API do chat.
Custo aceito: o Serviço de agentes e o Worker têm credencial na API do chat, que passa a aceitar escrita de usuário bot com permissões limitadas.
