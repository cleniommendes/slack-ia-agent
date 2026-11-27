# Validação visual da F01-T03

Tela Entrar (Padrão, Enviando, Credenciais incorretas) e Home, em 1440 × 900, comparadas com o
`get_screenshot` dos frames do Figma (arquivo `slack-ai-study`, cópia do `slack`):

| Estado | Frame do Figma | Figma | Código, claro | Código, escuro |
| --- | --- | --- | --- | --- |
| Entrar, Padrão | 19:1306 | [figma](capturas/figma-entrar-padrao.png) | [claro](capturas/entrar-padrao-light.png) | [escuro](capturas/entrar-padrao-dark.png) |
| Entrar, Enviando | 19:1369 | [figma](capturas/figma-entrar-enviando.png) | [claro](capturas/entrar-enviando-light.png) | [escuro](capturas/entrar-enviando-dark.png) |
| Entrar, Credenciais incorretas | 19:1399 | [figma](capturas/figma-entrar-credenciais-incorretas.png) | [claro](capturas/entrar-credenciais-incorretas-light.png) | [escuro](capturas/entrar-credenciais-incorretas-dark.png) |
| Home | 19:1645 | [figma](capturas/figma-home.png) | [claro](capturas/home-light.png) | [escuro](capturas/home-dark.png) |

**Como foi feito:** o Playwright (Chromium, headless, 1440 × 900) abriu a web em desenvolvimento, e o
tema escuro vem de `data-theme="dark"` na raiz. A extensão Claude in Chrome não estava disponível
nesta sessão. Os frames do Figma estão só no tema claro, então o escuro foi conferido contra os
tokens `Dark` do design system.

## Conclusão por par

- **Padrão:** layout, tamanhos (card 448, campos 36, botão 44), tipografia, cores e posições batem.
  Diferenças: o anel de foco do E-mail é mais evidente no código (borda `focus` e anel de 4 px
  `focus/30`, como a descrição do Input no Figma pede), e o card tem o anel de 1 px do `elevation-2`.
- **Enviando:** botão com o spinner à esquerda do texto e opacidade 50%, como no frame. Os campos ficam
  preenchidos.
- **Credenciais incorretas:** a Senha com borda e anel `danger`, a mensagem em `small` e `danger-fg`
  abaixo da Senha, e o botão abaixo. O botão aparece um pouco mais escuro na captura por causa do
  hover do mouse depois do clique. No Figma a Senha está preenchida com bolinhas; no código ela é
  limpa ao errar (critério do CA9), e a captura a preenche de novo só para comparar.
- **Home:** Rail de 68 px com "FC", "Início" e o avatar de iniciais; Sidebar de 260 px só com o
  cabeçalho; estado vazio centralizado, com o texto do frame. Ficam de fora, por decisão da spec,
  Atividade, o tema, a presença, o ícone de nova conversa e as seções da Sidebar.

## Divergências em relação ao Figma

- **Nome do espaço de trabalho:** o Figma usa "Full Cycle" (título de Entrar e cabeçalho da Sidebar);
  o CA10 e a spec pedem o cabeçalho "Clenio". A Sidebar usa "Clenio" (critério) e o título de Entrar
  usa o texto do Figma, "Entrar no Full Cycle". O nome do espaço precisa de uma decisão.
- **Selo "N" do Next** no canto inferior esquerdo das capturas: só existe no `next dev`.
- **Fonte:** a Lato carrega (400, 700 e 900); o traço difere um pouco do render do Figma por causa
  do Chromium no Linux.
