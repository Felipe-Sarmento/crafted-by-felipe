# Available Commands

### `/soon-manage`
**Use when:** Adicionando ou removendo posts planejados na página `/soon`.

Defines:
- `add "título" "descrição"` — Adiciona um novo item à lista de posts planejados
- `remove "título"` — Remove um item existente pela correspondência do título
- Operações diretas no array `planned` do arquivo `src/pages/soon.astro`

**Invoke:** `/soon-manage add "Título do Post" "Descrição"` ou `/soon-manage remove "Título do Post"`

Definido em `.opencode/command/soon-manage.md`.

---

### `/post-creation`
**Use when:** Criando um novo post no blog a partir de conteúdo bruto.

Defines:
- Parse de conteúdo passado como `$ARGUMENTS`
- Criação do arquivo em `src/content/blog/YYYY-MM-DD-{slug}.md`
- Inferência de metadados (title, description, pubDate, tags) e geração do slug
- Confirmação do caminho e URL após criação

**Invoke:** `/post-creation <conteúdo do post>`

Definido em `.opencode/command/post-creation.md`.

---

### `/corrigir`
**Use when:** Revisando ortografia e gramática de um texto ou post.

Defines:
- Interpreta `$ARGUMENTS` como caminho de arquivo (lido antes de analisar), texto colado ou vazio (alvo inferido pelo contexto)
- Delega ao agente **Corrector**, que roda em modo plano (read-only, `edit: deny`)
- Apresenta plano de correções (tabela `Local | Original | Corrigido | Motivo`) sem aplicar nada
- A aplicação é feita depois pelo agente `build` (Tab)

**Invoke:** `/corrigir src/content/blog/YYYY-MM-DD-{slug}.md` ou `/corrigir <texto>`

Definido em `.opencode/command/corrigir.md`. Agente em `.opencode/agent/corrector.md`.

---

# Agents

### `corrector`
**Use when:** Corrigir grafia (ortografia, acentuação, pontuação, concordância, regência, crase).

- `mode: primary` — selecionável via Tab
- Somente-leitura: `edit: deny` e `bash: deny`; usa apenas `read`, `glob`, `grep`
- `temperature: 0.1` para correções determinísticas
- Herda o modelo padrão da config global

Definido em `.opencode/agent/corrector.md`.

---

# Skills

### `review-livro`
**Use when:** Iniciando ou continuando um post de resenha/leitura de livro em série (ex.: saga do Programador Pragmático, "capítulo N").

Defines:
- **Nunca** escrever o post inteiro por conta própria
- Gera o *scaffold*: frontmatter + um heading por tópico com o corpo em branco marcado com `<< ESCRITO POR IA >>`
- Preenche os tópicos **um a um**, conforme o autor enviar, removendo o marker da seção escrita
- Mantém a voz da série (PT-BR, trade-offs, `## O Que Fica` + teaser do próximo capítulo)
- Verificação final com `pnpm build`

Definida em `.opencode/skill/review-livro/SKILL.md`.

---

### `pasta-draft`
**Use when:** O autor mencionar a pasta "draft", "rascunhos" ou ideias ainda não publicadas, ou ao procurar material de origem para um post.

Defines:
- `draft/` na raiz guarda rascunhos crus em Markdown, **fora** de `src/content/blog`; não entram no build nem no site
- Três estágios: `draft/*.md` → `/soon` (`src/pages/soon.astro`) → `src/content/blog/*.md`
- Convenção de nome `{n} - {tema}.md` e estrutura recorrente (punchline, tese, estrutura, ideia central, frase de encerramento)
- **Nunca** publicar, mover ou editar rascunhos sem pedido explícito
- Ao buscar material de origem, checar `draft/` primeiro

Definida em `.opencode/skill/pasta-draft/SKILL.md`.

---

# Git Workflow Rules

## Protected Branches

Direct pushes to `main` and `develop` are **forbidden**. All changes must come via pull requests.

- `main` — Production (stable releases only)
- `develop` — Staging/Homologation (integration branch)

## Branch Naming

| Type | Pattern | Origin | Merge into |
|------|---------|--------|------------|
| Feature | `feat/**` | develop | develop |
| Bug fix | `fix/**` | develop | develop |
| Maintenance | `chore/**` | develop | develop |
| Hotfix | `hotfix/**` | main | main → develop |

## Commit Format (Conventional Commits)

```
[type]([scope]): [imperative message]
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`

- Message under 50 chars, imperative mood, lowercase
- One logical change per commit (atomic)
- No unrelated files mixed in a single commit
- No merge commits in feature branches (rebase instead)

## Pull Request Workflow

1. Branch from `develop` (or `main` for hotfixes)
2. Make atomic commits following Conventional Commits
3. Keep branch in sync via `git rebase origin/develop`
4. Push and open PR
5. PR title must follow commit format: `type(scope): description`
6. Merge via squash or `--ff-only` rebase

## Forbidden Actions

- `git push origin main` or `git push origin develop` (direct push)
- `git push -f origin main` or `git push -f origin develop` (force push)
- Non-atomic commits mixing multiple unrelated changes
- Rewriting history on shared branches

## Hotfix Process

```bash
git checkout -b hotfix/issue-name origin/main
# fix and commit atomically
git push origin hotfix/issue-name
# PR → main, then sync develop from main
```
