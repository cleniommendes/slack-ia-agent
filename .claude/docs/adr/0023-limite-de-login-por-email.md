---
status: aceita
---

# 0023 · Limite de tentativas de login contado só pelo e-mail

O limite de tentativas de login conta as falhas pelo e-mail normalizado, inclusive de e-mails sem conta, e bloqueia aquele e-mail mesmo com a senha certa, como o PRD da F01 pede. Assim a proteção contra adivinhação não depende do IP de origem, que atrás do proxy da PaaS ainda não sabemos ler com confiança (HLD, seção 12), e a resposta não revela se o e-mail tem conta.

Descartadas: contar pelo par e-mail e IP; contar o e-mail e o IP separadamente; guardar a contagem no Redis.
Custo aceito: qualquer pessoa que conheça o e-mail de outra pode deixá-la sem entrar por um período de `bloqueio do login`, repetindo senhas erradas (PRD da F01, "Riscos de produto").
