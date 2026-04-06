# Soon Manage Skill

**When to use:** Quando o usuário quer adicionar ou remover um item da lista de posts planejados em `/soon`.

## Rules

1. O arquivo a editar é sempre `src/pages/soon.astro` (relativo ao root `/home/felipe/Coding/Personal/craftedbyfelipe/`)
2. O array `planned` está no frontmatter do arquivo (entre os `---`)
3. **add**: Inserir novo objeto `{ title: '...', description: '...' }` ao final do array, antes do comentário `// add more here`
4. **remove**: Deletar o objeto cujo `title` corresponda (exato ou próximo) ao argumento, incluindo a vírgula e linhas em branco adjacentes
5. Nunca modificar nada fora do array `planned`
6. Após a edição, confirmar ao usuário o que foi feito e listar os itens atuais

## Input

$ARGUMENTS deve seguir um dos formatos:

- `add "Título do Post" "Descrição curta do post"`
- `remove "Título do Post"`

## Exemplo: add

Argumento: `add "Como eu uso o Obsidian" "Uma visão do meu workflow pessoal de notas"`

Editar o array `planned` em `src/pages/soon.astro` acrescentando:

```ts
  {
    title: 'Como eu uso o Obsidian',
    description: 'Uma visão do meu workflow pessoal de notas',
  },
```

antes de `// add more here`.

## Exemplo: remove

Argumento: `remove "Como eu uso o Obsidian"`

Localizar e deletar o objeto `{ title: 'Como eu uso o Obsidian', description: '...' }` do array.

## Checklist

- [ ] Leu `src/pages/soon.astro` antes de editar
- [ ] Apenas o array `planned` foi modificado
- [ ] Para add: novo item aparece antes de `// add more here`
- [ ] Para remove: item foi removido sem deixar vírgulas ou linhas em branco extras
- [ ] Confirmou ao usuário o que foi feito e listou os itens atuais
