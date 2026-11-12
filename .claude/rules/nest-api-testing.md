---
paths:
  - "apps/chat-api/src/**/*.spec.ts"
  - "apps/chat-api/src/**/*.int-spec.ts"
  - "apps/chat-api/test/**/*.ts"
---

# Testes da API

## Forma de todo teste

- **AAA em três blocos.** Arrange, Act e Assert ficam separados por uma linha em branco, sem comentários marcando cada um. Sem preparação, são dois blocos.
- **Um único Act:** a chamada que o teste prova. Na ponta a ponta, é uma requisição só. Cadastrar, entrar e o que mais o teste precisar antes ficam no Arrange, pelos atalhos de `authRoutes`.
- **Sem asserção no Arrange.** Uma preparação que pode falhar usa um atalho que falha sozinho.
- **O nome descreve o comportamento observável,** em português e no presente, sem "deve": `responde 201 e grava a mensagem na conversa`, `responde 403 quando a pessoa não é membro da conversa`.
- **Prove o efeito, e não a chamada.** A asserção confere o resultado: a resposta HTTP, a linha no banco. Um `toHaveBeenCalled` num dublê só vale quando a chamada é o próprio efeito, como um log.
- **Cada teste cria os próprios dados,** com `uniqueEmail()` e os atalhos da base, e não depende da ordem nem do dado de outro teste.
- **Orientado a comportamento observável.** O teste deve focar em verificar o efeito que a ação produziu, não somente detalhes internos ou implementações específicas.

## Tipos de teste

### Teste de unidade

**Quando não for um artefato do Nest,** o teste é de unidade e segue a regra de criar a classe com `new`, sem carregar módulos do Nest.
**Quando for um artefato do Nest,** o teste é de integração e segue a regra de criar o módulo com `Test.createTestingModule`, sem `overrideProvider`.

### Teste de integração

**Quando não for um artefato do Nest,** o teste de integração pode usar a dependência real sem montar módulo nenhum.
**Quando for um artefato do Nest,** o teste de integração deve montar o módulo com `Test.createTestingModule`, importando o módulo real da peça e sem `overrideProvider`.

### Teste end-to-end

**O teste end-to-end** sempre interage com a aplicação pelo HTTP. Ele deve usar `createTestApp()` para subir a aplicação e `app.close()` para fechá-la no fim.


## Preparar e desfazer com hooks

Quando for necessário preparar ou limpar recursos compartilhados entre testes, use os hooks apropriados, como `beforeAll`, `beforeEach`, `afterEach` e `afterAll`, etc. Prefira velocidade e simplicidade, evitando criar dependências complexas entre os testes.

