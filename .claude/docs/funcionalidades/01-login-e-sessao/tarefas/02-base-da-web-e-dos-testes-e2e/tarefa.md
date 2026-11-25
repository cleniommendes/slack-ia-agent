# 02: Base da web e dos testes de ponta a ponta

**Status:** concluída

**O que construir:** a web deixa de ser o esqueleto do Next e passa a ter a base de que toda
tela precisa:
- a configuração validada;
- a linguagem visual do design system;
- os testes de ponta a ponta com o Playwright, rodando no Docker.

O que se verifica é um teste do Playwright abrindo a web e passando. Referências:
- spec da F01, "Base que a F01 monta" e "Decisões de teste";
- LLD, "Estrutura do código" e "Ambiente de desenvolvimento";
- `docs/design-system.md`.

**Bloqueada por:** Nenhuma (pode começar imediatamente)

- [x] **CA1** · A configuração da web é lida e validada uma vez, com zod: `CHAT_API_URL`,
  `SESSION_COOKIE_NAME`, `SESSION_COOKIE_DOMAIN` e `SESSION_COOKIE_SECURE`. Sem uma variável
  obrigatória, a web falha com o nome dela na mensagem.
- [x] **CA2** · O CSS global tem o conjunto completo de tokens do design system, nos temas claro
  e escuro.
  - O claro é o padrão.
  - O escuro vale só com `data-theme="dark"` na raiz.
  - A fonte é Lato, pelo `next/font`.
  - A página inicial e os assets do esqueleto saem.
- [x] **CA3** · O compose tem o serviço `e2e`, com a imagem oficial do Playwright na mesma
  versão do `@playwright/test` do `web`.
  - Sobe só pelo `profile` e fica parado, como `web` e `chat-api`.
  - Tem `PLAYWRIGHT_HTML_OPEN=never` no ambiente.
  - Alcança a web por `http://web:3000`.
- [x] **CA4** · O Playwright roda só no Chromium, em modo headless, com o `@axe-core/playwright`
  instalado. O `playwright-cli` do pacote instalado funciona no contêiner `e2e`, sem instalação
  global.
- [x] **CA5** · Existe um teste-semente que abre a web, e o comando de testes de ponta a ponta o
  executa com sucesso no contêiner `e2e`.
- [x] **CA6** · O `AGENTS.md` da raiz lista o serviço `e2e` e como subi-lo. O `AGENTS.md` do web
  lista o comando dos testes de ponta a ponta e aponta para a skill `playwright-cli` como o jeito
  de escrevê-los e corrigi-los.
- [x] **CA7** · `lint` e `tsc` da web passam no contêiner.
