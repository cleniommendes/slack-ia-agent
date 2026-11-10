# Modo atualizar

Uma tarefa mudou algo que o LLD registra, ou entregou um item que ele marca como planejado. Deixe o fato certo na seção dona e leve a mudança a tudo o que ela atinge, sem arrumar o resto: o diff deve ser só o da mudança, porque vai no PR da tarefa.

**Alcance.** Ache a seção dona e todas as que a mudança afeta, inclusive as que não citam o fato antigo (um prazo novo pesa numa tarefa, num estado, numa reação do cliente), e leia a orientação do molde delas. As cópias de um valor viram o nome dele, e um padrão no schema das variáveis muda junto, no código. O que é de um artefato dono muda no código; o LLD só aponta.

**Confirmação.** Regra, valor, decisão, divergência do código e as consequências que você deduzir são conteúdo: mostre o antes e o depois numa confirmação só e grave depois do ok. Cópia do fato antigo, ponteiro, Situação que passa a `existe` e forma que saiu para o artefato são mecânicos: aplique e avise. Uma consequência que pede escolha nova, ou contraria o que está registrado, vira pergunta, e não texto, porque a decisão é do usuário; sem resposta, fica "A definir".

**Convenções.**

- Item `existe` cuja regra muda antes do código: a regra atual fica, com uma linha "Alteração `planejada`" ao lado. Quando o ticket que a implementa passa pelo commit de plano, a nova toma o lugar dela.
- Decisão nova ou trocada segue a seção "Decisões e ADRs" do `SKILL.md`: a trocada não se edita, o ADR antigo passa a "substituída por NNNN", e o novo entra no índice com número novo.
- Se a mudança atinge o HLD, carregue a skill `hld` e use o modo atualizar dela, na mesma tarefa. Se atinge outro documento, avise o usuário; ele não muda por aqui.
- Não crie seção do molde nem reorganize. Se o documento está longe do molde, ou a mudança tocou muitas seções, faça só a mudança e recomende uma revisão.

**Ao gravar,** atualize a data, mantenha o status e resuma o que mudou, onde, o que foi para outro documento e o que você viu e não tocou.
