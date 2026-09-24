---
description: Revisa ortografia e gramática de um texto ou post em modo plano
agent: corrector
---

Quando o usuário invoca `/corrigir`, o alvo da revisão é: $ARGUMENTS

Interprete `$ARGUMENTS`:

- Se for um **caminho de arquivo** (ex.: `src/content/blog/2026-01-01-meu-post.md`),
  leia-o com a ferramenta de leitura antes de analisar.
- Se for **texto colado**, trate-o como o conteúdo a corrigir.
- Se estiver **vazio**, identifique o alvo pelo contexto da conversa (por exemplo, o
  último post discutido ou criado) ou pergunte ao usuário.

Em seguida, execute o fluxo do agente **Corrector**: analise o conteúdo completo e
apresente o plano de correções de ortografia e gramática, sem editar nada. Ao final,
oriente o usuário a trocar para o agente `build` (Tab) para aplicar as correções.

Responda sempre em Português do Brasil (PT-BR).
