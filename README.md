# craftedbyfelipe

Blog pessoal sobre desenvolvimento web, tecnologia e carreira.

**Site:** [craftedbyfelipe.com](https://craftedbyfelipe.com)

## Stack

- [Astro 6](https://astro.build) — framework estático
- [Tailwind CSS 4](https://tailwindcss.com) — estilização
- [MDX](https://mdxjs.com) — posts em Markdown com componentes
- [pnpm](https://pnpm.io) — gerenciador de pacotes

## Estrutura do projeto

```
├── public/              # Assets estáticos (fontes, favicon, imagens)
├── src/
│   ├── components/      # Componentes Astro reutilizáveis
│   ├── content/blog/    # Posts em Markdown/MDX
│   ├── layouts/         # Layouts de página
│   ├── pages/           # Rotas (file-based routing)
│   ├── styles/          # CSS global
│   ├── utils/           # Utilitários TypeScript
│   └── consts.ts        # Constantes globais (título, descrição, autor)
├── astro.config.mjs
└── package.json
```

## Desenvolvimento local

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

| Comando        | Ação                                        |
| :------------- | :------------------------------------------ |
| `pnpm dev`     | Inicia servidor de desenvolvimento          |
| `pnpm build`   | Gera build de produção em `./dist/`         |
| `pnpm preview` | Pré-visualiza o build localmente            |

## Criando um post

Crie um arquivo em `src/content/blog/` seguindo o padrão de nome `YYYY-MM-DD-slug.md`:

```markdown
---
title: 'Título do post'
description: 'Descrição breve'
pubDate: 'YYYY-MM-DD'
tags: ['tag1', 'tag2']
---

Conteúdo aqui...
```

O post ficará disponível em `/YYYY/MM/DD/slug/`.

## Imagens

Coloque imagens em `public/` e referencie como `/nome-da-imagem.jpg` nos posts.

## Deploy na Vercel

O deploy é feito automaticamente via integração com o GitHub:

- Push para `main` → deploy em produção em [craftedbyfelipe.com](https://craftedbyfelipe.com)

### Configuração inicial (feita uma vez)

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub
2. Clique em **Add New Project** e selecione o repositório `craftedbyfelipe`
3. A Vercel detecta Astro automaticamente — as configurações padrão já funcionam:
   - **Framework:** Astro
   - **Build Command:** `pnpm build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install`
4. Clique em **Deploy**

A partir daí, qualquer push para `main` dispara um novo deploy automaticamente.
