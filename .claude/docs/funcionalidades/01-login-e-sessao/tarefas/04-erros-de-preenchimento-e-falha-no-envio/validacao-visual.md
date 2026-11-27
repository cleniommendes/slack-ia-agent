# Validação visual da F01-T04

Tela Entrar, estados "Erro de validação" e "Falha no envio", em 1440 × 900, comparados com o
`get_screenshot` dos frames do Figma. Os frames estão na cópia `slack-ai-study`
(`aZqgLugpoJsa3lAkuhEtUm`), porque a conta conectada ao Figma não edita o arquivo original
(`plW17JDOoRHydUJIIi2u87`).

| Estado | Frame do Figma | Figma | Código, claro | Código, escuro |
| --- | --- | --- | --- | --- |
| Entrar, Erro de validação | 19:1336 | [figma](capturas/figma-entrar-erro-de-validacao.png) | [claro](capturas/entrar-erro-de-validacao-light.png) | [escuro](capturas/entrar-erro-de-validacao-dark.png) |
| Entrar, Falha no envio | 86:22 | [figma](capturas/figma-entrar-falha-no-envio.png) | [claro](capturas/entrar-falha-no-envio-light.png) | [escuro](capturas/entrar-falha-no-envio-dark.png) |

**Como foi feito:** o Playwright (Chromium, headless, 1440 × 900) abriu a web em desenvolvimento, e
o tema escuro vem de `data-theme="dark"` na raiz. A extensão Claude in Chrome não estava
disponível nesta sessão. Os frames do Figma estão só no tema claro, então o escuro foi conferido
contra os tokens `Dark` do design system. A falha no envio foi provocada com a API parada.

## Conclusão por par

- **Erro de validação:** layout, posições e tamanhos batem (card de 448 por 452, campos de 36,
  mensagens abaixo dos campos, botão de 44). Os dois campos têm borda e mensagem em `danger`, como
  no frame. Diferenças: o código mostra o `ana@` que o teste digitou, e o E-mail tem o anel de foco
  por receber o foco no erro (o frame não mostra foco).
- **Falha no envio:** a mensagem fica entre a Senha e o botão, em `small` e `danger-fg`, com os
  campos preenchidos e sem borda de erro, como no frame. O botão está igual.

## Divergências em relação ao Figma

- **Quebra de linha da mensagem de falha no envio:** no Figma a mensagem cabe em uma linha (381 de
  384 px); no Chromium do Linux a Lato sai alguns pixels mais larga, e a mensagem quebra em duas
  linhas, o que deixa o card 18 px mais alto (460 em vez de 442). É a mesma diferença de render da
  fonte registrada na F01-T03. O layout aguenta duas linhas, como o frame "Tentativas demais".
- **Nome do espaço de trabalho:** o título continua "Entrar no Full Cycle", como no Figma; a
  decisão sobre "Full Cycle" ou "Clenio" segue aberta (F01-T03).
- **Selo "N" do Next** no canto inferior esquerdo: só existe no `next dev`.
