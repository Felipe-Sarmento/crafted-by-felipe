---
title: "Result Pattern versus Exceptions"
description: "Quando uma exceção é realmente excepcional — e quando é só um if/else disfarçado?"
pubDate: 2026-05-03
tags: [typescript, patterns, arquitetura, opiniao]
---

Recentemente eu testei um pattern que já conhecia ouvi falar há muito tempo atrás: o Result Pattern. A ideia é simples: nós sabemos que no nosso código as coisas podem dar errado. E via de regra, quando dão errado, uma exceção é levantada.

## Exceptions: O Padrão

Veja o exemplo clássico. Em qualquer linguagem, dividir por zero levanta uma exceção:

```python
result = 10 / 0  # ZeroDivisionError
```

Isso é ótimo. A linguagem nos protege de uma operação ilegal e indica no output que algo deu errado. Então, não é difícil pensar que no paradigma orientado a objetos nós estendemos as exceções básicas e criamos as nossas próprias. Por exemplo:

```typescript
class ProductNotAvailableError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class OrderService {
  purchase(productId: string, quantity: number): void {
    const stock = this.getStock(productId);
    if (stock.count <= 0) {
      throw new ProductNotAvailableError("Product is not available");
    }
    // prossegue com a compra...
  }
}
```

Se a quantidade de produtos no estoque é menor ou igual a zero, eu preciso levantar uma exceção e interromper o fluxo.  Direto ao ponto.

## O Costume no OOP

Não é incomum, principalmente com Clean Architecture, ter diferentes exceptions para diferentes camadas. Exceptions de infra, de domínio, de application e uma lógica de tradução entre elas. Mediante cada exceção, você trata e cria comportamentos adequados.

No NestJS, por exemplo, nós temos uma forma muito interessante de centralizar isso: interceptors.

```typescript
class InternalError extends Error {
  constructor(message: string) {
    super(message);
  }
}

class ProductNotAvailableError extends InternalError {
  constructor() {
    super("Product is not available");
  }
}
```

E o interceptor que captura todas as exceções que estendem de `InternalError`:

```typescript
@Catch(InternalError)
export class InternalErrorFilter implements ExceptionFilter {
  catch(exception: InternalError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    response.status(500).json({
      message: exception.message,
    });
  }
}
```

O interceptor tem um único método `catch` e uma annotation `@Catch` que diz qual tipo de erro queremos capturar. Se as minhas exceções customizadas estendem de `InternalError`, todas serão coletadas ali. Centralização. Ótimo.

## O Sintoma

Bom, e o que nós vemos nessa abordagem?

1. Um local central para tratar erros de um determinado tipo
2. Separação e reutilização da lógica de tratamento
3. Isolamento completo do comportamento indesejado do código padrão

O `OrderService` não precisa se preocupar com o que acontece quando dá erro. O importante é dar erro, assim a operação é interrompida e outra camada resolve.

Mas agora vem a pergunta: **será que isso é bom?**

Será que faz sentido separar em locais diferentes como um erro é tratado de onde ele é lançado? Será que as nossas próprias exceptions não geram mais problemas cognitivos do que soluções? Será que quando estamos utilizando uma exceção, nós realmente queremos uma exceção a nível de sistema computacional, ou só queremos um if/else?

If deu certo, faça isso. Else, faça aquilo.

## O Result Pattern

Pois bem, é exatamente isso que o Result Pattern se propõe a fazer. A única diferença: em vez de dar um `throw`, nós retornamos um erro.

Primeiro, o tipo:

```typescript
type Result<T, E = string | Record<string, unknown>> =
  | { ok: true; data: T }
  | { ok: false; error: E };
```

E a implementação:

```typescript
class OrderService {
  purchase(productId: string, quantity: number): Result<Order> {
    const stock = this.getStock(productId);

    if (stock.count <= 0) {
      return { ok: false, error: "Product is not available" };
    }

    const order = this.createOrder(productId, quantity);
    return { ok: true, data: order };
  }
}
```

E o código cliente lida com isso localmente:

```typescript
const result = orderService.purchase(productId, quantity);

if (!result.ok) {
  return response.status(400).json({ message: result.error });
}

return response.status(201).json(result.data);
```

Sem indireção. Sem arquivo desconexo tratando o erro. Um if/else honesto.

## O Trade-off

Então sim, nós perdemos a indireção. O erro não vai mais para um interceptor em outro arquivo. Mas essa lógica de negócio ainda existe, e para onde ela vai? Para junto do código cliente.

É uma troca. Eu deixei de ter uma indireção global e consequentemente o código era menor. Agora eu tenho um código maior localmente, mas as coisas estão mais juntas. Mais coesas.

## Opinião honesta

Bom, na minha opinião, eu ainda não estou satisfeito quanto ao resultado. Testei e gostei, mas fico pensando em como isso escala em métodos de agregação ou orquestração.

Imagina um `preparePackage` que tem várias validações:

```typescript
class ShippingService {
  preparePackage(orderId: string): Result<Package> {
    const stockResult = this.checkStock(orderId);
    if (!stockResult.ok) return stockResult;

    const addressResult = this.validateAddress(orderId);
    if (!addressResult.ok) return addressResult;

    const distanceResult = this.checkDistance(orderId);
    if (!distanceResult.ok) return distanceResult;

    // continua...
  }
}
```

Fico preocupado com o quão verboso isso fica. E principalmente: quando `ok` é `false`, o que fazemos? Retornamos uma classe genérica como response? Aí eu perco a capacidade de ter responses fixos e tipados. Porque hoje, com exceptions fazendo o papel de desvio, o retorno do método é sempre o caso feliz. Agora sem exceptions, o tipo de retorno precisa contemplar todas as variantes, positivas e negativas.

## Minha Posição Atual

O que me parece mais sensato, no momento, é analisar muito bem o problema e decidir o que faz sentido. Via de regra, acredito que se eu fosse usar o Result Pattern, certamente também utilizaria Exceptions em alguma medida.

Result Pattern do nível 2 para baixo, nos services e nos orquestradores internos. Ali eu quero controle local e visibilidade. Se uma operação dá errado, eu sei exatamente onde, o por quê e o que é retornado.

E no nível mais alto, do controller para o interceptor, se fizer sentido, exceptions. Por quê? Porque agora a indireção, apesar de existir, é muito menor. Vai apenas de um service para um interceptor. Diferentemente do cenário em que eu tenho 10 níveis de sub-classes e não tenho como saber qual nível deu o throw.

Essa é a minha visão no momento. Use o Result Pattern onde a localidade importa. Use exceptions onde a indireção é curta e controlada. Não é uma resposta definitiva, é analisar o trade-off e defender as necessidades atuais do código e do projeto.
