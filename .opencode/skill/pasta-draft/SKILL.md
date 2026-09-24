---
name: pasta-draft
description: Use quando o autor mencionar a pasta "draft", "rascunhos" ou ideias ainda não publicadas no blog, ou ao procurar material de origem para um post. Documenta que a pasta draft/ na raiz guarda rascunhos crus em Markdown, fora do Astro, que não aparecem no site nem no build.
---

# Pasta draft/

A pasta `draft/`, na raiz do projeto, é a **área de rascunho cru** do blog:
ideias e artigos que ainda não viraram post. São arquivos Markdown soltos, sem
frontmatter, escritos fora do Astro.

## O que isso significa

- Nada dentro de `draft/` entra no build nem aparece no site.
- É material de trabalho, não conteúdo publicado.
- O agente deve saber que ela existe e **procurar ali** quando precisar do
  material de origem de um post.

## Os três estágios de um texto

| Estágio | Onde | O que é |
|---------|------|---------|
| Rascunho cru | `draft/*.md` | Ideia estruturada, sem frontmatter, estrutura livre |
| Planejado | `src/pages/soon.astro` (array `planned`) | Lista pública do que se pretende escrever |
| Publicado | `src/content/blog/*.md` | Post com frontmatter, entra no site e no build |

Um texto caminha nessa ordem: nasce em `draft/`, pode ser listado em `/soon` e,
quando fica pronto, vira arquivo em `src/content/blog/`.

## Convenções dos rascunhos

- Nome do arquivo no padrão `{n} - {tema}.md` (ex.: `1 - scrum.md`).
- Estrutura recorrente em PT-BR:
  - `Post N — {título provisório}` na primeira linha
  - bloco `Título` (às vezes com alternativas)
  - `Punchline`
  - `Tese`
  - `Estrutura do artigo` (seções numeradas)
  - `Ideia central (uma frase)`
  - `Frase de encerramento`
- Pode conter extras: ajustes conceituais, sugestões de narrativa e links
  externos (ex.: Excalidraw).

## Fluxo ao transformar um rascunho em post

1. Ler o rascunho em `draft/` antes de escrever.
2. Gerar o post em `src/content/blog/YYYY-MM-DD-{slug}.md`, com frontmatter
   conforme `src/content.config.ts`.
3. Decidir **com o autor** se o rascunho deve ser removido de `draft/` (não
   remover por conta própria).

## Regras

- **Nunca** publicar, mover, renomear ou editar rascunhos sem pedido explícito
  do autor.
- Ao buscar material de origem para um post, checar `draft/` primeiro.
- Toda escrita em PT-BR.

## Fora de escopo

Esta skill cobre apenas a **pasta** `draft/`. O campo `draft: true` do
frontmatter dos posts em `src/content/blog/` é outro mecanismo e não é
documentado aqui.
