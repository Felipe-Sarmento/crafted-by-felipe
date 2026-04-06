---
title: "Voltando ao básico com o Roadmap.sh: task tracker via CLI"
description: "O que acontece quando você abandona o banco de dados, o Docker e as libs e resolve um problema com filesystem e TypeScript puro"
pubDate: 2026-04-05
tags: [typescript, cli, arquitetura, roadmap.sh, desafios]
---

Há alguns dias resolvi que queria aumentar minha exposição a projetos novos. Não aqueles projetos que você se coloca em um único fim de semana, mas sim coisas pequenas, focadas em aprender uma abordagem diferente ou revisitar conceitos que há tempo não tocava. Então achei no <a href="https://roadmap.sh">roadmap.sh</a> uma seção somente sobre projetos. Muito interessante.

Encontrei o desafio do task tracker, e achei muito interessante. Era exatamente o tipo de coisa que eu procurava — um projeto pequeno, com restrições bem claras, mas que me forçaria a pensar em como resolver o problema sem cair em soluções óbvias demais. Além de ser um bom jeito de aquecer nessa nova rotina.

## O Desafio

O task tracker é uma aplicação CLI bem simples. A ideia é permitir que você adicione, delete, edite e marque tasks como "em progresso" ou "completa". Você também consegue listar todas as tasks ou filtrar por status.

Mas aqui vem a parte interessante: tudo via CLI. Sem API, sem HTTP, nada de web server. E a persistência? Filesystem. Sem Docker, sem banco de dados, sem provisioning de nada. Apenas um JSON que você lê, manipula em memória, e escreve de volta no disco.

## Por que isso importa

Tem algo interessante em voltar a resolver problemas assim. Via de regra, quando estamos trabalhando em aplicações "reais", tudo é abstrato: usamos bancos de dados, caches distribuídos, message queues. Quando você tira todas essas abstrações e se vê forçado a resolver um problema com o que o sistema operacional te oferece, você relembra uma coisa fundamental: _bom senso não é luxo, é necessidade_.

Não por acaso, comecei este projeto com uma postura clara: pensar em arquitetura antes de sentar e codificar. Criei um repositório, coloquei TypeScript, e decidi dividir a aplicação em **três camadas bem definidas**.

## Três Camadas

Sim, decidi seguir o padrão de separação de camadas de clean architecture. A primeira camada é a **presentation**, que cuida de tudo relacionado ao CLI — parsing de argumentos, validação de comandos, erro handlers. A segunda é a **domain**, onde moram as entidades de negócio (neste caso, a entidade Task). A terceira é a **infra**, que cuida de como os dados são persistidos.

## Presentation: O Command Registry

Aqui é onde fica interessante. Em vez de usar um monte de `if-else` ou um `switch-case` alinhado, decidi criar um `CommandRegistry` — basicamente um mapa de todos os comandos disponíveis, com seus handlers e os parâmetros que cada um espera.

```typescript
export class CommandRegistry {
  public commands: Map<CommandAction, Command> = new Map<CommandAction, Command>();
  private readonly repository: TaskJsonRepository;

  constructor() {
    this.repository = new TaskJsonRepository();
    this.commands.set("add",              { handler: new AddCommandProcessor(this.repository),             action: "add",              params: ["text"] });
    this.commands.set("update",           { handler: new UpdateCommandProcessor(this.repository),          action: "update",           params: ["number", "text"] });
    this.commands.set("delete",           { handler: new DeleteCommandProcessor(this.repository),          action: "delete",           params: ["number"] });
    this.commands.set("mark-in-progress", { handler: new MarkInProgressCommandProcessor(this.repository), action: "mark-in-progress", params: ["number"] });
    this.commands.set("mark-done",        { handler: new MarkDoneCommandProcessor(this.repository),       action: "mark-done",        params: ["number"] });
    this.commands.set("list",             { handler: new ListCommandProcessor(this.repository),            action: "list",             params: ["text"] });
  }

  getByCommand(command: CommandAction) {
    return this.commands.get(command);
  }
}
```

Cada comando tem um handler (a classe que de fato executa a lógica), uma action (o nome do verbo), e uma lista de params esperados (para validação). O ponto chave aqui é que quando alguém tenta rodar um comando inválido, a gente simplesmente não encontra no map e lança uma exceção. Sem branching, sem lógica condicional complicada.

O `CommandHandler` faz exatamente isso — pega o comando, busca no registry, e se existir, chama o `process()`:

```typescript
handle(command: CommandAction, args?: string[]) {
  const retrieved = this.registry.getByCommand(command);
  if (!retrieved) throw new InvalidCommandException(command);
  retrieved.handler.process(command, args);
}
```

Elegante, previsível, testável. Cada comando é implementado como sua própria classe, implementando a interface `ICommandProcessor`. O padrão é sempre o mesmo: validar argumentos, criar a entidade, mandar para o repositório.

## Infra: O Repositório JSON

A persistência é onde a gente vê o trade-off consciente. No construtor, a gente lê o arquivo JSON do disco **uma única vez**, parseia tudo para objetos Task, e pronto — temos tudo em memória:

```typescript
constructor() {
  const content = readFileSync(join(__dirname, "../data/tasks.json"), "utf-8")
  const data = JSON.parse(content) as any[];
  this.data = data.map((fields) => TaskFactory.create({
    ...fields,
    createdAt: new Date(fields.createdAt),
    updatedAt: fields.updatedAt ? new Date(fields.updatedAt) : new Date(),
  }));
}
```

Todos os métodos do repositório (`create`, `update`, `delete`, `list`) trabalham nessa coleção em memória. Quando qualquer uma dessas operações termina, a gente chama um método `persist()` que reescreve o arquivo inteiro:

```typescript
private persist(): void {
  const json = JSON.stringify(this.data.map(t => t.fields()), null, 2);
  writeFileSync(join(__dirname, "../data/tasks.json"), json, "utf-8");
}
```

É claramente ineficiente para aplicações em produção — você está reescrevendo o arquivo a cada operação. Mas para um CLI pequeno? Funciona perfeitamente. E é honesto: o trade-off está ali na cara, você sabe o que está acontecendo. Não é uma otimização prematura, é uma solução que resolve o problema.

## Entry Point

O ponto de entrada é ridiculamente simples:

```typescript
const args = process.argv.slice(2);
const command = args[0] as CommandAction;
const handler = new CommandHandler().handle(command, args.splice(1));
```

Pega os argumentos passados na linha de comando, pega o primeiro (é o comando), e passa o resto para o handler. Pronto. A complexidade está fora dali.

## Takeaways

Tem algumas coisas que fiquei reforçando para mim mesmo fazendo este projeto.

A primeira é que **separação de camadas sempre compensa**, não importa o tamanho do projeto. Mesmo que você ache que é overkill, a clareza que você ganha — saber exatamente onde código pertence — vale a pena. Minha camada de presentation é só padrão de dispatch. Minha camada de domain é só a entidade. Minha camada de infra é só I/O. Nenhuma delas fala diretamente uma com a outra — tudo passa por interfaces.

A segunda é que **bom senso não é preguiça**. Aqui eu poderia ter criado um esquema de transações, implementado um sistema de cache, talvez até um file descriptor pool. Mas por quê? O problema está resolvido. A aplicação é rápida. O código é legível. Overengineering é quando você resolve um problema que ainda não existe.

A terceira é que **CLI é subestimado**. Muita gente quer web, quer interface gráfica, quer complexidade. Mas existe algo bonito e honesto em uma ferramenta que funciona via linha de comando. Sem JavaScript no browser, sem estado complexo, sem rede. Só você, a sua máquina, e o problema que você está resolvendo.

Excelente desafio. Fica a recomendação para quem quer aprender sem as camadas de abstração do dia a dia.

---

Curioso? O código está em <a href="https://github.com/Felipe-Sarmento/task-tracker-cli">github.com/Felipe-Sarmento/task-tracker-cli</a>, e o desafio original está em <a href="https://roadmap.sh/projects/task-tracker">roadmap.sh/projects/task-tracker</a>.
