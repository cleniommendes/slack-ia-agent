---
name: prd
description: 'Gera Documentos de Requisitos de Produto (PRDs) de alta qualidade para sistemas de software e funcionalidades com IA. Inclui resumo executivo, histórias de usuário, critérios de aceite e riscos de produto, e publica o PRD no issue tracker do projeto.'
license: MIT
---

# Documento de Requisitos de Produto (PRD)

O issue tracker e o vocabulário de rótulos de triagem já devem ter sido informados a você. Se não foram, pergunte ao usuário onde o PRD deve ser publicado antes de começar.

## Passo 1: Descoberta (a entrevista)

Antes de escrever uma única linha do PRD, você **PRECISA** questionar o usuário para preencher as lacunas de conhecimento, com pelo menos duas perguntas de esclarecimento. Não presuma contexto: se o usuário não especificou uma restrição, como um prazo ou uma regra de negócio, pergunte, ou marque como `A definir`.

**Pergunte sobre:**

- **O problema central**: por que estamos construindo isto agora?
- **O que prova que funcionou**: o que a pessoa consegue fazer ao final, e que métricas do documento de produto do projeto esta funcionalidade move.
- **As restrições**: prazo, regras de negócio ou limites do produto que ainda não estão nos documentos do projeto? A stack e a arquitetura já estão decididas nos documentos de arquitetura e não entram no PRD.

## Passo 2: Análise e escopo

Sintetize o que o usuário disse. Identifique dependências e complexidades escondidas.

- Mapeie o **fluxo do usuário**.
- Defina o que **não é objetivo**, para proteger o cronograma.

## Passo 3: Rascunho

Gere o documento usando o **Esquema Rígido do PRD** abaixo. Use o vocabulário do glossário de domínio do projeto em todo o PRD. Em sistemas de IA, especifique como testar e validar a qualidade da saída. Apresente o rascunho e peça feedback sobre seções específicas.

## Passo 4: Publicação

Depois que o usuário aprovar o rascunho, publique o PRD no issue tracker do projeto, em vez de deixá-lo só na conversa ou num arquivo. Aplique o rótulo de triagem `ready-for-agent`, sem precisar de outra triagem.

NÃO inclua caminhos de arquivo nem trechos de código específicos no PRD publicado. Eles podem ficar desatualizados muito rápido.

---

## Qualidade dos requisitos

Use critérios concretos e mensuráveis. Evite "rápido", "fácil" ou "intuitivo".

```diff
# Vago (RUIM)
- A busca deve ser rápida e trazer resultados relevantes.
- A interface deve parecer moderna e ser fácil de usar.

# Concreto (BOM)
+ A busca deve trazer resultados em até 200 ms num conjunto de 10 mil registros.
+ O algoritmo de busca deve atingir Precision@10 >= 85% nas avaliações de referência.
+ A interface deve seguir o design system do projeto e atingir 100% na nota de Acessibilidade do Lighthouse.
```

---

## Esquema Rígido do PRD

Você **PRECISA** seguir exatamente esta estrutura na saída:

### 1. Resumo executivo

- **Problema**: 1 ou 2 frases sobre a dor.
- **Solução proposta**: 1 ou 2 frases sobre a correção.
- **Critérios de sucesso**: as métricas do documento de produto do projeto que esta funcionalidade move, citadas pelo nome e com um ponteiro para lá. Não crie indicadores próprios: as métricas do produto têm um dono só, e um indicador que ninguém mede não prova nada.

### 2. Experiência do usuário e funcionamento

- **Personas**: para quem é isto?
- **Histórias de usuário**: `Como [usuário], quero [ação] para [benefício].`
- **Critérios de aceite**: uma lista com a definição de "pronto" de cada história.
- **O que não é objetivo**: o que NÃO vamos construir?

### 3. Requisitos do sistema de IA (se houver)

- **O que o agente pode fazer**: as ações que ele executa e os dados que consulta, do ponto de vista do usuário, e o que ele nunca faz.
- **Estratégia de avaliação**: como medir a qualidade e a precisão da saída.

### 4. Riscos de produto

- **Riscos**: o que pode impedir a funcionalidade de resolver o problema (uso, permissão, confiança), e como mitigar cada um.

O PRD não traz arquitetura, integrações nem fases de entrega: o desenho técnico fica na spec e nos documentos de arquitetura do projeto, e a ordem de entrega fica no roadmap.
