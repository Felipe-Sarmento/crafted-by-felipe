---
title: "O porquê de eu ter criado um blog e como eu o fiz"
description: "A jornada de quatro anos até criar um blog: do perfeccionismo técnico até a simplicidade razoável"
pubDate: 2026-03-19
tags: [astro, blog, arquitetura, web]
---

## Início

Em 2011, eu criei meu primeiro blog. Era dedicado a um MMORPG famoso na época: o <a href="https://www.aq.com/">AQW</a>.

Na época, eu gostava muito do processo de escrever. Era como se eu elevasse o meu conhecimento para um nível superior, simplesmente pelo cuidado com as palavras e o conteúdo sob o pretexto de que alguém iria ler.

Pensando nisso, 10 anos após essa saga, eu queria fortemente criar um novo blog. Dessa vez para a tecnologia, como uma espécie de mental dump. Um local onde eu poderia registrar meus pensamentos e experiências técnicas. Talvez ajudar alguém. Com certeza, me ajudar no futuro.

O problema é que essa ideia nunca saía do papel.

Quase sempre, ela era derrotada por um senso de perfeccionismo. Eu pensava: "Eu não quero só escrever, eu quero criar o meu próprio blog. Literalmente".

E dessa forma, eu era derrotado pela resistência. Afinal de contas, como diabos eu vou subir o meu próprio blog?

Bom, passaram-se anos e muita coisa mudou: adquiri experiência, criei um senso de qualidade agarrado na realidade, o famoso: "good enough" e, principalmente, me veio o grande ímpeto de retornar com essa empreitada. Em grande parte, por duas grandes referências que eu tenho: Lucas Paiva (<a href="https://aquinaotemquenada.substack.com/">Aqui não tem que nada</a>), com sua curiosa e genial visão sobre diversos temas da vida contemporânea (e grande amigo), e Fábio Akita (<a href="https://akitaonrails.com/">Akita On Rails</a>), sendo um dos meus grandes mentores na vida na tecnologia.

Com toda certeza, irei discorrer sobre esses homens em posts futuros.

Pois bem, agora respondendo à grande pergunta: como eu criei esse blog?

## Primeira intuição

De começo pensei: se eu vou ter um blog, eu vou precisar armazenar isso em algum lugar. Logo, precisei de um banco de dados. Ok, até aí tranquilo, eu sei mexer com bancos de dados. Mas, se eu vou ter um banco de dados, eu preciso de um backend para interagir com ele e também precisarei de um front-end para exibir os dados para o usuário final e para mim, que irei escrever os posts.

O que acabei de explicar é um padrão bem conhecido: a 3 Tier Architecture.

E sim, ela resolve tranquilamente o problema do blog. O real problema está em: como diabos eu vou subir isso para a web?

Eu vou ter que contratar um VPS ou ir provisionar um banco na AWS? Como vou rodar meu backend? Que linguagem irei usar?

E, nesse momento, essa foi a conclusão a que cheguei: "É, talvez fazer um blog não seja tão simples assim".

## Simplificando

Anos depois, a ideia me voltou à mente. Mas dessa vez, pensei em outra abordagem: "E se eu eliminasse o meu front-end?" Ou melhor, e se não tivesse um front-end dedicado?

Eu sempre havia trabalhado com o padrão SPA, no qual utilizamos o client-side para renderizar os componentes em tela. Mas, na prática, um blog não tem componentes tão complexos assim. Eu posso remover toda essa complexidade e utilizar o bom e velho padrão 
<a href='https://medium.com/@gabrielequevedo/model-view-controller-mvc-316fbc169a5'>MVC</a>.

Para fins de contextualização:

* Model: Representa a lógica de negócios e a manipulação dos dados. O Model interage com o banco de dados e fornece os dados para a View.
* View: É a camada responsável pela apresentação visual dos dados ao usuário. A View exibe as informações de forma interativa e dinâmica.
* Controller: Atua como intermediário entre o Model e a View. Ele processa as entradas do usuário, interage com o Model para obter dados e atualiza a View conforme necessário.

Dessa forma, eu consegui reduzir a complexidade do meu problema ao eliminar um artefato inteiro! Ufa, progresso!

Agora o blog vem... certo?

Errado.

### Custo

Apesar de ter feito progresso, o front-end é a parte mais barata dessa equação. Afinal, fornecer arquivos estáticos não custa nada do ponto de vista de computação (apenas armazenamento). Mas manter um servidor de pé e conectado a um banco ainda implica que eu teria um custo pelo tempo que as máquinas ficassem ligadas, o que inviabilizaria totalmente essa empreitada. Afinal, por que não só usar uma solução gratuita e call it a day?

## Ferramenta certa para o problema certo

Já deve ter ficado evidente que esse projeto é balizado principalmente por dois fatores: pouco (ou nenhum) custo e uma boa experiência.

Pensando nisso, há uma semana me deparei com uma solução interessante.

Antes de chegar à conclusão técnica, existe um princípio central no que tange à engenharia de software.

> Não existe bala de prata.  
> Tudo é sobre o trade-off que você está disposto a fazer.

A solução veio quando pensei no que eu estava disposto a abrir mão.

E nessa linha pensei: por que eu preciso de um banco de dados? Por que não simplesmente guardar os arquivos em pastas como um homem das cavernas?

Bingo! Essa é a ideia.

Eu não preciso de um banco. Preciso de arquivos. E, se eu não preciso de um banco, naturalmente não preciso de um servidor complexo.

## Astro

E aí chegamos ao nosso campeão: <a href='https://astro.build/'>Astro</a>.

O Astro é um framework criado para sites content-driven (como um blog). Ele tem como sua principal missão melhorar a performance da aplicação enquanto fornece o HTML padrão.

E, com isso, o blog estava finalizado.

Um simples projeto no Astro, no qual escrevo em markdown e ele mesmo, ao fazer o build, já gera todo o HTML para mim. Era o que eu precisava.

E, de quebra, o deploy dele é de apenas um clique na <a href="https://vercel.com/docs/frameworks/frontend/astro">Vercel</a> (que também é gratuito).

Para não dizer que houve custo, precisei comprar o domínio, mas essa era uma constante em qualquer blog/app que eu decidisse fazer.

## Finalização

O intuito desse post, além de discutir sobre a mentalidade e decisão técnica em volta do blog, é também abordar grandes temas importantes na vida de um engenheiro de software:

1. Quando algo já está bom o suficiente?
2. Como evitar otimizar as coisas prematuramente?
3. O que eu estou disposto a abrir mão para o sucesso do meu projeto nesse momento?

No fim, eu gostaria de ter começado esse projeto antes, de ter tido esses insights antes. Mas tudo no seu tempo e de acordo com o que está possível à mão.

Que o blog seja um grande potencializador disso.

Caso alguém se interesse em verificar o código, ele está disponível no repositório público a seguir: <a href='https://github.com/Felipe-Sarmento/crafted-by-felipe'>Crafted By Felipe</a>.
