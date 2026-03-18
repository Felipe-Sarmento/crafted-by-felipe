import type { CollectionEntry } from 'astro:content';

/**
 * Extracts the URL slug from a post id.
 * Files named `YYYY-MM-DD-my-slug.md` → slug = `my-slug`
 * Files without date prefix → slug = full id
 */
export function getPostSlug(post: CollectionEntry<'blog'>): string {
	return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * Generates the canonical URL path for a blog post.
 * Returns `/YYYY/MM/DD/slug/`
 */
export function getPostUrl(post: CollectionEntry<'blog'>): string {
	const d = post.data.pubDate;
	const year = String(d.getUTCFullYear());
	const month = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');
	const slug = getPostSlug(post);
	return `/${year}/${month}/${day}/${slug}/`;
}
