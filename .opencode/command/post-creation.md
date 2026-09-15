---
description: Cria um post do blog a partir de conteúdo bruto
agent: build
---

Quando o usuário invoca `/post-creation`, ele fornece o conteúdo bruto de um post como `$ARGUMENTS`. Sua tarefa é interpretar esse conteúdo e criar um arquivo de post do blog Astro devidamente formatado.

## Input

O conteúdo do post é: $ARGUMENTS

## Steps

### 1. Interpretar o conteúdo

Extraia ou infira o seguinte:

- **title:** Use o primeiro `# Heading` se presente; caso contrário, infira um título conciso (máx. ~60 chars) a partir do tópico principal
- **description:** Escreva um resumo de 1–2 frases do ponto principal do post (máx. ~160 chars). Não copie o título literalmente.
- **tags:** Identifique 2–5 palavras-chave de tópico relevantes (ex.: `astro`, `javascript`, `web`, `tailwind`). Minúsculas, sem espaços.

### 2. Gerar o slug

A partir do título:
- Tudo em minúsculas
- Espaços por hífens
- Remover acentos/diacríticos (ex.: `ã → a`, `é → e`, `ç → c`)
- Remover caracteres especiais (manter apenas `a-z`, `0-9`, `-`)
- Exemplo: "Construindo um Blog" → `construindo-um-blog`

### 3. Obter a data de hoje

Use a data de hoje no formato `YYYY-MM-DD`.

### 4. Criar o arquivo

**Path:** `src/content/blog/YYYY-MM-DD-{slug}.md` (relativo à raiz do projeto)

**Conteúdo do arquivo:**

```
---
title: "{title}"
description: "{description}"
pubDate: YYYY-MM-DD
tags: [{tag1}, {tag2}, ...]
---

{conteúdo original do post, limpo}
```

Regras para o corpo do conteúdo:
- Se o conteúdo já começa com um heading `# Título` que corresponde ao título do frontmatter, mantenha-o. Caso contrário, não adicione heading duplicado.
- Preserve toda a formatação markdown (headings, listas, code blocks, etc.)
- Não adicione texto extra ou comentários — escreva exatamente o conteúdo do post.

### 5. Confirmar ao usuário

Após criar o arquivo, informe ao usuário:
- O caminho completo do arquivo criado
- A URL em que o post ficará acessível (formato: `/{year}/{month}/{day}/{slug}/`)
- Que o post já está disponível na home

## Schema Reference

O frontmatter deve satisfazer este schema Zod (de `src/content.config.ts`):

```ts
z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  heroImage: z.optional(image()),
  tags: z.array(z.string()).optional(),
})
```

Não adicione `heroImage` nem `updatedDate` a menos que o usuário os forneça explicitamente.
