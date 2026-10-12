---
title: "O Programador Pragmático, Capítulo 5: Seja Flexível"
description: "Leitura do Capítulo 5, Seja Flexível: desvinculação e a Lei de Deméter, metaprogramação, vinculação temporal e o MVC como apenas um modo de ver."
pubDate: 2026-09-27
tags: [livros, programador-pragmatico, engenharia-de-software, acoplamento]
---

## O Capítulo em Essência

O Capítulo 4 foi sobre desconfiar; o Capítulo 5, **Seja Flexível**, é sobre não se amarrar. O eixo aqui é uma única inimiga, a vinculação (o acoplamento), e o livro a ataca por quatro ângulos: no código, na configuração, no tempo e na visualização.

A mensagem não é prever a mudança, e sim impedir que ela se espalhe. Cada tópico mostra um lugar onde o acoplamento se esconde e como reduzi-lo sem transformar o sistema num labirinto. Vamos passar pelos quatro.

## 1 - A Desvinculação e a Lei de Deméter

Este tópico retoma uma ideia que já apareceu antes na série, mas agora com um foco mais afiado: para que o software seja flexível, ele precisa estar bem modularizado. Na prática, isso significa organizar o código em módulos, pacotes ou camadas de separação e, principalmente, **limitar a interação entre eles**. Quando um módulo fica comprometido, muda ou precisa ser substituído (e isso sempre vai acontecer), os outros devem continuar funcionando sem grandes alterações. O princípio por trás disso tem nome: **redução da vinculação**, o acoplamento.

Vale cravar a premissa que sustenta o capítulo inteiro: um módulo vai mudar. Não é questão de "se", é de "quando". A pergunta relevante não é se o seu código vai precisar mudar, mas **quanto custa mudá-lo**. Em um sistema bem modularizado, a mudança fica contida. Em um sistema mal modularizado, ela se espalha.

O livro desce isso para o nível das funções, e o exemplo é enxuto. Imagine uma função `plotDate` que recebe um objeto `Date` e um objeto `Selection`. À primeira vista parece razoável: a função desenha um ponto no gráfico usando a data e a seleção. O problema é que, ao receber `Selection`, `plotDate` passa a depender dela. Se `Selection` mudar, a função muda junto, mesmo que a parte de plotar a data não tenha nada a ver com a mudança. A função ficou amarrada a um objeto de uma hierarquia mais alta do que precisava.

A alternativa é depender da camada mais baixa: em vez de passar o objeto rico, passe o tipo primitivo que a função realmente usa: a data, ou os valores dela. `plotDate` desenha uma data; então que dependa de uma data, e de mais nada. Quando `Selection` evoluir, `plotDate` nem sente. A vinculação diminui e, com ela, o custo de mudança.

A **Lei de Deméter**, também conhecida como o princípio de "não fale com estranhos", leva essa reflexão adiante. A regra é esta: um método só pode interagir com um conjunto restrito de coisas. Ele pode mexer em si mesmo, em qualquer parâmetro que tenha recebido, em objetos que ele mesmo criou internamente e em objetos que mantém diretamente. Só. Ele **não pode alcançar o estado interno de objetos que não são dele**. Não é assunto dele controlar o que acontece lá dentro.

O que a Lei de Deméter está dizendo, no fundo, é: **trabalhe dentro do seu próprio escopo, não acima dele**. Cada objeto cuida do seu próprio estado interno. Quando um método começa a navegar por uma corrente de chamadas para pegar algo lá no fim, ele está se acoplando a uma estrutura que não é dele, e qualquer mudança nessa estrutura vira uma mudança nele. Deixe que cada coisa tenha seu próprio estado, e converse apenas com quem você conhece diretamente.

O trade-off aqui é honesto e vale nomear. Reduzir vinculação quase sempre custa alguma indireção no começo: métodos-wrapper, tipos intermediários, mais camadas de separação. Levado ao extremo, o princípio produz uma multidão de métodos de repasse que só existem para não "falar com estranhos". Feito com bom senso, porém, o ganho compensa: a mudança passa a ser local, e o sistema aceita ser reescrito por partes sem precisar ser reescrito inteiro.

E o livro oferece dois sintomas práticos para saber se a modularização está errada. O primeiro: **uma alteração simples em um módulo se propaga por módulos não relacionados do sistema**. O segundo, e talvez o mais revelador: **os desenvolvedores têm medo de alterar um código porque não sabem o que pode ser afetado**. Quando mexer dá medo, não é o time que está inseguro, é o desenho que está frágil. Esses dois sinais juntos indicam que a modularização precisa ser revista.

## 2 - Metaprogramação

O livro abre este tópico com uma frase que eu não conhecia e passei a repetir: **"não há nível de genialidade que supere a preocupação com os detalhes"**, a oitava lei de Levi. Parece um elogio à atenção, mas no contexto da metaprogramação ela é quase uma provocação: se os detalhes são tão importantes, por que insistimos em enterrá-los no meio do código?

**Metaprogramação**, na definição mais direta, é programar aquilo que está sendo programado. É escrever código que molda a forma como o próprio sistema se comporta, em vez de fixar cada decisão em pedra. E o livro traz duas abordagens que qualquer programador com alguma estrada já viu na prática, ainda que não as chame por esses nomes: **configuração** e **injeção**.

A ideia central é esta: nós não queremos os detalhes dentro do código. Queremos os detalhes fora dele, para que o código fique leve. O exemplo clássico é a API. Em grande parte dos casos, uma API vai precisar de um banco de dados. Só que você não quer a string de conexão (nem a lógica de acesso) cravada no código-fonte. Por dois motivos. O primeiro é **flexibilidade**: amanhã você pode trocar de banco, e não deveria pagar por isso reescrevendo a aplicação. O segundo é **segurança**: credencial de banco no código é crédito aberto para desastre. A solução é separar o que é configuração da aplicação: variáveis de ambiente, arquivos de configuração, tudo fora do código.

Mas há um exemplo ainda melhor, porque mostra que a configuração não é só sobre strings. Imagine que a sua API precisa enviar e-mail. Existem várias formas de fazer isso: pelo protocolo SMTP, como era mais comum no passado, ou integrando a soluções atuais, como o SES da AWS. As implementações de SMTP e de SES são radicalmente diferentes. Só que o código que dispara o e-mail não precisa saber disso. **Quem envia e-mail não precisa saber se é SMTP ou SES.** O jeito adequado é extrair para a configuração qual é o tipo da implementação: vamos de modo SMTP ou vamos de modo SES?

E aqui vem o ponto que eu acho mais bonito do tópico. Pode parecer que configuração é algo estático, mas ela também pode acontecer de forma **dinâmica**, com o padrão JavaBeans e com **injeção de dependência**. Ou seja: se o modo for SMTP, eu quero que determinada classe de logging esteja ativa; se for SES, não, porque nesse caso a própria AWS cuida disso. A configuração deixa de ser um valor morto lido uma vez e passa a decidir, em tempo de execução, qual implementação entra em jogo. É a metaprogramação dizendo ao sistema o que ele é.

Os ganhos que o livro lista são diretos, e todos apontam para a mesma coisa:

- força a **desvinculação** do projeto, o que resulta em um programa mais flexível e adaptável;
- produz um projeto mais **robusto e abstrato**, ao deixar os detalhes para depois e tirá-los do programa;
- permite **personalizar o aplicativo sem recompilá-lo**;
- e usa esse nível de personalização para dar **soluções fáceis a erros críticos em produção**, que é onde flexibilidade deixa de ser elegância e vira sobrevivência.

O trade-off, como sempre, existe e eu não quero varrê-lo para debaixo do tapete. Tirar os detalhes do código custa um lugar onde eles passem a viver: configuração a mais, uma camada de indireção a mais, e um conjunto novo de erros que só aparecem em tempo de execução: configuração errada, variável de ambiente faltando, implementação injetada que não era a esperada. No extremo, o sistema vira um labirinto de flags e cada ambiente se comporta de um jeito. O que o tópico propõe não é esconder tudo, é **separar o que é detalhe mutável do que é a lógica estável**, e deixar a decisão sobre os detalhes fora do código, para que ela possa mudar sem recompilar o programa.

## 3 - Vinculação Temporal

A vinculação temporal é o tipo de acoplamento que mais engana, porque não aparece na estrutura do código: ela aparece no tempo. É o acoplamento que mora na **ordem** em que as coisas precisam acontecer. Dois trechos de código podem estar perfeitamente desvinculados em termos de dependência e, ainda assim, um exigir que o outro já tenha rodado antes. Isso é vinculação temporal: as coisas não estão amarradas entre si, mas estão amarradas à sequência.

O jeito mais fácil de enxergar é com exemplos do mundo real. Imagine o algoritmo de fazer um sanduíche: abre o pão, passa a geleia, fecha o pão, come. **A lógica é altamente sequencial**, cada passo depende do anterior e não há como paralelizar. A maioria de nós tende a pensar assim, linearmente, porque foi assim que aprendemos a resolver problemas.

Só que nem todo problema é um sanduíche. Imagine o algoritmo de cuidar da casa: pega as roupas, coloca na máquina, fecha, põe sabão, põe amaciante e liga. Em paralelo, a mesma pessoa enxágua pratos e passa sabão na louça. Agora repare no absurdo: imagine se a pessoa só pudesse começar a lavar a louça depois que a máquina terminasse, ou pior, se só ligasse a máquina no instante em que acabasse a louça. Não faz sentido. Enquanto a máquina trabalha, o resto do trabalho pode e deve andar junto. Estamos diante de tarefas que **não têm ordem obrigatória entre si**, e tratá-las como se tivessem é desperdício puro.

Para falar disso, o capítulo adota uma nomenclatura um pouco mais precisa: **concorrência**. Concorrência significa que coisas estão ocorrendo ao mesmo tempo, mas vale o alerta que confunde muita gente no início: **concorrência não significa paralelismo**. As duas ideias se cruzam, mas não são a mesma coisa. O paralelismo tem a ver com execução simultânea de fato, uma discussão mais profunda sobre como as CPUs trabalhavam quando existia apenas uma única thread. A concorrência, para os fins deste capítulo, é mais sobre **estrutura**: ela dita a ordem, as posições relativas das coisas no tempo. É a diferença entre "essas tarefas podem caminhar juntas" e "essas tarefas precisam de núcleos separados agora".

E aí está a virada que o livro propõe para o código. Em vez de assumir sequência por padrão, pense no seu algoritmo perguntando o que **precisa** ser sequencial e o que pode ser concorrente. O objetivo é que o código execute, de forma paralela ou concorrente, tudo o que for possível fazer junto, e execute de forma sequencial apenas aquilo que realmente depende da ordem. A regra prática é simples e eu gosto de repeti-la: **não imponha uma ordem que não é exigida pelo problema.**

O livro tem um exemplo clássico disso: um sistema de pedidos em que o método de adicionar item só funciona se o pedido já tiver sido aberto antes. Se você chama `addItem` sem `open`, quebra. Nada no domínio do problema exige essa ordem. Ela é uma decisão de projeto que acabou vazando para quem usa a classe. Um desenho melhor é aquele em que cada operação só dependa do que de fato é pré-requisito dela, e o resto fique livre. **Permita concorrência; exija sequência só quando houver motivo.**

O trade-off aqui é o mais caro do capítulo. Concorrência não é de graça: ela traz condições de corrida, deadlocks, comportamento não determinístico e bugs que somem na sua máquina e aparecem em produção. Código concorrente é mais difícil de depurar e de testar do que código sequencial, e por isso a resposta pragmática nunca é "paralelize tudo". É exatamente o contrário: **reduza a vinculação temporal onde a ordem era acidental, e mantenha a sequência explícita onde ela é real.** O ganho de performance vem de graça quando a ordem não era necessária; o custo de complexidade só se paga quando a ordem realmente importa.

## 4 - Apenas um Modo de Ver

Este tópico ataca um problema que só aparece depois que a gente faz a coisa certa. Somos ensinados a não tratar o programa como um bloco único, e sim a modularizá-lo internamente, cada parte com uma responsabilidade bem definida. Ótimo. Só que, uma vez que o programa está dividido em módulos, surge a pergunta que ninguém responde na aula: **em tempo de execução, como é que esses módulos se comunicam uns com os outros?** E o capítulo mostra que existe mais de uma resposta, porque, no fundo, comunicação entre módulos é apenas um modo de ver o problema.

A primeira forma é a **publicação e assinatura** (o famoso pub/sub). É a abordagem menos específica das duas, e por isso mesmo a mais flexível. A lógica é simples: se uma parte do sistema precisa que outra reaja a algo, em vez de chamá-la diretamente, ela publica um evento. "Acabei de fazer isso: operação A." Qualquer módulo interessado faz uma assinatura: "sistema, eu quero escutar tudo que acontece sobre o A; sempre que houver novidade sobre isso, me avisa que eu resolvo." Não há uma chamada direta entre quem produz e quem consome. Existe uma **estrutura de filas** no meio, intermediando.

E aqui há um valor que eu não quero deixar passar, porque na prática eu já tirei muito proveito dele: **pub/sub resolve problemas de dependência circular em frameworks mais modernos**. Quando o módulo A precisa do B e o B precisa do A, a injeção de dependência vira um nó. Com eventos no meio, cada lado assina o que lhe interessa e a circularidade simplesmente deixa de existir.

A segunda forma é o **MVC (Model-View-Controller)**. E o livro explica o padrão com um exemplo que deixa tudo concreto: imagine um aplicativo de planilha. Além dos números da própria planilha, existe um gráfico que exibe esses números como barras e uma caixa de diálogo que mostra a soma contínua. São **três pontos usando o mesmo dado**. Você não quer três duplicações do mesmo dado, com todo o trabalho e toda a chance de inconsistência que isso carrega. O MVC entra justamente para separar.

- **Model**: o dado em si, o modelo de dados abstrato que representa o objeto-alvo. Vive de forma separada. E o detalhe crucial: o modelo **não tem conhecimento direto de nenhuma visualização nem do controlador**.
- **View**: uma maneira de interpretar o modelo. Ela se adapta às alterações do modelo e aos eventos lógicos vindos do controlador. Um mesmo modelo pode ter **N visualizações**, e isso não é duplicação do dado.
- **Controller**: a maneira de controlar a visualização e fornecer novos dados para o modelo. Ele publica eventos tanto para o modelo quanto para a visualização.

O ponto que faz jus ao título do tópico está aqui: uma visualização é **apenas uma forma de ver** o mesmo modelo. O gráfico de barras e a caixa de total são recortes diferentes sobre o mesmo dado, não cópias dele. Quando a separação está bem feita, mexer na apresentação não toca na regra de negócio, e mexer no modelo não obriga a reescrever a tela. O modelo não sabe que a tela existe, e é exatamente isso que o deixa livre.

Na prática, o capítulo termina com duas ferramentas de desvinculação: o **MVC**, que separa o código em camadas distintas para que ele seja melhor mantido e executado, e o **pub/sub**, que garante uma comunicação leve entre módulos que não precisam se conhecer.

O trade-off é o preço da indireção, e ele aparece nas duas abordagens. Com pub/sub, o grafo de chamadas deixa de ser legível: ninguém "chama" ninguém, então descobrir quem reage a um evento vira arqueologia, e há o risco de tempestade de eventos e de ordem imprevisível. Com MVC, você paga em quantidade de classes e camadas, que para uma tela simples pode ser exagero. A escolha pragmática é sempre entre a comunicação explícita, que é fácil de seguir e cara de mudar, e a comunicação por eventos, que é solta para mudar e difícil de rastrear. **Não existe versão sem custo; existe a versão cujo custo você escolhe pagar.**

## O Que Fica

Seja flexível não é escrever código genérico para tudo. É escrever um sistema onde a mudança fica contida: módulos que não conhecem os vizinhos de longe, detalhes que moram fora do código, ordens que só existem quando o problema exige, e dados que não dependem de quem os mostra. Nenhum desses quatro gestos é grandioso; juntos, são a diferença entre um software que envelhece bem e um que apodrece a cada alteração.

No próximo post eu encaro o Capítulo 6, **Enquanto Você Está Codificando**, onde o livro desce ao nível do ato de programar: intenção no código, acoplamento no cotidiano, refatoração e a linha tênue entre testar e verificar.
