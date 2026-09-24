---
name: review-livro
description: Use quando for iniciar ou continuar um post de resenha/leitura de livro em série no blog (ex.: "review do livro", "capítulo N", "saga do Programador Pragmático"). NUNCA escreva o post inteiro por conta própria; gere o scaffold com seções em branco marcadas com << ESCRITO POR IA >> e preencha os tópicos um a um conforme o autor enviar.
---

# Review de Livro (série)

Fluxo de escrita dos posts da série de releitura de livros do blog. Cada post
corresponde a um capítulo de um livro e é escrito de forma **incremental**, com
o autor no controle.

## Regra de ouro

**NUNCA escreva o post inteiro por conta própria.** Ao iniciar um novo post da
série, crie apenas o *scaffold*: frontmatter preenchido e os headings dos
tópicos com o corpo em branco. O autor envia os tópicos **um a um** e só então
a seção correspondente é escrita.

## Passo 1 — Scaffold

Quando o autor disser que vai começar um novo post/capítulo da série (ou pedir
para "começar o capítulo N"):

1. Descubra o número do capítulo e o título na fonte do livro (a lista de
   tópicos costuma vir do próprio autor).
2. Monte o caminho no padrão dos posts anteriores:
   `src/content/blog/YYYY-MM-DD-o-programador-pragmatico-cap-N-{slug}.md`
3. Frontmatter conforme `src/content.config.ts`:
   ```yaml
   ---
   title: "O Programador Pragmático, Capítulo N: {Título}"
   description: "{Resumo curto, ~150 chars, citando os tópicos do capítulo}"
   pubDate: YYYY-MM-DD
   tags: [livros, programador-pragmatico, engenharia-de-software, {tema}]
   ---
   ```
4. Corpo com **um heading de nível 2 por tópico**, cada um seguido de exatamente
   `<< ESCRITO POR IA >>` como corpo:
   ```markdown
   ## O Capítulo em Essência
   << ESCRITO POR IA >>

   ## 1 - {Tópico}
   << ESCRITO POR IA >>
   ```
   Inclua `## O Capítulo em Essência` no topo e `## O Que Fica` no fim.
5. Pare e aguarde. Não escreva nenhuma seção ainda.

## Passo 2 — Escrever um tópico

Quando o autor enviar o conteúdo/instrução de um tópico:

1. Escreva **somente** a seção daquele tópico.
2. Substitua o `<< ESCRITO POR IA >>` pelo texto e **remova o marker** daquela
   seção.
3. Não toque nas outras seções nem no frontmatter.
4. Se o autor enviar o tópico sem contexto, escreva a partir do livro/assunto,
   mas mantenha a voz da série.

## Passo 3 — Fechamento

Só escreva `## O Que Fica` quando os tópicos anteriores estiverem escritos ou
quando o autor pedir. Ele sintetiza o capítulo e termina com um teaser do
próximo capítulo.

## Voz e estilo da série

- **Português do Brasil (PT-BR)**, sempre.
- Primeira pessoa, tom de quem releu e refletiu — não é resumo neutro.
- Enquadramento de **trade-off**: todo tópico tem ganho e custo, e o autor
  nomeia os dois.
- Frases-chave em negrito; identificadores e exemplos em `code`.
- Exemplos de código enxutos quando ajudarem (sem comentários no código).
- Referências à experiência real e à senioridade do autor quando couber.
- Fechar com `## O Que Fica` + teaser do próximo capítulo no formato dos posts
  anteriores: "No próximo post eu encaro o Capítulo N, **{Título}**...".

## Referências

- Posts anteriores da saga em `src/content/blog/2026-09-1*-o-programador-pragmatico-*`.
- Schema: `src/content.config.ts`.
- Convenções do repositório: `AGENTS.md`.

## Verificação

Ao terminar um post da série, rodar `pnpm build` para garantir que o Markdown
compila e o post aparece nas rotas geradas.
