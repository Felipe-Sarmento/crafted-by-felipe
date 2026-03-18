---
title: "Construindo um Blog com Astro 6 e Tailwind"
pubDate: 2026-03-18
description: "Um guia completo para criar um blog moderno com Astro 6, Tailwind CSS v4, dark mode e table of contents."
tags: [astro, tailwind, web, javascript]
---

Bem-vindo ao meu blog! Neste post vou mostrar como montar um blog moderno do zero usando **Astro 6** e **Tailwind CSS v4**, com dark mode e table of contents automático.

## Por que Astro?

Astro é um framework focado em performance. Ele gera HTML estático por padrão e só envia JavaScript quando necessário — o famoso **"Zero JS by default"**.

Algumas vantagens que me convenceram:

- Build super rápido (Vite por baixo)
- Suporte nativo a Markdown e MDX
- Content Collections com type-safety
- Integração fácil com Tailwind, React, Vue, etc.

### Comparando com Next.js

Next.js é ótimo para apps dinâmicos, mas para um blog ele manda JavaScript demais para o cliente. Astro entrega páginas quase 100% estáticas, o que resulta em um **Lighthouse score** muito maior.

### Comparando com Hugo

Hugo é rápido, mas usar Go templates é doloroso. Astro permite componentes `.astro` que se parecem com JSX — muito mais familiar para devs JavaScript.

## Configurando o Tailwind v4

O Tailwind v4 mudou bastante em relação ao v3. A maior diferença é que **não existe mais o `tailwind.config.js`** — tudo é feito via CSS.

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Dark mode baseado em classe */
@custom-variant dark (&:where(.dark, .dark *));
```

### Dark Mode com localStorage

Para persistir a preferência do usuário, salvamos no `localStorage`:

```js
const stored = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (stored === 'dark' || (!stored && prefersDark)) {
  document.documentElement.classList.add('dark');
}
```

### Configurando o plugin Typography

O plugin `@tailwindcss/typography` estiliza automaticamente o conteúdo Markdown usando a classe `prose`:

```html
<div class="prose dark:prose-invert max-w-none">
  <!-- conteúdo do post aqui -->
</div>
```

## Content Collections no Astro 6

O Astro 6 trouxe uma nova API para Content Collections usando o **glob loader**:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.optional(image()),
  }),
});
```

### Diferença para o Astro 4/5

Na versão antiga, as entradas tinham `slug`. No Astro 6+ com glob loader, usamos `id` em vez de `slug`.

```ts
// Antes (Astro 4)
params: { slug: post.slug }

// Agora (Astro 6)
params: { slug: post.id }
```

## Table of Contents Automático

O `render()` do Astro retorna o array de `headings` junto com o `Content`:

```ts
const { Content, headings } = await render(post);
// headings: { depth: 2, slug: 'por-que-astro', text: 'Por que Astro?' }[]
```

Passamos os headings para o layout e renderizamos uma sidebar sticky com links âncora.

### Highlight da Seção Ativa

Usamos `IntersectionObserver` para detectar qual seção está visível e destacar o link correspondente no TOC:

```js
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      // remove active de todos, adiciona no atual
    }
  }
}, { rootMargin: '0px 0px -60% 0px' });
```

## Conclusão

Astro 6 + Tailwind v4 é uma combinação excelente para blogs. Performance máxima, DX moderna e zero configuração desnecessária.

Se tiver dúvidas, me manda uma mensagem!
