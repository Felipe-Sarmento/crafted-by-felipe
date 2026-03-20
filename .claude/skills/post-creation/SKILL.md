# Post Creation Skill

When the user invokes `/post-creation`, they will provide the raw content of a blog post as `$ARGUMENTS`. Your job is to parse that content and create a properly formatted Astro blog post file.

## Input

The post content is: $ARGUMENTS

## Steps

### 1. Parse the content

Extract or infer the following from the content:

- **title:** Use the first `# Heading` if present, otherwise infer a concise title (max ~60 chars) from the content's main topic
- **description:** Write a 1–2 sentence summary of the post's main point (max ~160 chars). Do not copy the title verbatim.
- **tags:** Identify 2–5 relevant topic keywords from the content (e.g., `astro`, `javascript`, `web`, `tailwind`). Lowercase, no spaces.

### 2. Generate the slug

From the title:
- Lowercase everything
- Replace spaces with hyphens
- Remove accents/diacritics (e.g., `ã → a`, `é → e`, `ç → c`)
- Remove special characters (keep only `a-z`, `0-9`, `-`)
- Example: "Construindo um Blog" → `construindo-um-blog`

### 3. Get today's date

Use today's date (already available in context as `currentDate`) in `YYYY-MM-DD` format.

### 4. Create the file

**Path:** `src/content/blog/YYYY-MM-DD-{slug}.md` (relative to the project root `/home/felipe/Coding/Personal/craftedbyfelipe/`)

**File content:**

```
---
title: "{title}"
description: "{description}"
pubDate: YYYY-MM-DD
tags: [{tag1}, {tag2}, ...]
---

{original post content, cleaned up}
```

Rules for the content body:
- If the content already starts with a `# Title` heading that matches the frontmatter title, keep it. Otherwise, do not add a duplicate heading.
- Preserve all markdown formatting (headings, lists, code blocks, etc.)
- Do not add any extra text or commentary — write exactly the post content.

### 5. Confirm to the user

After creating the file, tell the user:
- The full file path created
- The post URL it will be accessible at (format: `/{year}/{month}/{day}/{slug}/`)
- That the post is already available on the home page

## Schema Reference

The frontmatter must satisfy this Zod schema (from `src/content.config.ts`):

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

Do not add `heroImage` or `updatedDate` unless the user explicitly provides them.
