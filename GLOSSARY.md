# Clenio Chat

Chat de equipe no estilo Slack, com agentes de IA como plugins, para uma única empresa por
instalação.

## Linguagem

### Pessoas e acesso

**Pessoa**:
O ser humano que usa o chat. Cada Pessoa tem exatamente uma Conta.
_Evite_: usuário, user

**Conta**:
O acesso de uma Pessoa ao chat, por e-mail e senha, criado pela empresa fora do produto.
_Evite_: login, cadastro

**Sessão**:
O período em que uma Conta fica entrada num navegador, compartilhado por todas as abas dele.
_Evite_: login (como substantivo)

**Nome de usuário**:
O identificador único de uma Pessoa ou de um Agente, escrito com `@`, usado em menções e na busca.
_Evite_: handle, apelido

**Administrador**:
A Pessoa que pode conectar e desconectar Agentes. Não dá, por si só, Permissão de dados.
_Evite_: admin, dono

**Permissão de dados**:
O direito de uma Pessoa de receber o conteúdo de dados de negócio. Independe de ser Administrador.
_Evite_: acesso a dados, permissão de BI

**Presença**:
Se a Pessoa está online ou ausente, como ela mesma escolhe.
_Evite_: disponibilidade

**Status**:
Um texto livre e curto que a Pessoa mostra no perfil, como "em reunião".
_Evite_: recado, mensagem de status

**Workspace**:
O espaço único da empresa, onde estão todas as Pessoas, Conversas e Agentes.
_Evite_: organização, empresa, tenant

### Conversas

**Conversa**:
Qualquer lugar onde se trocam mensagens: um Canal ou uma Conversa direta. Toda mensagem pertence a
exatamente uma Conversa.
_Evite_: chat, sala

**Canal**:
Uma Conversa com nome, pública ou privada.
_Evite_: grupo, sala

**Canal público**:
Um Canal de que todas as Pessoas do Workspace participam, sem precisar entrar.

**Canal privado**:
Um Canal que só os Membros convidados veem e em que só eles participam.

**Membro**:
Uma Pessoa que participa de um Canal. No Canal público, toda Pessoa é Membro.
_Evite_: participante, integrante

**Conversa direta**:
Uma Conversa sem nome entre exatamente duas Pessoas diferentes.
_Evite_: DM (exceto como rótulo na tela), conversa 1:1, mensagem privada

### Mensagens

**Menção**:
A referência a uma Pessoa ou a um Agente pelo Nome de usuário numa mensagem. Só notifica quem
participa da Conversa e nunca dá acesso a ela.
_Evite_: marcação, tag

**Citação**:
Uma mensagem que aponta para outra da mesma Conversa e a mostra na versão atual dela: editada, ou
como Mensagem apagada.
_Evite_: resposta, reply, thread

**Mensagem apagada**:
O que resta de uma mensagem que o autor apagou: só a marca, sem o conteúdo.

**Última leitura**:
O ponto até onde uma Pessoa já viu uma Conversa.

**Não lidas**:
As mensagens de uma Conversa depois da Última leitura da Pessoa, sem contar as dela mesma. As do
Agente contam.
_Evite_: novas, pendentes

**Menções não lidas**:
As Não lidas que mencionam a Pessoa.

### Agentes

**Agente**:
Um plugin de IA conectado ao Workspace por um Administrador, que tem Nome de usuário e escreve
mensagens nas Conversas. Atua em qualquer Conversa em que é mencionado, sem ser Membro. O
`@assistente` é o Agente atual.
_Evite_: bot, assistente (como termo genérico), IA

**Conectar e desconectar**:
Pôr um Agente no Workspace ou tirá-lo de lá. Desconectado, ele não recebe Pedidos novos, mas o
que ele já fez continua.
_Evite_: instalar, ativar, habilitar

**Pedido**:
A mensagem de uma Pessoa que aciona um Agente, seja por menção, seja respondendo a uma Pergunta
pendente. Mencionar um Agente faz um Pedido, não uma Notificação.
_Evite_: comando, prompt, chamada

**Pedido demorado**:
Um Pedido em que o Agente avisa na Conversa que começou e entrega a Resposta depois, enquanto a
conversa segue.
_Evite_: job, tarefa em segundo plano, assíncrono

**Resposta do Agente**:
A mensagem ou as mensagens com que um Agente encerra um Pedido.

**Pergunta pendente**:
O que o Agente pergunta quando falta algo no Pedido. Só quem fez o Pedido responde, sem mencionar
o Agente de novo, até ela expirar.
_Evite_: follow-up, esclarecimento

**Resposta pronta**:
Um botão que o Agente oferece com uma Pergunta pendente e que, clicado, responde a ela.
_Evite_: sugestão, chip, quick reply

**Resumo**:
O texto em que um Agente condensa as mensagens de uma Conversa dentro de um Recorte.
_Evite_: sumário, digest

**Recorte**:
A parte da Conversa que um Resumo cobre: hoje, desde ontem, a semana, tudo, o que uma Pessoa
disse ou um assunto.
_Evite_: filtro, período, intervalo

### Dados de negócio

**Dados de negócio**:
Os dados de vendas da empresa, que os Agentes só leem.
_Evite_: BI, dados da empresa, banco

**Consulta de dados**:
Um Pedido que precisa de Dados de negócio para ser respondido.
_Evite_: query, pergunta de dados

**Resposta bloqueada**:
Uma Resposta do Agente com Dados de negócio vista por quem não tem Permissão de dados: existe na
Conversa, sem o conteúdo. Continua bloqueada em Citação, Notificação e Resumo.
_Evite_: resposta oculta, censurada

**Relatório**:
O PDF que um Agente gera a partir de uma Consulta de dados, para baixar na Conversa.
_Evite_: export, arquivo

### Atenção e trabalho

**Tarefa**:
Um trabalho que uma Pessoa (quem delegou) passa a outra (o responsável) por meio de um Pedido a
um Agente. O responsável participa da Conversa em que ela foi pedida. Fica aberta ou concluída.
_Evite_: to-do, pendência, ação. A "tarefa" do planejamento (`F01-T01`) é vocabulário de processo
e não entra aqui.

**Notificação**:
O registro de que algo pede a atenção de uma Pessoa: uma menção, uma mensagem em Conversa direta
ou uma Tarefa.
_Evite_: aviso

**Alerta**:
A forma como uma Notificação aparece na tela do chat.
_Evite_: toast, pop-up

**Notificação do navegador**:
A forma opcional de uma Notificação, fora da página, que a Pessoa liga se quiser.
_Evite_: push

**Atividade**:
A tela que reúne as Notificações de uma Pessoa, separadas em Menções, DMs e Tarefas.
_Evite_: inbox, caixa de entrada
