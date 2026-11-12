---
paths:
  - "apps/web/src/**/*.{ts,tsx}"
---

## Idioma

- **Identificadores em inglês:** variáveis, funções, classes, tipos e arquivos.
- **Texto em português:** comentários, mensagens de erro de domínio, mensagens de log e nomes de teste (`describe` e `it`).

## Classes, funções e tipos

- Classe com nomes no estilo `PascalCase`.
- **Classe com o papel no fim:** `ConversationsService`, `ApiError`.
- **Conjunto fechado de valores é união de strings em `snake_case`, sem `enum`:** `type SortOrder = 'asc' | 'desc'`.

## Variáveis e constantes

- Variável em `camelCase`.
- **Constante de módulo em `SCREAMING_SNAKE_CASE`:** `API_PREFIX`, `USER_FIELDS`, `INTERNAL_ERROR`.
- **Booleano** começa com `is`, `has` ou `can`, ou é um adjetivo ou particípio: `isUniqueViolation`, `created`.

## Funções e métodos

- Função em `camelCase`.

## Componentes React

- **Componente** em `PascalCase`, seja função ou classe, com o mesmo nome do componente no Figma: `MessageItem`, `UserMenu`.
- **Props** em `camelCase`.
- **Hooks** em `camelCase`, começando com `use`: `useSession`.
