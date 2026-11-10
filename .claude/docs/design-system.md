# Design system

Linguagem visual da interface do Clenio Chat: tokens, componentes, ícones, estados de interação, comportamento responsivo e fluxo de trabalho com o Figma. As regras daqui são obrigatórias em qualquer tarefa de interface, no Figma ou no código.

**Onde cada coisa mora**

- **Design:** o arquivo do Figma (<https://www.figma.com/design/plW17JDOoRHydUJIIi2u87/slack>, `fileKey` `plW17JDOoRHydUJIIi2u87`). As variables, os estilos e os componentes de lá são a fonte do design.
- **Especificação:** este documento. Nomes, valores e regras de uso dos tokens e dos componentes.
- **Implementação:** `apps/web/src/app/globals.css` (tokens) e `apps/web/src/app/components/` (componentes).
- **Fora daqui:** comandos, Server Components e estrutura de pastas ficam no `apps/web/AGENTS.md`. Nomes de identificadores ficam em `.claude/rules/next-web-coding-standards.md`. Escopo e plataforma ficam no `docs/product-brief.md`, seção "Escopo do MVP".

Um token muda nos três lugares na mesma tarefa: a variable no Figma, este documento e o `globals.css`.

## Estado atual

O Figma tem as fundações, os componentes e as telas; o código ainda é o esqueleto do `create-next-app`.

| Item | Figma | Código |
| --- | --- | --- |
| Tokens | 3 coleções de variables (`Primitives`, `Semantic`, `Layout`), 14 estilos de texto, 3 de elevação | `globals.css` só tem `--background` e `--foreground` do esqueleto |
| Componentes | 57 componentes em 3 seções, mais 42 ícones | Nenhum |
| Telas | 129 frames de 1440 × 900, em 10 seções | Só a página inicial do esqueleto |
| Bibliotecas | Desenho pensado para `lucide-react`, Radix, CVA e Sonner | Só `next`, `react` e `tailwindcss` instalados |

As descrições dos componentes no Figma citam arquivos de uma implementação de referência (`shared/ui/button.tsx`, `entities/message/ui/message-item.tsx` e outros, no estilo Feature-Sliced Design). Esses arquivos não existem neste repositório. Use as descrições pelo comportamento que documentam, não pelos caminhos; a pasta de cada componente segue a seção "Organização no código" abaixo.

## Stack de interface

| Papel | Escolha | Situação |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, `src/app`), React 19 | Instalado |
| Estilo | Tailwind CSS 4, configurado só em CSS (`@theme`), sem `tailwind.config` | Instalado |
| Build | Turbopack, com o loader `@tailwindcss/turbopack` no `next.config.ts` | Instalado |
| Ícones | `lucide-react` | A instalar |
| Primitivos acessíveis | `radix-ui` (Dialog, AlertDialog, DropdownMenu, Tooltip, Switch, Tabs) | A instalar |
| Variantes | `class-variance-authority`, com `clsx` e `tailwind-merge` num helper `cn` em `src/app/utils/cn.ts` | A instalar |
| Toasts | `sonner` | A instalar |
| Fonte | Lato pelo `next/font/google` | A trocar (hoje é Geist) |

Instale uma biblioteca quando o primeiro componente precisar dela, sempre dentro do contêiner (`docker compose -f compose.yaml exec web pnpm add <pacote>`). O arquivo do Figma tem kits da comunidade ligados (Material 3, Simple Design System, kits da Apple): **não use nenhum deles**. O produto usa só as variables e os componentes locais do arquivo.

## Tokens

O Figma organiza os tokens em três coleções, e o código segue a mesma divisão:

1. **Primitives** (modo único `Value`): a paleta crua (`aubergine`, `green`, `blue`, `red`, `yellow`, `neutral`, `slate`, `avatar`, `alpha`). **Componentes nunca usam primitivos.** Eles existem só para alimentar a camada semântica e, no código, viram os valores literais do `globals.css`.
2. **Semantic** (modos `Light` e `Dark`): os papéis que os componentes consomem. É a única camada que muda com o tema.
3. **Layout** (modo único `Value`): espaçamento, raio, tamanhos do shell, breakpoints, camadas e duração.

Cada variable semântica e de layout traz no Figma a sintaxe de código (`codeSyntax.WEB`), como `var(--surface)`. É esse nome que o `get_design_context` devolve e é o nome da variável CSS no código.

### Cores semânticas

Abaixo está o `globals.css` de destino. Os valores são os primitivos já resolvidos; o comentário diz de qual primitivo cada um vem.

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  /* superfícies */
  --surface: #ffffff;               /* neutral/0 */
  --surface-subtle: #f8f8f8;        /* neutral/50 */
  --surface-raised: #ffffff;        /* neutral/0 */
  --surface-inset: #f0f0f0;         /* neutral/100 */
  --surface-overlay: #1d1c1d80;     /* alpha/neutral-900-a50 */
  /* texto */
  --fg: #1d1c1d;                    /* neutral/900 */
  --fg-muted: #616061;              /* neutral/600 */
  --fg-subtle: #868686;             /* neutral/500 */
  --fg-inverse: #ffffff;            /* neutral/0 */
  /* bordas */
  --border: #dddddd;                /* neutral/300 */
  --border-subtle: #e4e4e4;         /* neutral/200 */
  --border-strong: #868686;         /* neutral/500 */
  /* marca */
  --primary: #007a5a;               /* green/600 */
  --primary-hover: #006b4f;         /* green/700 */
  --primary-active: #005a43;        /* green/800 */
  --on-primary: #ffffff;            /* neutral/0 */
  /* link e foco */
  --link: #1264a3;                  /* blue/600 */
  --link-hover: #0b4c8c;            /* blue/700 */
  --focus: #1d9bd1;                 /* blue/400 */
  /* status */
  --danger: #e01e5a;                /* red/500 */
  --danger-hover: #c01343;          /* red/600 */
  --danger-fg: #c01343;             /* red/600 */
  --success: #007a5a;               /* green/600 */
  --warning: #ecb22e;               /* yellow/500 */
  --on-warning: #1d1c1d;            /* neutral/900 */
  --badge: #e01e5a;                 /* red/500 */
  --on-badge: #ffffff;              /* neutral/0 */
  --presence-online: #2bac76;       /* green/400 */
  --presence-away: #868686;         /* neutral/500 */
  /* menções e destaque */
  --mention-bg: #e8f5fa;            /* blue/100 */
  --mention-fg: #1264a3;            /* blue/600 */
  --mention-self-bg: #f8e3a3;       /* yellow/200 */
  --mention-self-fg: #1d1c1d;       /* neutral/900 */
  --highlight-bg: #fcf4da;          /* yellow/100 */
  --highlight-border: #f2c744;      /* yellow/300 */
  /* casca: rail e sidebar */
  --chrome: #350d36;                /* aubergine/900 */
  --sidebar: #3f0e40;               /* aubergine/800 */
  --sidebar-fg: #d6c8d7;            /* aubergine/200 */
  --sidebar-fg-strong: #ffffff;     /* neutral/0 */
  --sidebar-hover: #ffffff14;       /* alpha/white-a08 */
  --sidebar-active: #1264a3;        /* sidebar/selection no Figma: blue/600 */
  --sidebar-on-active: #ffffff;     /* sidebar/on-selection no Figma */
  --sidebar-border: #ffffff1f;      /* alpha/white-a12 */
  --sidebar-field: #ffffff29;       /* alpha/white-a16 */
  /* avatares: iguais nos dois temas */
  --avatar-1: #611f69;
  --avatar-2: #1264a3;
  --avatar-3: #007a5a;
  --avatar-4: #b3492a;
  --avatar-5: #8a5a00;
  --avatar-6: #c01343;
  /* elevação: sombra em camadas no claro */
  --elevation-1: 0 1px 3px #00000014;
  --elevation-2: 0 4px 12px #0000001f, 0 0 0 1px #1d1c1d21;
  --elevation-3: 0 18px 48px #0000003d, 0 6px 16px #00000024, 0 0 0 1px #1d1c1d21;
}

:root[data-theme="dark"] {
  --surface: #1a1d21;               /* neutral/950 */
  --surface-subtle: #222529;        /* neutral/850 */
  --surface-raised: #222529;        /* neutral/850 */
  --surface-inset: #121417;         /* slate/950 */
  --surface-overlay: #00000099;     /* alpha/black-a60 */
  --fg: #d1d2d3;                    /* slate/100 */
  --fg-muted: #ababad;              /* slate/300 */
  --fg-subtle: #8d8e90;             /* slate/400 */
  --fg-inverse: #1d1c1d;            /* neutral/900 */
  --border: #3b3d42;                /* slate/700 */
  --border-subtle: #2c2e33;         /* slate/800 */
  --border-strong: #6f7074;         /* slate/500 */
  --primary-hover: #148567;         /* green/500 */
  --primary-active: #006b4f;        /* green/700 */
  --link: #1d9bd1;                  /* blue/400 */
  --link-hover: #40b3e4;            /* blue/300 */
  --danger-hover: #e96379;          /* red/400 */
  --danger-fg: #e96379;             /* red/400 */
  --success: #2bac76;               /* green/400 */
  --mention-bg: #1d9bd129;          /* alpha/blue-400-a16 */
  --mention-fg: #1d9bd1;            /* blue/400 */
  --mention-self-bg: #f2c74447;     /* alpha/yellow-300-a28 */
  --mention-self-fg: #f2c744;       /* yellow/300 */
  --highlight-bg: #f2c7441a;        /* alpha/yellow-300-a10 */
  --highlight-border: #f2c74480;    /* alpha/yellow-300-a50 */
  --chrome: #121016;                /* aubergine/975 */
  --sidebar: #19171d;               /* aubergine/950 */
  --sidebar-fg: #b9babd;            /* slate/200 */
  --sidebar-hover: #ffffff0f;       /* alpha/white-a06 */
  --sidebar-border: #ffffff1a;      /* alpha/white-a10 */
  --sidebar-field: #ffffff1a;       /* alpha/white-a10 */
  /* elevação: borda + superfície mais clara no escuro */
  --elevation-1: 0 0 0 1px #2c2e33;
  --elevation-2: 0 4px 12px #00000066, 0 0 0 1px #3b3d42;
  --elevation-3: 0 18px 48px #00000099, 0 0 0 1px #3b3d42;
}
```

Os tokens que não aparecem no bloco escuro (`--primary`, `--on-primary`, `--focus`, `--danger`, `--warning`, `--on-warning`, `--badge`, `--on-badge`, presença, `--sidebar-fg-strong`, `--sidebar-active`, `--sidebar-on-active` e avatares) são iguais nos dois temas.

O `@theme inline` expõe cada token como utilitário do Tailwind, com o mesmo nome:

```css
@theme inline {
  --color-surface: var(--surface);
  --color-surface-subtle: var(--surface-subtle);
  --color-surface-raised: var(--surface-raised);
  --color-surface-inset: var(--surface-inset);
  --color-surface-overlay: var(--surface-overlay);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-subtle: var(--fg-subtle);
  --color-fg-inverse: var(--fg-inverse);
  --color-border: var(--border);
  --color-border-subtle: var(--border-subtle);
  --color-border-strong: var(--border-strong);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-active: var(--primary-active);
  --color-on-primary: var(--on-primary);
  --color-link: var(--link);
  --color-link-hover: var(--link-hover);
  --color-focus: var(--focus);
  --color-danger: var(--danger);
  --color-danger-hover: var(--danger-hover);
  --color-danger-fg: var(--danger-fg);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-on-warning: var(--on-warning);
  --color-badge: var(--badge);
  --color-on-badge: var(--on-badge);
  --color-presence-online: var(--presence-online);
  --color-presence-away: var(--presence-away);
  --color-mention-bg: var(--mention-bg);
  --color-mention-fg: var(--mention-fg);
  --color-mention-self-bg: var(--mention-self-bg);
  --color-mention-self-fg: var(--mention-self-fg);
  --color-highlight-bg: var(--highlight-bg);
  --color-highlight-border: var(--highlight-border);
  --color-chrome: var(--chrome);
  --color-sidebar: var(--sidebar);
  --color-sidebar-fg: var(--sidebar-fg);
  --color-sidebar-fg-strong: var(--sidebar-fg-strong);
  --color-sidebar-hover: var(--sidebar-hover);
  --color-sidebar-active: var(--sidebar-active);
  --color-sidebar-on-active: var(--sidebar-on-active);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-field: var(--sidebar-field);
  --color-avatar-1: var(--avatar-1);
  --color-avatar-2: var(--avatar-2);
  --color-avatar-3: var(--avatar-3);
  --color-avatar-4: var(--avatar-4);
  --color-avatar-5: var(--avatar-5);
  --color-avatar-6: var(--avatar-6);
  --shadow-1: var(--elevation-1);
  --shadow-2: var(--elevation-2);
  --shadow-3: var(--elevation-3);
}
```

Resultado: `bg-surface`, `text-fg-muted`, `border-border-subtle`, `bg-primary hover:bg-primary-hover`, `bg-sidebar`, `bg-avatar-3`, `shadow-2`.

**Regras de cor**

- **Só tokens semânticos.** Nada de hex, `rgb()`, cores da paleta padrão do Tailwind (`zinc-600`, `black/[.06]`) nem valores arbitrários (`bg-[#383838]`).
- **Sem `dark:` para cor.** O tema troca os valores das variáveis; o componente usa o mesmo utilitário nos dois modos. O variant `dark:` fica para o que não é cor (inverter uma imagem, por exemplo).
- **Os anéis usam opacidade sobre o token:** `ring-focus/30` (anel de foco) e `ring-danger/25` (anel de erro). No Figma eles são `link/focus-ring` e `status/danger-ring`, sem variável CSS própria.
- **Texto sobre cor sólida usa o par `on-*`:** `bg-primary text-on-primary`, `bg-badge text-on-badge`, `bg-warning text-on-warning`.

### Tema claro e escuro

A pessoa escolhe o tema (brief, "Escopo do MVP", item 7). O tema fica no atributo `data-theme` do `<html>`, aplicado no servidor para não piscar na carga. Sem o atributo, vale o claro. Onde a escolha é gravada é decisão do LLD (seção "8. Cliente", ainda a definir).

O `ThemeToggle` mostra a lua no tema claro e o sol no escuro.

### Tipografia

Lato nos pesos 400, 700 e 900, mais o itálico 400. A mono é uma pilha de sistema; o Figma usa Roboto Mono só como substituta. A nota do Figma cita `@fontsource` (da implementação de referência); aqui a fonte vem do `next/font/google`, que já serve a fonte pelo próprio Next.

| Estilo no Figma | Tamanho/linha | Classes |
| --- | --- | --- |
| `display/black` | 28/34 | `text-display font-black` |
| `heading/black` | 22/28 | `text-heading font-black` |
| `title/black` | 18/24 | `text-title font-black` |
| `body/regular`, `/bold`, `/black` | 15/22 | `text-body` + `font-normal`, `font-bold` ou `font-black` |
| `small/regular`, `/bold`, `/black`, `/italic` | 13/18 | `text-small` + peso, ou `italic` |
| `caption/regular`, `/bold` | 12/16 | `text-caption` + peso |
| `micro/black` | 10/12 | `text-micro font-black` |
| `mono/small` | 13/18 | `font-mono text-small` |

```css
@theme inline {
  --font-sans: var(--font-lato), system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

@theme {
  --text-display: 28px;  --text-display--line-height: 34px;
  --text-heading: 22px;  --text-heading--line-height: 28px;
  --text-title: 18px;    --text-title--line-height: 24px;
  --text-body: 15px;     --text-body--line-height: 22px;
  --text-small: 13px;    --text-small--line-height: 18px;
  --text-caption: 12px;  --text-caption--line-height: 16px;
  --text-micro: 10px;    --text-micro--line-height: 12px;
}

body {
  background: var(--surface);
  color: var(--fg);
  font-family: var(--font-sans);
  font-size: var(--text-body);
  line-height: var(--text-body--line-height);
}
```

```tsx
// src/app/layout.tsx
import { Lato } from "next/font/google";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});
// <html lang="pt-BR" className={`${lato.variable} h-full antialiased`}>
```

O texto padrão é `body/regular` em `fg`. Os nomes do Figma (`body`, `small`) não coincidem com a escala padrão do Tailwind (`text-sm`, `text-base`); use só os nomes da tabela.

### Espaçamento

A escala `space/*` do Figma é a escala padrão do Tailwind, com unidade de 4 px (`--space-unit`): o sufixo é o multiplicador. `space/1` = 4 px = `p-1`, `space/2-5` = 10 px = `gap-2.5`, `space/px` = 1 px = `p-px`. Os passos existentes são `px`, `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `5`, `6`, `8`, `10` e `12`. Não use passos fora dessa lista nem valores arbitrários (`py-[13px]`).

O `get_design_context` devolve o espaçamento como `calc(var(--space-unit) * N)`: isso vira o utilitário com o mesmo `N` (`calc(var(--space-unit) * 3)` em padding vira `p-3`).

### Raios

| Token | Valor | Uso | Classe |
| --- | --- | --- | --- |
| `radius/control` | 4 px | Controles: botão, campo | `rounded-control` |
| `radius/item` | 6 px | Linhas da sidebar, avatar md | `rounded-item` |
| `radius/card` | 8 px | Composer, menus, modais | `rounded-card` |
| `radius/panel` | 12 px | Cartão de login, avatar xl | `rounded-panel` |
| `radius/pill` | 999 px | Contadores e pílulas | `rounded-pill` |

```css
:root {
  --shape-control: 4px;
  --shape-item: 6px;
  --shape-card: 8px;
  --shape-panel: 12px;
  --shape-pill: 999px;
}
@theme inline {
  --radius-control: var(--shape-control);
  --radius-item: var(--shape-item);
  --radius-card: var(--shape-card);
  --radius-panel: var(--shape-panel);
  --radius-pill: var(--shape-pill);
}
```

### Elevação

| Nível | Uso | Classe |
| --- | --- | --- |
| `elevation-1` | Controles em foco | `shadow-1` |
| `elevation-2` | Menus, tooltip, toast, pílula de novas mensagens | `shadow-2` |
| `elevation-3` | Diálogos | `shadow-3` |

No claro a elevação é sombra em camadas; no escuro é borda mais superfície mais clara (`bg-surface-raised`). Os valores estão no bloco de cores acima.

### Tamanhos do shell

| Token | Valor | Uso | Classe |
| --- | --- | --- | --- |
| `size/rail` | 68 px | Trilho de seções, fundo `chrome` | `w-rail` |
| `size/sidebar` | 260 px | Lista de conversas | `w-sidebar` |
| `size/header` | 49 px | Cabeçalhos do workspace | `h-header` |
| `size/panel` | 384 px | Painel de perfil | `w-panel` |

```css
:root {
  --size-rail: 68px;
  --size-sidebar: 260px;
  --size-header: 49px;
  --size-panel: 384px;
}
@theme inline {
  --spacing-rail: var(--size-rail);
  --spacing-sidebar: var(--size-sidebar);
  --spacing-header: var(--size-header);
  --spacing-panel: var(--size-panel);
}
```

### Camadas (z-index)

No Figma, as variables `z/*` e `breakpoint/*` são só de referência, sem escopo: o Figma não tem z-index nem breakpoint nativos. Os valores coincidem com a escala padrão do Tailwind.

| Camada | Valor | Uso |
| --- | --- | --- |
| `z/toolbar` | `z-10` | Barra de ações da mensagem |
| `z/popover` | `z-20` | Lista de menções, painel sobreposto |
| `z/drawer-overlay` | `z-30` | Overlay do drawer |
| `z/drawer` | `z-40` | Drawer, overlay de diálogos |
| `z/dialog` | `z-50` | Diálogos, menus e tooltip |
| `z/toast` | Padrão do Sonner | Toaster |

### Movimento

| Token | Valor | Uso |
| --- | --- | --- |
| `duration/fast` | 100 ms (`duration-100`) | Transições de cor |
| `duration/base` | 200 ms (`duration-200`) | Entradas |
| `easing-out` | `cubic-bezier(0.23, 1, 0.32, 1)` (`ease-out`) | Entradas |
| `pulse` | 1,6 s ease-in-out, opacidade até 45% | Skeleton |
| `spin` | 0,8 s linear | Spinner |
| `pop-in` | 200 ms, opacidade + escala de 0,96 | Diálogos, menus, pílulas |
| `fade-in` | 200 ms, opacidade | Overlays e tooltip |
| `slide-in` | 200 ms, opacidade + 16 px na horizontal | Painel de perfil |

```css
@theme {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --animate-spin: spin 0.8s linear infinite;
  --animate-pulse: pulse 1.6s ease-in-out infinite;
  --animate-pop-in: pop-in 200ms var(--ease-out);
  --animate-fade-in: fade-in 200ms var(--ease-out);
  --animate-slide-in: slide-in 200ms var(--ease-out);

  @keyframes pulse { 50% { opacity: 0.45; } }
  @keyframes pop-in { from { opacity: 0; transform: scale(0.96); } }
  @keyframes fade-in { from { opacity: 0; } }
  @keyframes slide-in { from { opacity: 0; transform: translateX(16px); } }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Estados de interação

| Estado | Regra |
| --- | --- |
| Hover | Troca para o token `*-hover` do papel (`hover:bg-primary-hover`, `hover:text-link-hover`); na sidebar, `hover:bg-sidebar-hover`. Transição de cor com `duration-100`. |
| Active | Token `*-active` (`active:bg-primary-active`). |
| Foco global | `:focus-visible` com contorno de 2 px em `focus`, afastado 2 px. |
| Foco em campo | Borda `focus` + anel de 4 px: `focus-visible:border-focus focus-visible:ring-4 focus-visible:ring-focus/30`, sem o contorno global. |
| Inválido | Borda `danger`; com foco, anel `ring-danger/25`. Use `aria-invalid` como gatilho. |
| Desabilitado | `disabled:opacity-50` e `disabled:pointer-events-none`. |
| Carregando | Spinner no lugar do ícone, texto mantido e controle desabilitado. |
| Selecionado | `bg-sidebar-active text-sidebar-on-active` (linha ativa da sidebar, opção de menção, item destacado do menu). |
| Não lido | Texto em `font-black` na sidebar; na Atividade, fundo `highlight-bg`, título bold e ponto `badge`. |

```css
:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 2px;
}
```

Os estados `State=hover`, `active`, `focus` e `disabled` dos variants do Figma são pseudo-classes no código, nunca props. Tudo funciona por teclado (brief, "Requisitos não funcionais e restrições", Acessibilidade).

## Componentes

### Organização no Figma

A página **Components** tem quatro seções:

| Seção | Conteúdo |
| --- | --- |
| Ícones | 42 componentes `icon/<nome-lucide>` |
| Primitivos | Spinner, Avatar, Button, IconButton, CountBadge, PresenceDot, Kbd, Skeleton, Input, Textarea, Field, Switch, TabsTrigger, DropdownMenuItem, DropdownMenuSeparator, Tooltip, Toast, EmptyState, DialogHeader, ConfirmDialog |
| Entities | UserAvatar, UserStatus, AgentAvatar, AgentTag, ChannelIcon, MentionChip, DayDivider, UnreadDivider, MessageSkeleton, NotificationItem, TaskItem, ReplyQuote, MessageActions, MessageEditor, AgentText, MessageItem, AgentRuns |
| Features e widgets | SidebarRow, SidebarSection, SidebarAction, Sidebar, Rail, ThemeToggle, ConnectionBanner, ConversationHeader, ActivityHeader, ConversationIntro, MessageComposer, MentionOption, NewMessagesPill, JumpStatusPill, PersonRow, AgentRow, ContactRow, ProfilePanel, UserMenu, MessageMenu |

A descrição de cada componente no Figma registra o comportamento que o código precisa reproduzir: atalhos de teclado, limites, o que some e quando. Leia a descrição antes de implementar.

### Organização no código

A pasta segue o `apps/web/AGENTS.md`, seção "Estrutura de pastas". Dentro de `src/app/components/`:

- `ui/`: os primitivos, um arquivo por componente, em kebab-case (`button.tsx`, `icon-button.tsx`, `dropdown-menu.tsx`).
- Uma pasta por domínio para entities, features e widgets: `user/`, `agent/`, `conversation/`, `message/`, `notification/`, `task/`, `workspace-nav/`, `profile/`.
- As telas da página "Telas" do Figma viram rotas e layouts em `src/app/`, compostas a partir desses componentes.

Antes de criar um componente, procure em `src/app/components/` um que já cubra o caso. Um componente do Figma corresponde a um componente no código, com o mesmo nome em PascalCase.

### Das propriedades do Figma para as props

| No Figma | No código |
| --- | --- |
| Variant de aparência (`Variant`, `Size`, `Tone`, `Kind`) | Prop com os mesmos valores, em CVA: `variant="primary"`, `size="sm"` |
| `State=hover/active/focus/disabled` | Pseudo-classes; `disabled` é o atributo nativo |
| `State=loading` | Prop booleana `loading` |
| Booleano `Show <coisa>` | Prop opcional ou presença do `children` correspondente |
| `INSTANCE_SWAP` de ícone | Prop `icon` do tipo `LucideIcon` |
| Texto (`Label`, `Title`, `Value`) | `children` ou prop com o nome em camelCase |

```tsx
// src/app/components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/app/utils/cn";
import { Spinner } from "./spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-control font-bold transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active",
        secondary: "border border-border-strong bg-surface text-fg hover:bg-surface-subtle",
        ghost: "text-fg hover:bg-surface-subtle",
        danger: "bg-danger text-on-primary hover:bg-danger-hover",
        link: "h-auto p-0 font-normal text-link hover:text-link-hover hover:underline",
      },
      size: {
        sm: "h-7 px-3 text-small",
        md: "h-9 px-4 text-body",
        lg: "h-11 px-5 text-body",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { icon?: LucideIcon; loading?: boolean };

export function Button({ variant, size, icon: Icon, loading, disabled, className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : Icon && <Icon size={16} aria-hidden />}
      {children}
    </button>
  );
}
```

O exemplo mostra o padrão; as classes exatas de cada variant saem do `get_design_context` do componente no Figma. As alturas (28, 36 e 44 px) e os paddings (12, 16 e 20 px) batem com o component set Button.

### Server e Client Components

A regra geral está no `apps/web/AGENTS.md`, seção "Server Components". Para o design system: primitivos sem estado (Button, Avatar, CountBadge, Skeleton, EmptyState) nascem como Server Components. Os que embrulham Radix (Dialog, DropdownMenu, Tooltip, Switch, Tabs) e o Toaster precisam de `"use client"`, no menor componente possível.

### Comportamentos registrados no Figma

Estes detalhes não aparecem só olhando o desenho:

- **IconButton:** `label` é obrigatório e vira o tooltip e o `aria-label`. Ícone de 18 px; tons `default`, `sidebar` e `primary`; tamanhos 28 e 36.
- **Tooltip:** atraso de 400 ms.
- **CountBadge:** mostra `99+` acima de 99 e some em zero.
- **PresenceDot:** cheia é disponível; anel vazado é ausente. No UserAvatar, a bolinha recorta o fundo (`Backdrop`: `sidebar`, `raised` ou `chrome`).
- **Avatar:** iniciais em `font-black` sobre `avatar-1` a `avatar-6`. Tamanhos xs 20, sm 24, md 36, lg 48 e xl 96; xs e sm usam `text-micro`.
- **AgentAvatar:** o robô (`Bot`) distingue agentes de pessoas.
- **Input:** `h-9`, borda `border-strong`. **Textarea:** `min-h-20`, `py-2`. **Field:** rótulo + controle + dica ou erro.
- **DropdownMenuItem:** `h-8`, destacado com `sidebar-active`. **DropdownMenuSeparator:** `my-2`, 1 px.
- **Dialog:** largura máxima de 512, `rounded-card`, `shadow-3`, foco no primeiro campo.
- **ConfirmDialog:** largura máxima de 448, foco em Cancelar, não fecha ao clicar fora (Radix AlertDialog).
- **Toast:** Sonner, no canto inferior direito, com botão de fechar. Os ícones de sucesso e erro são do Sonner, não do Lucide.
- **EmptyState:** ícone num quadro de 48, título, descrição e ação opcional; `compact` = `py-6`.
- **TabsTrigger:** a aba ativa tem sublinhado `primary` de 2 px.
- **MessageItem:** layout `full` ou `compact`; tom `default`, `hover` ou `highlighted` (menciona você ou destaque por link); status `sent`, `sending` ou `failed`. Mensagem de agente troca o avatar por AgentAvatar e mostra AgentTag e AgentText.
- **MessageComposer:** Enter envia, Shift+Enter quebra linha, limite de 4000 caracteres.
- **MessageEditor:** Enter salva, Esc cancela.
- **MessageActions:** Editar só nas próprias mensagens.
- **ReplyQuote:** normal, apagada e restrita; clicar leva à mensagem original.
- **AgentText:** blocos de cabeçalho, lista, tabela mono e parágrafo. **Nunca vira HTML**: o texto do agente é renderizado como dados, sem `dangerouslySetInnerHTML`.
- **MentionChip:** amarelo (`mention-self-*`) para o próprio usuário e para `@canal` e `@aqui`.
- **NotificationItem:** não lida tem fundo `highlight-bg`, título bold e ponto vermelho.
- **TaskItem:** concluída tem título riscado e botão Reabrir.
- **SidebarRow:** `h-7`, `rounded-item`; não lida em `font-black`; ativa com `sidebar-active`. **SidebarSection:** recolhida, o chevron gira -90°.
- **SidebarAction (Agentes):** muda com o papel: `connect` (admin, nenhum conectado), `add` (admin, parte conectada), `manage` (admin, todos conectados), `view` (não admin).
- **ConversationHeader:** `h-header`; o tópico some abaixo de 640 px.
- **ProfilePanel:** `w-panel`.

## Ícones

São 42 ícones do `lucide-react`, cada um um componente `icon/<nome>` no Figma, com o nome do Lucide em kebab-case. No código, o import é o mesmo nome em PascalCase:

```tsx
import { Hash, Lock, SendHorizontal, LoaderCircle } from "lucide-react";

<Hash size={16} aria-hidden />                 // icon/hash
<SendHorizontal size={18} aria-hidden />       // icon/send-horizontal
```

- **Cor:** vem do contexto (`currentColor`). Nunca passe `color` com hex; mude o `text-*` do pai.
- **Traço:** 2 em 24, proporcional ao tamanho. Não use `absoluteStrokeWidth`: o traço de 1,33 em 16 px e 1,5 em 18 px do Figma é o resultado padrão do Lucide.
- **Tamanhos usados:** 16 (inline e botões), 18 (IconButton) e 24.
- **Acessibilidade:** ícone decorativo leva `aria-hidden`; ícone sozinho num botão exige rótulo (`aria-label`, ou o `label` do IconButton).
- **Ícone novo:** use um do Lucide. Crie antes o componente `icon/<nome>` na seção Ícones do Figma, para os dois lados continuarem com o mesmo conjunto.
- **Não use SVG solto** nem outra biblioteca de ícones.

## Assets

- **Estáticos** (logo, ilustrações) ficam em `apps/web/public/` e entram com `next/image`, com `width`, `height` e `alt`. Os SVGs do esqueleto (`next.svg`, `vercel.svg`, `file.svg`, `globe.svg`, `window.svg`) saem quando a página inicial for substituída.
- **Fontes** vêm do `next/font`, nunca de `<link>` para o Google Fonts nem de arquivos soltos.
- **Não há fotos de usuário no MVP:** o avatar é sempre de iniciais.
- **Arquivos do produto** (o PDF de relatório) não passam pelo `public/`: a API do chat devolve uma URL assinada do armazenamento de objetos (LLD, seção "10. Ambiente de desenvolvimento", item "Endereço do S3").
- **Não há CDN** configurada; os estáticos saem pelo próprio Next.
- **Asset do Figma:** baixe com o `download_assets` do MCP para `public/` e referencie pelo caminho local. Nunca deixe uma URL do Figma no código.

## Layout e responsividade

O produto é para navegador de desktop (brief, "Escopo do MVP"). As telas do Figma são frames de 1440 × 900, e esse é o tamanho de referência. O shell é `Rail (68) | Sidebar (260) | conversa | ProfilePanel (384, opcional)`.

Os breakpoints são os padrões do Tailwind, e o Figma registra o que acontece em cada um:

| Breakpoint | Comportamento abaixo dele |
| --- | --- |
| `xl` (1280) | O painel de perfil sobrepõe a conversa em vez de dividir o espaço |
| `md` (768) | Rail e sidebar viram drawer; as linhas passam a 44 px |
| `sm` (640) | Painel de perfil em largura total; somem o tópico do cabeçalho e as dicas de teclado |

`lg` (1024) e `2xl` (1536) não têm uso no produto. Escreva mobile-first com os prefixos do Tailwind (`md:`, `xl:`), sem media queries soltas no CSS.

## Fluxo com o Figma

### Arquivo

| Página | Conteúdo |
| --- | --- |
| Capa | Capa do arquivo |
| Foundations | Cores primitivas e semânticas, tipografia, espaçamento, raios, elevação, layout/camadas/movimento, foco e ícones |
| Components | As quatro seções da tabela de componentes |
| Telas | Uma seção por fluxo: Login, Home, Conversa, Atividade, Casca, Diálogos da casca, Painel de perfil, Portas e toasts, Rotas especiais, Erros corretos |

Os frames de tela seguem o padrão `<Fluxo> / <Grupo> / <Estado>`, como `Conversa / Mensagem / Falha no envio`. Cada estado de uma tela (carregando, vazio, erro, enviando) tem o próprio frame, e todos precisam existir no código.

A seção **"Erros corretos (difere do código)"** traz a versão certa de estados de erro que a implementação de referência fazia diferente (por exemplo, o ProfilePanel no estado `error`, que lá aparecia como "Pessoa não encontrada"). Implemente a versão do Figma.

### Antes de qualquer chamada

1. Leia este documento.
2. Chame `create_session` com o `fileKey` `plW17JDOoRHydUJIIi2u87` e reuse o `sessionId` em todas as chamadas da tarefa.
3. Da URL, tire o `node-id` e troque `-` por `:` (`?node-id=22-12030` vira `22:12030`).

### Do Figma para o código

1. Carregue a skill `figma:figma-design-to-code` antes do primeiro `get_design_context`.
2. Chame `get_design_context` no nó do componente ou da tela. Se a resposta vier grande demais, use `get_metadata` para ver a árvore e peça os nós filhos um a um.
3. Chame `get_screenshot` do mesmo nó para ter a referência visual.
4. Trate o código devolvido como referência, não como código final:
   - `var(--nome)` vira o utilitário do token (`bg-[var(--surface)]` vira `bg-surface`; `rounded-[var(--shape-card)]` vira `rounded-card`).
   - `calc(var(--space-unit) * N)` vira o passo `N` da escala (`gap-2`, `p-3`).
   - Estilos de texto (`body/regular`) viram as classes da tabela de tipografia.
   - Hex ou px soltos são sinal de camada desligada no Figma: ache o token equivalente nas tabelas acima. Se não houver, pare e pergunte, em vez de criar um valor.
   - Uma instância de componente vira o componente do código, nunca uma cópia do markup.
   - Ícones viram imports do `lucide-react`.
5. Implemente todos os variants e estados do component set, e os dois temas.

### Do código para o Figma

1. Carregue `figma:figma-use` e, para telas, `figma:figma-generate-design`; para componentes e variables, `figma:figma-generate-library`.
2. Monte com instâncias dos componentes locais e variables do arquivo. Nada de cor, tamanho ou raio soltos.
3. Variable nova entra na coleção certa (`Primitives`, `Semantic` ou `Layout`), com `codeSyntax.WEB` = `var(--<nome>)` e escopo explícito (primitivos ficam sem escopo), e é registrada aqui e no `globals.css` na mesma tarefa.
4. Componente novo entra na seção da página Components que corresponde à camada dele, com descrição no padrão dos outros: o caminho do arquivo no código e o comportamento que não aparece no desenho.

### Code Connect

Ainda não há mapeamentos. Quando um componente existir no código, mapeie-o ao component set do Figma com a skill `figma:figma-code-connect`, para o `get_design_context` passar a devolver o componente real.

### Validação visual

Uma tela ou um componente só está pronto depois de comparado com o Figma:

1. Suba a web (`AGENTS.md` da raiz, "Subir e derrubar") e abra a tela em 1440 × 900.
2. Compare com o `get_screenshot` do frame correspondente, no tema claro e no escuro.
3. Confira espaçamento, tipografia, cor, raio e estados (hover, foco, desabilitado, carregando, erro).
4. Confira `lint` e `tsc` (`apps/web/AGENTS.md`, "Comandos").
