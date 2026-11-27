# Validação visual da F01-T07

Menu do avatar aberto, em 1440 × 900, comparado com o `get_screenshot` do frame "Casca / Menu do
usuário / Disponível" (25:25749), na cópia `slack-ai-study` (`aZqgLugpoJsa3lAkuhEtUm`) do arquivo
do Figma.

| Estado | Frame do Figma | Figma | Código, claro | Código, escuro |
| --- | --- | --- | --- | --- |
| Menu do avatar aberto | 25:25749 (UserMenu 25:25750) | [figma](capturas/figma-menu-do-usuario.png) | [claro](capturas/menu-aberto-light.png) | [escuro](capturas/menu-aberto-dark.png) |

**Como foi feito:** o Playwright (Chromium, headless, 1440 × 900) entrou como uma Pessoa de teste,
abriu o menu e capturou a tela; o tema escuro vem de `data-theme="dark"` na raiz. A extensão
Claude in Chrome não estava disponível nesta sessão. O frame do Figma está só no tema claro, então
o escuro foi conferido contra os tokens `Dark` do design system.

## Conclusão

O trecho que existe na F01 bate com o frame: o painel abre à direita do avatar, com a base alinhada
à base do avatar (888 px), 288 px de largura, `surface-raised`, `shape-card` e `elevation-2`. O
cabeçalho tem o avatar de 36 px e o nome em `body/black`, a linha de separação é `border-subtle`, e
o item "Sair do Clenio" tem 32 px, o ícone `log-out` de 16 px e `body/regular`.

## Divergências em relação ao Figma

- **Só o que a F01 entrega:** o frame mostra o menu completo. A F01 tem só o cabeçalho e "Sair do
  Clenio", sem a linha de presença, "Definir como ausente", "Perfil", "Editar perfil" e "Ativar
  notificações do navegador" (spec da F01, "Menu do avatar"). O avatar do Rail também não tem a
  bolinha de presença.
- **Nome do espaço de trabalho:** o frame diz "Sair do Full Cycle", e o código, "Sair do Clenio"
  (spec). A decisão do nome segue aberta (F01-T03).
- **Nome acessível do botão:** `AS, menu da conta de Ana Souza`. Ele começa pelas iniciais visíveis
  porque o axe (`label-content-name-mismatch`, WCAG 2.5.3) exige que o nome contenha o texto que
  aparece no botão.
- **Selo "N" do Next:** o `next dev` o mostra no canto inferior esquerdo; a configuração o move
  para o canto inferior direito (`devIndicators`), porque ele cobria o avatar e interceptava o
  clique nos testes.
