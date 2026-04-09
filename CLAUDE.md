# Available Skills

### `/soon-manage`
**Use when:** Adicionando ou removendo posts planejados na página `/soon`.

Defines:
- `add "título" "descrição"` — Adiciona um novo item à lista de posts planejados
- `remove "título"` — Remove um item existente pela correspondência do título
- Operações diretas no array `planned` do arquivo `src/pages/soon.astro`

**Invoke:** `/soon-manage add "Título do Post" "Descrição"` ou `/soon-manage remove "Título do Post"`

---

### `/post-creation`
**Use when:** Criando um novo post no blog a partir de conteúdo bruto.

Defines:
- Parse de conteúdo passado como `$ARGUMENTS`
- Criação do arquivo em `src/content/blog/YYYY-MM-DD-{slug}.md`
- Inferência de metadados (title, description, pubDate, tags) e geração do slug
- Confirmação do caminho e URL após criação

**Invoke:** `/post-creation <conteúdo do post>`

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
