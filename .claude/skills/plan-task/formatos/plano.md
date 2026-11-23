# Molde do plano

O plano tem as seções abaixo, nesta ordem. Uma seção sem conteúdo diz "Nenhum" em vez de sumir: assim quem revisa sabe que ela foi pensada.

```markdown
# Plano da F01-T02: <título da tarefa>

Tarefa: [02-<titulo>.tarefa.md](02-<titulo>.tarefa.md) · Spec: [spec.md](spec.md) · PRD: [prd.md](prd.md)

## Critérios

### CA1

**Marca:** teste HTTP

**Cenário:** Dado uma pessoa com conta criada pela empresa, quando ela entra com o e-mail e a senha certos, então recebe a sessão e é levada ao canal geral.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "entra com e-mail e senha válidos".

### CA2

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa procura a senha nos logs, então ela não aparece em nenhum.

## Contrato

<Rotas, eventos e tabelas, no formato de formatos/contrato.md.>

## Verificação do contrato

<Que critério prova cada item do contrato.>

## Decisões

- <Uma decisão do plano e o motivo.>
- **Em aberto:** <a pergunta, com a sua recomendação.>

## Arquivos e interfaces

- `<arquivo>`: <interface que nasce ou muda>.

## Testes existentes que mudam

<Os testes cujo comportamento muda, e por quê, ou "Nenhum".>

## Mudança de dados

<Seed ou backfill, ou "Nenhuma".>

## Documentos atualizados

- `<documento>`, seção "<título>": <o que mudou>.
```

## Cabeçalho

Só aponta para a tarefa, a spec e o PRD, sem repetir o conteúdo deles. O título leva o ID da tarefa, `F<NN>-T<NN>`.

## Critérios

Um bloco por `CA<n>` da tarefa, com o título `### CA<n>`. O texto do critério fica só na tarefa: o bloco diz como ele é provado.

- **Marca:** teste HTTP, teste no Playwright, teste de unidade, teste de integração, revisão humana ou documento. Só as quatro primeiras são provadas por teste. A definição de pronto do projeto não é critério.
- **Cenário:** Dado, Quando, Então, na linguagem do `GLOSSARY.md`. Na revisão humana e no documento, o cenário diz o que quem revisa olha e o que precisa encontrar.
- **Teste previsto** (só nas marcas de teste): a camada (unidade, integração, e2e da API, Playwright), o arquivo e o nome do caso. É uma previsão, e a implementação pode mudar o arquivo ou o nome.

**Pontos de teste.** Use o ponto mais alto que prova o critério e o menor número de pontos no total, preferindo os que a seção de testes da spec já define. Um teste HTTP que prova a regra pela rota vale mais que três testes de unidade das peças dela.

## Contrato

O formato está em `formatos/contrato.md`. Quando a tarefa não cria nem muda rota, evento ou tabela, a seção diz "O contrato não muda."

## Verificação do contrato

Uma linha por item do contrato que pode ser provado: cada rota com a resposta de sucesso e cada status de erro, cada evento, cada restrição de tabela que o banco impõe. A linha diz o critério que o prova (`CA3`). O item que nenhum critério prova é uma lacuna: proponha um critério novo como decisão em aberto, ou explique por que ele não precisa de teste.

A forma do contrato (campos, tipos, status, colunas) é conferida no fim da tarefa e não entra nesta seção.

## Decisões

As decisões do plano, cada uma com o motivo numa linha. Uma decisão que muda o desenho e a spec não cobre não é do plano: proponha-a como decisão em aberto e, se aprovada, ela vai para a spec ou para o LLD.

As decisões em aberto levam o rótulo **Em aberto:**, com a sua recomendação. O commit de plano só acontece quando não sobra nenhuma: cada uma vira decisão, com o motivo, ou sai.

## Arquivos e interfaces

Os arquivos que a implementação vai criar ou mudar e a interface de cada um que nasce ou muda (módulo, classe, função, tela). É a seção que mais envelhece, e por isso fica só aqui.

## Testes existentes que mudam e mudança de dados

Os testes que já existem e cujo comportamento a tarefa muda, com o motivo, e os dados que ela muda fora do schema (seed, backfill). Ficam aqui porque não cabem no contrato.

## Documentos atualizados

O que o commit de plano muda em cada documento (LLD, HLD, design system), pela seção. Só a lista: a mudança está no próprio documento.
