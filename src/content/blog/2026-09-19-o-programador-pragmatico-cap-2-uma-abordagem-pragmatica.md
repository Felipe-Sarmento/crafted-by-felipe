---
title: "O Programador Pragmático, Capítulo 2: Uma Abordagem Pragmática"
description: "Leitura do Capítulo 2: os males da duplicação, ortogonalidade, reversibilidade, código rastreador, protótipos, linguagem de domínio e estimativas."
pubDate: 2026-09-19
tags: [livros, programador-pragmatico, engenharia-de-software, arquitetura]
---

## O Capítulo em Essência

Ao terminar o Capítulo 1, escrevi que ali começava a filosofia e que a prática viria depois. Se o capítulo anterior respondia "que tipo de profissional você quer ser?", este responde "como esse profissional toma decisões?". É a passagem da filosofia para o método.

O fio que costura os sete tópicos é a manutenção. Tudo aqui gira em torno de uma pergunta só: o código que eu estou escrevendo hoje vai ser fácil ou difícil de mudar amanhã? 


Bom, vamos por partes.

## 1 - Os Males da Duplicação

Imagine um sistema que lida com pessoas. Nele convivem perfis diferentes: o gerente faz certas coisas, o funcionário faz outras, o presidente faz outras tantas. Até aí, nada de mais: é o tipo de modelagem que aparece em quase todo domínio. O problema começa quando o que é comum a todos eles se espalha. Calcular a data de aniversário, alterar um nome, validar um documento: cada perfil resolve do seu jeito, no seu canto. Em vez de um comportamento, você tem três implementações que só coincidiam no dia em que foram escritas. E daí nasce o inferno de manutenção.

No Capítulo 1 eu escrevi sobre entropia de software, e esse é o mesmo problema com outra roupa. Um sistema não para no tempo. As configurações mudam, as regras mudam, as pessoas mudam. Então a questão nunca é *se* a manutenção vai acontecer, mas *quando*. Quando a lógica comum está pulverizada, cada mudança vira uma caça ao tesouro: é preciso achar todas as cópias e torcer para não ter esquecido nenhuma. A duplicação não é um problema porque ofende o bom gosto. Ela é um problema porque sabota justamente a capacidade que o software tem de ser mudado.

O livro separa a duplicação em quatro origens. Vamos ver cada uma.

### Duplicação Imposta

É aquela em que o desenvolvedor não teve escolha, o ambiente parece exigir a repetição. Aqui eu preciso ser honesto: é um trecho cujos exemplos não envelheceram bem. Os exemplos do livro vêm de limitações de linguagens, de padrões de projeto e de implementações alheias que, em 2026, mudaram de figura. Linguagens ganharam recursos, frameworks absorveram boilerplate. Mas o prognóstico continua útil, porque o ponto não é o exemplo, é a postura: se a duplicação é inevitável, que seja ao menos uma decisão ativa e previsível. Todos os pontos sujeitos à mesma restrição repetem o mesmo padrão, de forma consciente e registrada. O que não pode é a duplicação imposta virar duplicação acidental.

E tem uma parte do livro que eu acho especialmente boa: tratar documentação como implementação. Se dois blocos de código se repetem e só um deles tem comentário, você não duplicou código, duplicou código incompleto. O comentário é parte da coisa. Se for para duplicar, que seja com intenção, clareza e completude.

### Duplicação Inadvertida

É, na minha opinião, a mais grave de todas. Ela acontece quando repetimos código porque não enxergamos a possibilidade de um ponto comum. É o pináculo da falta de clareza.

Pense num sistema que calcula distâncias. Você calcula a rota de uma entrega, do ponto A ao ponto B. Além disso, vamos supor que o sistema também permite o cálculo de trajeto de pessoas (como um Google Maps). São regras de negócio completamente diferentes, uma fala de logística, a outra fala de facilitar a vida, e a tendência natural é tratá-las como universos separados. Só que por baixo existe a mesma coisa: deslocamento entre coordenadas. Ponto inicial, ponto final, comprimento, cobertura do trajeto. Talvez faça sentido haver um motor comum, mesmo que, na superfície, as duas coisas pareçam irreconciliáveis.

O livro dá um exemplo ainda mais concreto, no nível da classe: uma classe `Line`, com ponto de início, ponto de fim e um terceiro campo, `length`. `length` deve ser uma propriedade? A pergunta parece boba, mas expõe a armadilha. `length` depende de `start` e de `end`; ele nunca é uma informação independente, é uma consequência dos outros dois. Transformá-lo em propriedade é criar uma segunda fonte de verdade que pode dessincronizar. É melhor que seja um método. O livro reconhece, porém, que uma propriedade pode fazer sentido quando calcular `length` toda hora custa caro. E aí a saída não é escolher entre performance e correção: é fazer com que o construtor recalcule `length` sempre que `start` ou `end` mudarem. A performance vem, e a verdade continua escrita em um lugar só.

### Duplicação Impaciente

É provavelmente a mais comum, e sempre a mais fácil de justificar no calor do momento. Todo projeto sofre pressão de tempo; a gente precisa entregar agora, o escopo é complexo, sempre aparece um motivo. O desenvolvedor sabe que está duplicando e duplica mesmo assim, porque o atalho é mais fácil neste instante.

Imagine que você tem um dashboard de **pessoas** e o cliente pede um dashboard igual, só que de **imóveis**. A reação quase reflexa é copiar o de pessoas e trocar apenas os dados. A demanda é entregue, e o problema fica plantado. Quando alguém pedir que todo dashboard tenha filtro, ou exportação, ou visão tabular, você vai ter que visitar cada cópia, uma por uma. O que parecia economia virou dívida.

Talvez a pergunta certa, na hora de criar o segundo dashboard, fosse outra: o que é um dashboard, afinal? O que todo dashboard precisa ter? Filtros? Exportação? Visão tabular? Se a resposta existisse antes da cópia, o trabalho seria maior uma vez e menor para sempre. A fronteira entre as entidades passa a ser só a camada de dados, e não a tela inteira.

E aqui o trade-off é real: normalizar dá mais trabalho agora e menos trabalho depois. Copiar dá menos agora e mais depois. A diferença é que a conta do "depois" chega sem aviso, quando o contexto já mudou e ninguém mais lembra por que aquela cópia existe.

### Duplicação Entre Desenvolvedores

Por último, o livro a chama da mais difícil de detectar, porque nasce da assimetria: pessoas diferentes, conjuntos diferentes de funcionalidades, trabalho assíncrono, ninguém com o contexto inteiro na cabeça. A recomendação clássica é comunicação clara, e não há como discordar do princípio.

Pessoalmente, porém, é o ponto que mais envelheceu, não porque o diagnóstico esteja errado, mas porque o remédio mudou. Em 2026, comunicação clara virou documentação ativa de padrões: uma vez identificado um tipo de duplicação, o modus operandi é registrar a regra, "neste caso não duplique, faça assim", e deixar que ela viaje pelo time. E com a IA no meio do processo, seja escrevendo código, seja revisando, a aplicação dessas regras ficou muito mais barata e muito mais uniforme. O cerne do capítulo continua verdadeiro, comunicação e padronização, mas a parte difícil ficou fácil. É, hoje, a menos perigosa das quatro.

Afinal, a duplicação não é feia por ser feia. Ela é cara. Cada cópia é um lugar a mais para lembrar quando o comportamento mudar, e software muda sempre. Normalizar não é preciosismo de arquiteto: é entender que o código que aguenta o tempo é aquele que tem cada verdade escrita em um lugar só.

## 2 - Ortogonalidade

Ortogonalidade foi um termo que eu não tinha visto aplicado a software antes de ler este capítulo. E, no começo, ele soa exatamente como o que é: uma palavra emprestada da matemática. Num plano cartesiano, o eixo X e o eixo Y são ortogonais. Se você move um ponto no eixo X, a coordenada Y não muda. Se move no Y, o X fica onde está. Independência pura.

É uma analogia boa demais para ficar só na matemática. A pergunta que ela deixa para o software é simples: se eu mexer em uma parte do sistema, quantas outras partes se mexem sem eu ter pedido? Quanto maior o número, menos ortogonal é o sistema.

### Uma Analogia da Matemática

Para entender o que é um sistema ortogonal, o livro começa pelo avesso. Ele descreve um helicóptero, e um helicóptero é, deliberadamente, não ortogonal. Você inclina a aeronave para a esquerda e outras respostas vêm junto. Isso não é um defeito: é projeto. O piloto precisa sentir no corpo que cada comando move o conjunto, e essa falta de independência é justamente o que dá urgência e percepção de mudança. O não ortogonal, ali, comunica.

Em software, queremos o contrário. Se eu altero uma parte isolada, as partes independentes dela deveriam permanecer exatamente como estavam. Esse é o objetivo.

Você provavelmente já viu essa ideia com outros dois nomes: coesão e acoplamento. O que está junto e depende um do outro deve mudar junto; o que é separado deve poder mudar sem gerar impacto. Ortogonalidade é o nome que o livro dá ao resultado; coesão e acoplamento são as forças que produzem esse resultado.

### O Dashboard e o Banco de Dados

Se você precisar de uma única imagem mental para este capítulo, fique com esta: um dashboard na frente, um banco de dados atrás. Se o dashboard é feito em React, mostra os dados em tabela e é verde, e eu decido refazê-lo em Vue, em formato de relatório e azul, isso não deveria me obrigar a mexer no banco de dados. Do mesmo jeito, se os dados hoje vivem num Postgres relacional e eu resolvo migrá-los para um MongoDB, a interface não deveria precisar saber disso.

Esse é o teste. O armazenamento é indiferente à visualização, e a visualização é indiferente ao armazenamento. Cada lado tem o seu eixo. Quando um não arrasta o outro, o sistema é ortogonal.

### O Que a Ortogonalidade Compra

E aqui não é só elegância. O ganho é de produtividade, e eu concordo com o livro: separar o código em componentes que não se sobrepõem é uma das bases da engenharia de software. Arquitetura modular, Domain Driven Design, microsserviços, que são todas implementações desse mesmo princípio para contextos diferentes.

O raciocínio encadeia. Componentes menores e independentes são mais fáceis de manter, mais autônomos, têm menos código e podem ser melhor projetados, codificados e testados. Componentes ortogonais também se reutilizam melhor: se tudo sobre um assunto mora no mesmo lugar, quem precisa dele consome o módulo inteiro, e não cata pedaços espalhados.

Exemplo: um módulo de pessoas e um módulo de trabalhos. Se o de trabalhos precisa consultar pessoas, a integração é fácil porque tudo sobre pessoas está num lugar só. E o risco também cai. Um módulo danificado fica danificado sozinho, com menos chance de espalhar efeito em cascata. O sistema fica menos frágil, os problemas ficam restritos à sua própria área, e você ainda depende menos de uma plataforma ou fornecedor específico, porque as interfaces estão confinadas às fronteiras dos módulos.

### Ortogonalidade Entre Times

A seção dá um passo além do código, e esse é o ponto que eu acho mais interessante: no fim das contas, componentes são feitos por pessoas, e pessoas trabalham em times. Existe também uma ortogonalidade entre times e projetos, e vale modular a empresa para lidar com os N projetos que ela tem sem que todos precisem conversar com todos.

O livro propõe uma métrica simples e incômoda: conte quantas pessoas precisam ser envolvidas na discussão de cada mudança solicitada. Se esse número é grande demais, o sistema e a forma como a empresa funciona são pouco ortogonais. Se a decisão cabe em um grupo pequeno e autocontido, é sinal de que as coisas estão bem modularizadas.

### Bibliotecas de Terceiros

Todo projeto usa código de terceiros: uma biblioteca aqui, um kit de ferramentas ali, um framework. E o cuidado que o livro pede continua válido, porque código de terceiro muda sem pedir desculpas. Aquela biblioteca que sustentava uma parte do sistema pode mudar de rumo, perder manutenção, ser abandonada, e você descobre isso do dia para a noite.

React é um bom exemplo do tipo de decisão que precisa ser tomada com consciência: quanto da sua visão de mundo você deixa um terceiro definir? O aviso do livro é o de sempre, só que com roupa nova: aceite dependências, mas saiba onde elas tocam o seu código e quanto custaria arrancá-las.

### Como Não Perder a Ortogonalidade ao Codar

O livro desce ao nível da codificação, porque manter ortogonalidade não é um estado que se conquista uma vez. A menos que você avalie minuciosamente o que escreve, o sistema deriva para o acoplamento. Algumas dicas gerais ajudam.

**Mantenha o código desvinculado.** Um módulo não deve revelar o que outros módulos não precisam saber. Imagine um módulo de usuário e um módulo de emprego. O de usuário só precisa saber quais empregos existem para associá-los às pessoas. Se o de usuário consegue adicionar ou remover empregos diretamente, a fronteira falhou: ele está mexendo no interno de outro módulo. É aqui que entra a Lei de Demeter, que diz, em essência: se você precisa alterar algo dentro de um objeto, deixe que o próprio objeto faça isso. O módulo de usuário pede; quem altera é o módulo de emprego.

**Cuidado com o estado global.** A recomendação original era evitar variáveis globais, e essa parte envelheceu: linguagens modernas tornaram a prática rara. A versão atual do conselho é o mesmo espírito com outra roupagem: tenha cuidado com o estado global, prefira o estado local, e trate o global como exceção e não como regra. Estado compartilhado é o caminho mais curto para dependências invisíveis.

### Testes e Documentação

O capítulo fecha com uma constatação dupla. Sistemas ortogonais são mais fáceis de testar: cada módulo funciona de forma independente, as fronteiras são claras e os testes ficam objetivos. E a documentação segue a mesma lógica. Uma documentação ortogonal separa conteúdo de apresentação, de modo que você pode mudar a aparência dramaticamente sem tocar no que está sendo dito.

O preço da ortogonalidade é real e vale nomear: definir fronteiras dá trabalho, cria indireção e não sai de graça. Sistemas pequenos, quase triviais, talvez não precisem do mesmo grau de separação. E existem funcionalidades que atravessam todos os módulos, como log, autenticação e telemetria, difíceis por natureza de manter ortogonais. Portanto, é importante saber que cada dependência que você aceita é uma promessa de que as partes vão mudar juntas.

No fim, um sistema ortogonal não é o que tem as melhores peças. É o que permite mexer numa peça sem ter que mexer nas outras.

## 3 - Reversibilidade

Preciso começar esta seção admitindo que ela foi polêmica para mim. Não pelo conteúdo, que é valioso, mas porque eu concordo com o princípio e desconfio do tom imperativo que ele aparentemente ganhou. Vou explicar adiante. Por ora, fico com a frase que abre o capítulo: nada é mais perigoso do que uma ideia quando ela é a única que você tem.

### A Ideia Única é a Mais Perigosa

Traduzida para o dia a dia de um projeto, a frase significa o seguinte: em algum momento, cedo, a equipe se compromete com algumas verdades. O banco vai ser PostgreSQL. A arquitetura vai ser hexagonal. São decisões tomadas antes de o problema estar inteiramente compreendido, e por isso mesmo são as que mais apostam. Meses depois, uma delas cai. Uma restrição de engenharia impede o Postgres. O compliance da empresa não aceita aquele formato de arquitetura. E agora?

Quando existe só uma ideia, não existe plano B, existe potencial para crise. A armadilha não é ter escolhido o Postgres, porque escolher é inevitável. A armadilha é ter escolhido de um jeito que não deixa saída.

### Toda Grande Decisão Precisa de um Plano B

É aqui que entra a reversibilidade. O livro advoga que toda decisão grande precisa vir acompanhada de um plano de contingência, de uma capacidade de reversão. Não se trata de prever todos os futuros, e sim de não se acorrentar a um único. Reverter, no fundo, é manter opções abertas.

E isso conversa diretamente com a seção anterior. Quanto mais ortogonal o sistema, mais barato é tornar suas decisões reversíveis. Se o banco está isolado atrás de uma fronteira clara, trocá-lo é uma cirurgia localizada; se ele vaza pelo sistema inteiro, trocá-lo é tratar uma grande metástase. Reversibilidade e ortogonalidade são, em boa medida, o mesmo investimento visto de dois ângulos.

### O Preço de Ser Reversível

Bom, e é aqui que eu começo a discordar do tom. O livro defende a reversibilidade como um princípio, e eu concordo com a importância, mas acho que ele trata o custo de lado. Porque ser reversível não é de graça.

Algumas decisões, uma vez tomadas, só mudam ao preço de incêndios que a gente aceita apagar. Nem tudo reverte rápido, e o que reverte rápido normalmente reverte porque alguém pagou adiantado por isso: abstração a mais, indireção a mais, uma camada que existe para não amarrar e que cobra complexidade todos os dias. Existe um trade-off entre a liberdade de mudar e o custo de manter essa liberdade disponível.

O que me leva à nota que o livro não faz: sim, ser reversível é importantíssimo e precisa ser considerado. Mas o custo de ser reversível também precisa ser colocado na mesa, com o mesmo peso.

### E se Pedirem Windows?

Pense num sistema desenhado para aguentar mudanças. O banco pode mudar, o front pode mudar, as integrações podem mudar. Ele é reversível, até certo grau. Aí alguém diz que ele precisa rodar em Windows, e não em Linux. Essa possibilidade nunca entrou na conta. Considerá-la desde o início poderia ter alterado drasticamente o custo de tudo.

O exemplo é simples de propósito. Reversibilidade não é um interruptor, é um grau. E cada grau custa algo. A pergunta certa não é "esse sistema é reversível?", mas "reversível contra o quê, e a que preço?".

Por isso, não consigo ler este capítulo como um mandamento. Reversibilidade me parece menos um princípio imperativo e mais uma variável: um grau de exposição ao custo que se escolhe conscientemente, decisão por decisão. Acertar essa medida é engenharia; tratá-la como dogma é o mesmo erro da ideia única, só que do outro lado.

## 4 - Projéteis Luminosos

O título desta seção é, comicamente, um dos mais estranhos do livro, e por um bom motivo: ele só faz sentido depois da analogia. Então vamos começar por ela.

### Duas Formas de Atirar no Escuro

O livro propõe um exercício militar. Imagine que você precisa acertar um alvo no escuro com uma metralhadora. Há dois jeitos.

O primeiro é a via do cálculo. Você determina a posição do alvo, a distância, a elevação, o azimute. Mede temperatura, umidade, pressão atmosférica. Levanta a especificação exata dos cartuchos e das balas e como elas interagem com a arma que vai dispará-las. Se tudo estiver certo, a bala acerta. É preciso, é rigoroso, é longo, e o feedback demora uma eternidade para chegar, porque só no fim você descobre se acertou.

O segundo jeito é carregar projéteis luminosos. Eles vão no pente como balas comuns, posicionados a intervalos. Quando disparados, o fósforo se acende e deixa uma trilha. Você atira, vê para onde foi, corrige, atira de novo. Menos esforço, retorno mais rápido, precisão que se constrói a cada disparo.

Note o que a analogia não diz. Ela não diz que mirar é errado. Diz que existe diferença entre prever o acerto e descobrir o acerto, e que às vezes o caminho incremental chega lá mais rápido e de forma mais barata.

### Do Tiro ao Código Rastreador

Transportada para projetos, a primeira hipótese vira a especificação exaustiva: classificar o sistema em detalhe, produzir uma montanha de documentos descrevendo cada requisito, antecipando cada incerteza, restringindo o ambiente até que pouca coisa surpreenda. É o tipo de trabalho que promete segurança e costuma entregar atraso.

A segunda hipótese vira o que o livro chama de **código rastreador**. A ideia é montar um artefato pequeno e real, que não pretende ser o requisito final, mas serve de base sobre a qual os programadores trabalham, coletam feedback e evoluem o sistema. Ele aceita menos detalhe no primeiro momento porque o objetivo não é acertar de primeira, é descobrir onde está o alvo.

E aqui está o que torna o código rastreador interessante: ele não é uma maquete. Ele existe no sistema de verdade, encosta nas partes reais, dá para evoluir. Cada ciclo acrescenta precisão, e o que já foi feito continua valendo.

### Código Rastreador Não é Protótipo

O livro faz uma distinção que eu não conhecia e que vale guardar para a próxima seção. O protótipo é tudo aquilo que se constrói para ganhar realismo e depois é jogado fora. Ele responde perguntas: "funciona assim?", "aguenta esse volume?" e morre ali.

O código rastreador é o oposto. Ele não é descartado. É útil, vira base, aceita um nível de detalhe menor no começo e vai sendo refinado ciclo a ciclo até chegar ao fim. Protótipo é rascunho; código rastreador é a primeira versão de algo que fica.

### Por Que Isso Soa com Ágil

Pessoalmente, este capítulo me lembrou muito a metodologia ágil vista pelo ângulo que importa: geração de valor. Em vez de um trabalho colossal só para produzir previsibilidade, talvez faça mais sentido uma linha de base simples, que entregue algo, converse com o usuário cedo e melhore essa realidade de forma sensata até o fim do projeto.

E isso ecoa o Capítulo 1. É a sopa de pedras outra vez: começar pequeno, fazer bem feito, mostrar valor e conquistar espaço para o próximo passo. É também o software suficientemente bom, que troca a perfeição futura pela utilidade presente.

Mas eu não compraria a ideia como um mandamento. Existe espaço para as duas abordagens, e depende do problema. Contextos regulados, sistemas críticos de segurança, contratos de escopo fechado, todos esses ainda se beneficiam de mais previsibilidade e de mais papel. E o código rastreador tem uma dependência silenciosa: ele precisa de um laço real de feedback. Se o usuário não participa, a trilha não ilumina nada.

Ainda assim, na média, a abordagem é mais barata, mais satisfatória e dá um ritmo melhor ao cliente. E isso tem valor por si só: ninguém gosta de ficar no escuro por muito tempo. Trocadilho à parte.

## 5 - Protótipos e Notas Post-It

Esta é uma das seções curtas do capítulo, e talvez por isso uma das mais diretas. Ela responde a uma pergunta que todo projeto grande faz cedo ou tarde: dá para saber se isso vai funcionar antes de apostar tudo nisso?

### Para Que Serve um Protótipo

Imagine que você quer construir um sistema complexo, daqueles que modelam o corpo humano. A ideia é boa, mas você gostaria de saber, antecipadamente, se o projeto vai dar certo. Talvez a complexidade seja grande demais. Talvez aquilo só seja entregável em dez anos, com mil pessoas, e isso está muito além do orçamento de tempo e esforço que você tem. O que fazer?

A resposta do livro é o protótipo: construir uma versão mais barata, no nível do código. E isso muda tudo o que você normalmente faria. Um protótipo feito para testar uma funcionalidade pode ignorar arquitetura, ignorar boas práticas, ignorar segurança. Ele foca exclusivamente no funcional daquilo que está sendo testado e serve como prova de conceito para garantir que o todo é possível.

Não é invenção de software. Prototipar é prática comum em várias indústrias: nenhuma montadora constrói a linha inteira antes de saber se o motor encaixa. O propósito é sempre o mesmo: descobrir barato antes de gastar caro.

### O Valor Está no Aprendizado

E tem um detalhe que é o coração da seção: o protótipo é uma experiência de aprendizado, e o valor dele não está no protótipo em si. Se você conseguiu fazer a funcionalidade e o protótipo ficou bom, isso não quer dizer que o código dele sirva. Pode estar costurado com gambiarras que nunca passariam de um code review, e tudo bem: esse nunca foi o ponto.

O que importa é o aprendizado, a jornada, a certeza de que pode ser feito. É por isso que protótipos são, via de regra, descartáveis. O produto do protótipo é conhecimento, não código.

### O Que Você Pode Ignorar

O livro dá algumas pistas do que relaxar. A precisão: os dados podem ser mockados ou inventados, não faz diferença. A integralidade: você não precisa do sistema todo, só da parte que importa. A robustez e o estilo também ficam de fora. O protótipo existe para responder uma pergunta, e tudo que não ajuda a respondê-la é peso morto.

### Como Não Usar um Protótipo

Se eu pudesse sublinhar um parágrafo deste capítulo, seria este: não trate o protótipo como a visão evolutiva do produto. Não deixe que ele vire a primeira versão da coisa de verdade.

É justamente por ser descartável que o protótipo é barato, rápido e fácil. No instante em que ele vira base a ser mantida, você herda todas as decisões que tomou para não precisar mantê-lo: a arquitetura ignorada, a segurança ignorada, o código de prova. Fica com o pior dos dois mundos: a ambição de um sistema sério com a solidez de um rascunho.

Por isso, a parte mais importante da prototipação é comunicação. Deixe muito claro, para todo mundo e desde o começo, que aquilo é um protótipo e que ele certamente será descartado ao fim. Se ninguém sabe que a trilha é de teste, alguém vai querer morar nela.

## 6 - Linguagens de Domínio

Este capítulo abre com uma frase que eu não esperava encontrar num livro de engenharia de software: os limites da linguagem são os limites do mundo de uma pessoa. É provocativo, e é verdadeiro de um jeito que a gente subestima.

### Os Limites da Linguagem São os Limites do Mundo

A primeira ideia é que a linguagem de programação que você usa molda a forma como você pensa o problema. Quem trabalha com uma linguagem orientada a objetos modela o mundo em objetos, responsabilidades e colaborações. Quem trabalha com uma linguagem funcional tende a enxergar transformações, composições e dados imutáveis. O problema pode ser o mesmo; o modelo mental não é.

E o livro dá um passo além, que é onde a coisa fica interessante: a linguagem do próprio domínio também pode sugerir uma solução de programação. Quando o vocabulário do negócio é preciso, ele aponta para o desenho do sistema. Quando é vago, esconde o problema atrás de palavras que todo mundo usa e ninguém define.

### Um Glossário para o Produto

Daí a sugestão que, para mim, é o ponto alto do capítulo: criar um glossário do produto. A função dele é deixar a linguagem acurada, separar o sentido usual de uma palavra do sentido que ela tem naquele sistema, naquele negócio.

Penso num sistema que lida com procedimentos. Procedimento é uma palavra traiçoeira para quem programa, porque *procedure* é termo comum no nosso vocabulário técnico. Então o glossário precisa responder: procedimento, aqui, é um conceito do domínio, algo que o cliente reconhece como parte do trabalho dele, ou é só um nome genérico que vazou do código para a conversa? O mesmo vale para controller, service, repositório, palavras que carregamos do técnico para o negócio e que, sem definição, viram ruído.

Um glossário bem feito é uma máquina de diminuir ambiguidade. Ele obriga a resposta para a pergunta que ninguém faz em voz alta: quando duas pessoas usam a mesma palavra, elas estão falando da mesma coisa?

### A Mini-Linguagem

O livro sugere um passo adiante: implementar uma mini-linguagem, uma camada de idioma entre o técnico e o desenvolvimento. É a ideia de aproximar a expressão do negócio da expressão do código, para que uma ideia do cliente tenha um caminho curto até virar comportamento no sistema.

Aqui eu preciso ponderar, porque é fácil se empolgar. Construir uma linguagem própria custa caro: você cria uma sintaxe, uma semântica e uma manutenção que passam a viver junto do produto. Isso se paga quando o vocabulário do domínio é rico, recorrente e estável o suficiente para merecer uma linguagem. Fora disso, vira abstração a mais, e abstração a mais é exatamente o tipo de custo que as seções anteriores nos ensinaram a evitar.

E tem uma armadilha silenciosa com glossários e linguagens: eles envelhecem junto com o produto. Um glossário que ninguém revisa passa a mentir com confiança. Vocabulário é código vivo e precisa de manutenção como qualquer outro artefato.

### O Que Ficou Aquém

O capítulo dá a direção, mas para antes de explorá-la. Ele fala de glossário e de mini-linguagem, e fica por aí. O tempo mostrou que essa intuição era maior do que o espaço que ela ocupou aqui: é exatamente o caminho que o Domain Driven Design percorreu depois, com a ideia de linguagem ubíqua: um vocabulário compartilhado por especialistas do domínio e desenvolvedores, que atravessa a conversa, o modelo e o código.

O capítulo não chegou a nomear isso, mas apontou para lá. Por isso a lição que fica vale mais do que o texto que a apresentou. Prefira sempre trabalhar com nomes próximos do domínio. Não é preciosismo de nomenclatura: é o que faz cliente e programador estarem, de fato, falando a mesma língua.

## 7 - Estimando

Fechando o capítulo, o último tópico é um dos mais desconfortáveis para quem escreve software: estimar. E o livro começa desfazendo um mito que muita gente carrega: o de que estimar é um talento inato, quase mágico, de quem tem o dom.

### Estimar é uma Habilidade

O que o livro defende é o contrário: estimar é uma habilidade e, como toda habilidade, é treinável. Desenvolvê-la dá uma percepção intuitiva da dimensão das coisas e uma capacidade quase mágica de julgar viabilidade antes de se comprometer com um projeto. Mas o "quase mágica" fica entre aspas: por trás existe quilometragem, tentativa, erro e comparação com o que já passou.

### Qual Precisão Basta?

Antes de falar de técnicas, o capítulo faz a pergunta que norteia a discussão: qual nível de exatidão é suficiente? Até certo ponto, tudo é estimativa. Algumas perguntas, porém, pedem mais precisão do que outras, e parte do ofício é descobrir qual precisão aquela pergunta específica exige: nem mais, nem menos.

E tem uma sacada prática: a unidade que você escolhe comunica coisas diferentes. Se a resposta está entre 1 e 15 dias, fale em dias, uns 7, por exemplo. Se está entre 3 e 8 semanas, fale em semanas. Entre 8 e 30 semanas, fale em meses. Acima de 30 semanas, para software, o livro pede que você pense duas vezes antes de dar a estimativa, porque esse horizonte já diz mais sobre a fragilidade da previsão do que sobre o trabalho.

Escolher a unidade certa é parte de não mentir. Responder "7 dias" onde cabia "cerca de três semanas" não é precisão, é criação de frustrações futuras.

### De Onde Vêm as Estimativas

As estimativas vêm de modelos do problema. E aqui entra o conselho mais barato e mais ignorado de todos: antes de mergulhar em técnica, pergunte a alguém que já passou pela mesma coisa. Quem já fez carrega o modelo pronto.

Junto com isso vem a parte que estraga mais estimativas do que a falta de técnica: entender o que está sendo pedido. Se o pedido é a resolução de um problema, atenha a estimativa a resolver aquele problema, e não a construir o sistema inteiro que você imaginou por reflexo. A falácia conveniente é achar que "o cliente pediu X, logo quer o sistema completo". Esse viés fecha você numa solução antes de considerar se ela é mesmo adequada. E aí a estimativa já nasce errada, com um erro que não é de cálculo, é de escopo.

### Quando Falta Contexto

O que fazer quando a estimativa é imprecisa ou o contexto ainda não existe? O caminho é construir entendimento antes de construir número: faça um protótipo, isole os parâmetros, defina tamanhos. Cada camada que você aprofunda vira parâmetro para calibrar a estimativa e tornar a sua ideia defensável.

Do ponto de vista de cronograma, o livro sugere verificar os requisitos, analisar risco, projetar, implementar e integrar num mini modelo e validar com o usuário aos poucos. Cada um desses passos devolve realidade à estimativa, trocando achismo por evidência.

### A Resposta Primária é "Retorno Depois"

Se eu tivesse que guardar uma frase deste capítulo, seria esta: quando alguém pede uma estimativa, a sua resposta primária deve ser "retorno depois". Quase sempre os resultados são melhores quando desaceleramos e passamos algum tempo examinando as etapas. Estimar bem é, em boa parte, resistir à pressa de responder.

Isso não é protelação. Estimativa incompleta gera percepção ruim: o número solto vira compromisso, e o compromisso vira frustração quando se revela impossível. Vale mais analisar com cuidado, apoiar-se em quem já fez e puxar o problema para a sua parte maior, criando parâmetros, do que entregar um chute com cara de certeza.

E, como toda habilidade, isso melhora com o tempo. Quando o caminho não estiver claro, comunique-se com quem já trilhou. No fim, estimar é menos sobre adivinhar e mais sobre reduzir a incerteza de forma honesta, inclusive admitindo em voz alta que ela existe.

## O Que Fica

Fechando o capítulo, fica uma impressão de que o Programador Pragmático não ensina receitas: ensina a enxergar custo. Cada seção deste capítulo é, no fundo, a mesma pergunta feita de ângulos diferentes: essa decisão que eu estou tomando agora vai me custar quanto, e quando?

Duplicação é custo de manutenção. Acoplamento é custo de mudança. Irreversibilidade é custo de oportunidade. Especificação demais é custo de feedback. Protótipo que vira produto é custo de dívida. Linguagem imprecisa é custo de comunicação. Estimativa apressada é custo de confiança. Em todos os casos, o barato de hoje é o caro de amanhã, e o pragmatismo é ter consciência disso na hora de escolher, não depois.

E, diferente do Capítulo 1, aqui eu discordei em alguns pontos. Achei o trecho de duplicação entre desenvolvedores datado, o capítulo de linguagens de domínio aquém do que prometia e a reversibilidade apresentada com um tom mais imperativo do que o custo dela justifica. Isso não diminui o livro. Ao contrário: um texto que continua provocando discordância depois de tantos anos está fazendo o trabalho dele.

No fim, o que fica não é um conjunto de regras, é um critério. Antes de seguir o caminho mais fácil, pergunte o que ele cobra depois. Software que aguenta o tempo não é o que foi feito com as melhores ferramentas, e sim o que foi feito com as decisões mais conscientes.

No próximo post eu encaro o Capítulo 3, **As Ferramentas Básicas**, onde o livro sai do princípio e entra no ofício: as ferramentas que sustentam o trabalho de quem constrói software.
