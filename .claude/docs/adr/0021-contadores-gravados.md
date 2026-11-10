---
status: aceita
---

# 0021 · Contadores de não lidas e de menções gravados na transação

As não lidas e as menções de cada pessoa em cada conversa são contadores gravados, somados de forma atômica na transação da mensagem e zerados na leitura, e não calculados a partir da última leitura. O porquê está a definir.

Descartadas: contagem calculada a partir da última leitura, com índice por conversa e data.
Custo aceito: uma mensagem apagada ou bloqueada exige corrigir os contadores, e o contador pode divergir da última leitura; o HLD, seção 7, precisa deixar de dizer que as não lidas "saem da última leitura"; demais custos a definir.
