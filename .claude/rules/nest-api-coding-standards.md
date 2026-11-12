---
paths:
  - "apps/chat-api/src/**/*.ts"
  - "apps/chat-api/test/**/*.ts"
---

## Idioma

- **Identificadores em inglês:** variáveis, funções, classes, tipos e arquivos.
- **Texto em português:** comentários, mensagens de erro de domínio, mensagens de log e nomes de teste (`describe` e `it`).

## Classes e tipos

- Classe com nomes no estilo `PascalCase`.
- **Classe com o papel no fim:** `SessionsService`, `LoginDto`, `NotAMemberError`.
- **Conjunto fechado de valores é união de strings em `snake_case`, sem `enum`:** `type SortOrder = 'asc' | 'desc'`.

## Variáveis e constantes

- Variável em `camelCase`.
- **Constante de módulo em `SCREAMING_SNAKE_CASE`:** `API_PREFIX`, `USER_FIELDS`, `INTERNAL_ERROR`.
- **Token de injeção** é um `Symbol` em `SCREAMING_SNAKE_CASE`, com a descrição igual ao nome, exportado junto da interface: `OBJECT_STORAGE = Symbol('OBJECT_STORAGE')`.
- **Configuração de um assunto** em `camelCase` com o sufixo `Config`, criada com `registerAs`: `storageConfig`, `rateLimitConfig`.
- **Dependência injetada leva o nome do papel, sem o sufixo do tipo:** `private readonly users: UsersService`, `storage`, `passwords`, `config`.
- **Booleano** começa com `is`, `has` ou `can`, ou é um adjetivo ou particípio: `isUniqueViolation`, `created`.

## Funções e métodos

- Função em `camelCase`.
- **Repository:** verbo do que o método faz no dado: `findByEmail`, `findOrCreate`, `revokeSession`.
- **Leitura de um registro:** a ausência que é resultado de negócio devolve `null` (`findOneBy`, `findOne`). O registro que tem de existir, principalmente dentro de uma transação, usa a variante que lança (`findOneByOrFail`, `findOneOrFail`). Se outro processo pode apagá-lo, a ausência é resultado de negócio, e a leitura devolve `null`.
- **Service:** verbo da ação de negócio, do jeito que o caso de uso é chamado: `login`, `logout`, `sendMessage`.
