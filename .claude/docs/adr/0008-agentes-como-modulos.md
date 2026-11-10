---
status: aceita
---

# 0008 · Agentes como módulos do Serviço de agentes, com o registro nele

Cada agente é um módulo do Serviço de agentes (um agente do ADK), e o registro de quais agentes existem e estão conectados fica no próprio Serviço de agentes; o administrador conecta e desconecta por esse registro. Assim, um agente novo não mexe no chat nem no BFF (objetivo b).

Descartadas: um serviço por agente, registrado por endereço; registro de agentes na API do chat, com cada agente como usuário bot.
Custo aceito: um agente novo exige nova versão do Serviço de agentes; cada agente tem também um usuário bot no chat para gravar mensagens, então o registro fica dividido em dois lugares.
