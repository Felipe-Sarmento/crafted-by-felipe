---
title: "O Programador Pragmático, Capítulo 4: Paranoia Pragmática"
description: "Leitura do Capítulo 4: projeto por contrato, falha rápida, programação assertiva, exceções e o equilíbrio dos recursos."
pubDate: 2026-09-24
tags: [livros, programador-pragmatico, engenharia-de-software, tratamento-de-erros]
---

## O Capítulo em Essência

Três capítulos, três camadas. O Capítulo 1 falou de postura, o Capítulo 2 de decisão, o Capítulo 3 do ofício. Chegando ao Capítulo 4, **Paranoia Pragmática**, o livro muda de eixo: agora não é mais sobre como trabalhar, é sobre como desconfiar.

A palavra paranoia costuma carregar um sentido ruim, mas aqui ela é reivindicada com um qualificador. Não é a desconfiança que paralisa, é a desconfiança que organiza. É assumir, desde o início, que o erro não é a exceção do software, é o estado padrão dele. O que pode dar errado vai dar errado, e a diferença entre um sistema frágil e um sistema sólido está em quem levou essa hipótese a sério na hora de escrever o código.

Os cinco tópicos do capítulo conversam entre si. O contrato define o que cada parte promete. Falhar cedo evita que um problema pequeno vire um estado corrompido. No fundo, é um capítulo sobre limites: onde cada mecanismo começa, onde termina e por que confundir os dois é o começo da bagunça.

## 1 - Projeto por Contrato

O primeiro tópico do capítulo é, na minha opinião, o que dá o tom de tudo o que vem depois: a ideia de trazer para a programação um contexto que a gente já conhece fora dela, o contrato.

O livro abre com uma constatação difícil de contestar: lidar com sistemas de computador é difícil, mas lidar com pessoas é ainda mais. É por isso que o contrato existe como instrumento. Ele define os direitos e as responsabilidades de uma parte e da outra, e ainda estabelece o que acontece se alguém não cumprir o combinado. Guarde essa frase, porque ela explica o capítulo inteiro: contrato é expectativa, obrigação e consequência, os três juntos.

O conceito que materializa isso no código é o **Design by Contract**, ou **DbC**, popularizado por Bertrand Meyer. A proposta é estruturar classes e rotinas de forma que cada interação seja regida por um contrato: uma parte se compromete a fazer algo, e o que se espera dela é verificável. Quando o contrato é rompido, o sistema reage de forma explícita, mantendo o estado do programa congruente, em vez de seguir adiante sobre uma suposição que não se sustenta mais.

O DbC se apoia em três peças.

### Pré-condições

A pré-condição é o que precisa ser verdadeiro para que uma rotina possa ser chamada, os requisitos dela. A analogia mais direta é com os inputs de uma função, ou com as condições que precisam valer antes da chamada. E aqui o detalhe que muda tudo: a responsabilidade é do **chamador**. Se a pré-condição não é cumprida, a culpa não é da rotina, é de quem chamou passando dados que não deveria ter passado.

### Pós-condições

A pós-condição é o espelho da anterior: o que a rotina garante que será verdade quando terminar, o estado das coisas depois da execução. E há uma consequência implícita forte: o fato de uma rotina ter pós-condição implica que ela **será concluída**. Não é uma promessa vaga de "tentar fazer", é um compromisso com o resultado.

### Invariantes de classe

A terceira peça é a invariante de classe, e é a que eu acho mais elegante. A classe assume o compromisso de manter certa condição sempre verdadeira do ponto de vista de quem a usa. Durante o processamento interno de uma rotina, a invariante pode até ser temporariamente violada; o que não se admite é que ela esteja quebrada quando o controle volta para o chamador. Em outras palavras, a invariante é o que habilita ou desqualifica um processamento antes mesmo de ele acontecer.

Um exemplo que eu gosto de usar é o CPF. Em muitas bases de código, o CPF é tratado como um campo de `string` qualquer. Só que o domínio de um CPF, assim como o de um e-mail ou de um telefone, é um subconjunto de `string`. Não faz sentido aceitar que `"Hello world"` seja um CPF. A invariante existe justamente para dizer, logo na entrada: isso não é um CPF, e a partir daqui não se segue.

### Contrato quebrado não é bug

Voltando ao ponto de partida: quando as coisas não saem como o esperado, a resposta é uma exceção. Se uma das partes não cumpriu os termos do contrato, o sistema lança uma exceção ou encerra o programa. O que importa é nunca confundir o descumprimento de um contrato com um bug.

Não cumprir um contrato é parte do Design by Contract. É comportamento previsto, mapeado e pensado antes. Um bug é outra coisa: é o comportamento alheio, não mapeado, que nunca passou pela cabeça de quem escreveu o código. Tratar os dois como a mesma coisa é o caminho mais rápido para esconder os defeitos que realmente importam atrás de falhas que já eram esperadas.

O trade-off é que contrato não vem de graça. A maior parte das linguagens comerciais não tem DbC nativo, então ele é emulado com asserções, documentação ou bibliotecas, e um contrato emulado só existe enquanto alguém tem disciplina para escrevê-lo e mantê-lo. Feito bem, vira uma fronteira explícita que elimina checagem duplicada e suposição escondida. E a asserção é justamente uma das ferramentas mais usadas para emular essa vigilância, o que já é o gancho para o próximo tópico.



## 2 - Programas Mortos Não Contam Mentiras

Este tópico é curto e, talvez por isso, um dos mais assertivos do capítulo. Ele parte de uma observação sobre a vida real com a qual é difícil não se identificar.

Você já notou que, às vezes, outras pessoas percebem que algo não vai bem com você antes mesmo de você tomar consciência do problema? Um cansaço, um jeito diferente de falar, alguma coisa que não fecha. Com o código acontece o mesmo. Não é incomum estar programando e, em algum momento, algo dar errado (uma biblioteca, uma rotina) e os erros começarem a aparecer no console.

Aqui mora a tentação. A tendência natural de quem programa é focar no que está fazendo e ignorar o que não quebra o programa por completo. O código ainda roda, o fluxo ainda segue, então o erro vira ruído de fundo. E é exatamente aí que o livro crava a regra: **nunca ignore um erro**. Todos os erros fornecem informação. O console não está tagarelando: ele está te contando que algo aconteceu.

O perigo não é o erro em si, é a história que a gente inventa para conviver com ele. Você consegue se convencer de que aquela falha não pode ocorrer, que é caso raro, que na sua máquina nunca aconteceu. O pragmático faz o oposto: parte do princípio de que, se há um erro, algo muito, muito ruim aconteceu. E se algo muito ruim aconteceu, a última coisa que se quer é seguir adiante fingindo que está tudo certo.

Daí vem a dica final, que é o coração do tópico: **encerre, não falhe**. É preferível uma abordagem que deixe o programa terminar de forma graciosa do que permitir que ele entre deliberadamente em um estado de falha. Encerrar é dizer "não dá para continuar com segurança, então eu paro aqui". Falhar, no sentido ruim, é continuar operando sobre um estado que já não é confiável, produzindo resultados plausíveis e errados. Um programa morto não mente; um programa que finge estar vivo, sim.

O trade-off é psicológico. Deixar o programa morrer parece, à primeira vista, irresponsável, principalmente para quem foi treinado a proteger o usuário de tudo. Só que proteger com uma mentira não é proteger. Via de regra, é melhor o erro aparecer enquanto ainda é pequeno, perto da causa, do que quando já contaminou metade do sistema.



## 3 - Programação Assertiva

Esta seção me traz sentimentos mistos, e quero ser honesto sobre isso desde o começo, porque acho que o incômodo faz parte da leitura.

A ideia central é simples, e é boa: os programadores têm uma tendência quase irresistível de acreditar que certas coisas nunca vão acontecer. "Esse código não vai estar rodando daqui a trinta anos, então posso usar data de dois dígitos." Foi mais ou menos esse raciocínio que nos levou ao famoso bug do milênio, quando alguém programou acreditando que o programa nunca chegaria aos anos 2000. "Esse aplicativo nunca vai ser usado no exterior, então para que internacionalizar?" "Esse valor nunca vai ser negativo." A lista de "nunca" é longa, e boa parte dessas previsões já aconteceu.

O livro responde a isso com uma proposta direta: se você acredita que algo é impossível, então verifique. Coloque uma asserção. Se a premissa é que nunca vai existir uma data de três dígitos, escreva essa premissa no código, para que, no dia em que aparecer uma data de quatro dígitos num campo que só comporta três dígitos, um erro seja disparado de forma controlada, em vez de o programa quebrar de um jeito inesperado e silencioso. A asserção transforma uma suposição escondida em uma checagem explícita, e isso é ganho de legibilidade e de diagnóstico.

Até aqui, o núcleo é difícil de contestar: **valide suas invariantes**. O problema é que a seção entra em uma discussão mais específica, sobre se o código deve ou não ter asserções, como usá-las, os custos de performance e o fato de que, em várias linguagens, elas são desligadas em produção. E é aqui que os meus sentimentos mistos aparecem.

Minha visão atual é esta: o core do capítulo continua verdadeiro, mas eu prefiro garantir a mesma coisa por outro caminho. Quando percebo que uma condição impossível aconteceu (ou que as condições adequadas do meu programa não estão completas, ou seja, que o contrato não está sendo atendido), em vez de uma asserção, eu prefiro lançar uma exceção. Se eu só aceito datas de dois dígitos e aparece uma de quatro dígitos, que uma exceção seja lançada, porque o contrato foi quebrado.

O motivo é que a asserção, na maior parte dos ecossistemas, é uma ferramenta de desenvolvimento que pode nem existir no binário final, enquanto a exceção é parte viva do comportamento do sistema. A discussão sobre asserts, nesse formato, me parece um pouco datada, não porque a ideia de validar o impossível esteja errada, mas porque muito do que o livro debatia ali já foi resolvido, ou pelo menos deslocado, pelos recursos modernos das linguagens.

O trade-off é o de sempre: a asserção é mais leve e comunica "isso aqui é uma suposição minha, não uma regra de negócio", mas some em produção e não pode carregar lógica essencial. A exceção é mais pesada e vira comportamento de verdade, mas está sempre lá para defender o programa. Eu escolho a segunda quando a quebra significa que o contrato foi violado.



## 4 - Quando Usar Exceções

Este é o tópico que eu levo mais para o dia a dia, porque é onde a maior parte dos times se perde. A regra é curta: uma exceção deve ser usada quando algo é excepcional **para aquele problema**.

O livro propõe um teste simples e engenhoso para saber se você está no caminho certo. Imagine que uma exceção não capturada encerrasse o programa e pergunte-se: esse código continuaria sendo executado se eu removesse todos os manipuladores de exceção? Se a resposta for não, é um forte sinal de que você está usando exceções em circunstâncias que não são excepcionais. O mecanismo virou parte do fluxo normal, e não uma sinalização de anomalia.

O exemplo do arquivo deixa isso concreto. Se o seu código tenta abrir um arquivo para leitura e o arquivo não existe, uma exceção deve ser lançada? A resposta do livro é: depende. Se aquele arquivo tinha que estar ali, então sim: algo inesperado aconteceu, um arquivo que você esperava encontrar parece ter desaparecido. Mas se você não sabia se o arquivo deveria existir, então não há nada de excepcional nisso; não encontrá-lo é um retorno de erro apropriado, não uma exceção. O mesmo evento, dois tratamentos opostos, e o que decide é o contexto.

### Por que essa regra existe

A explicação é técnica, e eu acho que ela é o ponto mais valioso da seção: uma exceção representa uma **transferência de controle não local e imediata**. É, na prática, um tipo de `goto` em cascata.

Pense em um sistema com um controlador, uma classe de serviço e essa classe de serviço disparando um erro. A exceção é levantada lá embaixo. Para que o erro seja tratado no controlador, o controle precisa subir em cascata por todas as camadas intermediárias. Quanto mais fundo a exceção é lançada, mais ela precisa reverberar até sair da aplicação. Construir código assim pode ser genuinamente difícil, porque o fluxo normal fica interrompido por um salto que ninguém lê de cima a baixo.

### O que mudou em quase trinta anos

O livro reconhece que os manipuladores de erro são a alternativa. E aqui vale a perspectiva histórica: quase trinta anos depois, a maior parte dos frameworks e linguagens já tem suporte para amenizar esse problema. Os erros costumam ser centralizados em um único ponto (um interceptor, um handler global, um middleware), o que faz o `goto` em cascata perder muito do seu poder de confundir o código. O que era um problema estrutural virou, em boa parte, uma questão de convenção bem aplicada.

### Minha visão

Aqui eu tenho uma opinião um pouco mais arrojada do que a do capítulo. Eu acredito que exceções devam ser usadas de forma altamente específica: uma invariante foi violada, então uma exceção deve ser levantada. É assim que eu penso.

A implementação, porém, é outra conversa. Se isso vai ser feito com a palavra-chave `exception`, propagando um objeto de erro ou usando um Result Pattern, como já escrevi [aqui no blog](/2026/05/03/result-pattern-versus-exceptions/), a escolha deve ser decidida pela perspectiva das linguagens e dos frameworks em questão. Via de regra, eu não acho ruim o uso de exceções, desde que elas não gerem muita indireção naquele `goto` em cascata.

Do ponto de vista filosófico, lance exceções e rejeite as coisas com voracidade: o contrato foi quebrado, o programa não pode seguir fingindo. Mas a implementação deve estar alinhada aos maiores ganhos de projeto.



## 5 - Como Balancear Recursos

Este é o tópico que, na minha opinião, mais envelheceu no capítulo inteiro. Mas envelhecer não é o mesmo que perder a validade, e aqui as lições continuam valendo.

A ideia de base é a de que todo programador lida, o tempo todo, com recursos: memória, transações, arquivos, timers, conexões, todo tipo de coisa. E todos eles têm disponibilidade limitada, porque no fim das contas tudo roda sobre RAM e processamento, que também são finitos. O uso de um recurso quase sempre segue o mesmo padrão: você aloca, usa e desaloca. O contrato é assimétrico, e o problema aparece quando a segunda metade dele não acontece.

O ponto em que o capítulo ficou datado está nas linguagens que ele usa como exemplo: todas com gestão de memória ativa, em que você aloca e libera na mão. Na minha experiência com Java, JavaScript e Python, isso praticamente desapareceu, porque todas têm garbage collector e a gente deixou de se preocupar com isso de forma explícita. É um custo que saiu do radar, provavelmente porque, nas últimas décadas, a capacidade de RAM e de processamento cresceu a ponto de tornar essa preocupação, para a maioria dos casos, um detalhe.

Mas o princípio sobrevive à linguagem. Via de regra, uma vez que você usa algo, livre-se dele quando não precisar mais, de preferência na ordem inversa àquela em que você precisou. Esse "na ordem inversa" não é capricho: é o que mantém as coisas congruentes quando um recurso depende de outro. E o princípio não vale só para memória. Vale para arquivo aberto, transação aberta, lock obtido, conexão de banco. São recursos que o garbage collector não resolve necessariamente por você, e é aí que a lição antiga continua atual.

O trade-off é aquele de sempre: organizar o ciclo de vida do recurso custa estrutura agora e evita um rastro de bugs depois. Recurso pendurado não grita, ele se acumula; quando o sistema tomba, a causa já está longe há muito tempo.

E talvez a lição principal seja a mais simples de todas, e vale principalmente para quem só conheceu linguagens com GC: se você está lendo isso agora e nunca precisou usar `malloc` na sua vida, saiba que essas coisas existem. Nada é de graça. Ser responsável com os recursos que a sua aplicação usa, mesmo os que a linguagem parece gerenciar sozinha, é o que evita as grandes dores de cabeça.


## O Que Fica

Paranoia pragmática é um nome bem escolhido porque junta duas coisas que parecem opostas. Paranoia sozinha vira medo paralisante, que espalha checagem defensiva para todo lado e esconde os erros em vez de resolvê-los. Pragmática sozinha vira confiança no caminho feliz e otimismo com o que vai dar errado. O capítulo inteiro é sobre não cair em nenhum dos dois.

O contrato diz o que cada lado promete. A falha rápida prefere a morte honesta ao estado mentiroso. A asserção vigia o que nunca deveria acontecer, sem se confundir com tratamento de erro. A exceção fica reservada ao que é de fato excepcional, lançada cedo e capturada tarde. E o recurso entra e sai pela mesma porta. Em todos os casos, a postura é a mesma: traçar limites claros e respeitá-los, porque a maior parte dos defeitos de software nasce justamente de uma fronteira que nunca foi definida.

No próximo post eu encaro o Capítulo 5, **Curve-se ou Quebre**, onde o livro trata de acoplamento, reversibilidade, metaprogramação e das decisões que deixam o software flexível sem virar um labirinto.
