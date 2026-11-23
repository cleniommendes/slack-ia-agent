# Formato do contrato

O contrato de uma tarefa é a forma de cada rota, evento e tabela que ela cria, muda ou remove. Ele fica no plano até a implementação gerar os donos que o LLD lista em "Onde mora cada fato". Depois disso, os donos passam a valer, e o plano fica como registro do que foi aprovado.

**O que fica fora.** As regras de negócio, as transições de estado e as validades ficam nos documentos do projeto e são provadas pelos critérios. As convenções que valem para todos os itens (nomes, ids, paginação, corpo do erro) estão no LLD: o contrato as segue e não as repete.

**Mudança.** Cada item leva um título com o que ele é e se é **novo**, **alterado** ou **removido**. Num item alterado, mostre só o que muda, com o antes e o depois. Num removido, basta o título e o motivo.

## Rota da API

Título: o método e o caminho, com o prefixo de versão do projeto, se houver (`### POST /sessions · nova`). Abaixo dele, os itens que a rota usa:

| Item | O que descreve |
| --- | --- |
| Autenticação | Rota protegida, e por qual esquema, ou pública |
| Parâmetros de caminho e de consulta | Nome, tipo, se é obrigatório e os limites |
| Corpo da requisição | Os campos, os tipos e quais são obrigatórios |
| Cabeçalhos de entrada | Os que a rota lê além do de autenticação |
| Resposta de sucesso | O status e o corpo |
| Cabeçalhos de resposta | Os que a rota devolve e o cliente lê, inclusive os de cookie |
| Erros | Cada status com os códigos estáveis que a rota pode devolver, inclusive o de entrada inválida, quando ela valida entrada, e o de não autenticado, quando ela é protegida |

Um item que a rota usa e o contrato não traz é um contrato incompleto.

## Rota do BFF

Só quando a tarefa cria ou muda uma rota do BFF. Os mesmos itens da rota da API, mais a rota da API que ela chama e o que ela acrescenta ou tira no caminho (o cookie, quem pediu, um campo do corpo).

## Evento do WebSocket

Os eventos não aparecem no `openapi.json`, então o contrato é a única descrição deles até a implementação. Título: o nome do evento e a direção (`### message.created · servidor → cliente · novo`). Abaixo dele:

| Item | O que descreve |
| --- | --- |
| Quem recebe | A sala ou as pessoas a quem o servidor envia, ou quem pode enviar, no evento do cliente |
| Autenticação | Como a conexão ou o evento é autorizado |
| Carga | Os campos, os tipos e quais são obrigatórios |
| Confirmação | O que o servidor devolve ao cliente que enviou, se devolve |
| Erros | Os códigos estáveis que o servidor pode devolver, e como |

## Tabela

Título: o nome da tabela e o banco (`### sessions · chat · nova`). Abaixo dele:

- as colunas, com o tipo, se aceita nulo, o padrão e uma observação por coluna;
- a chave primária, as únicas e as chaves estrangeiras, com a regra de exclusão;
- os índices, inclusive os parciais;
- toda restrição que a ferramenta do schema não expressa, como um `CHECK`, com a nota de que ela é escrita à mão na migração. A conferência do fim da tarefa olha a migração, e a nota diz onde procurar.
