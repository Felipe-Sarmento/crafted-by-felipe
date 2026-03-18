import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import MarkdownIt from 'markdown-it';
import { SITE_AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPostUrl } from '../utils/postUrl';

const md = new MarkdownIt({ html: true, linkify: true });

export async function GET(context) {
	const posts = await getCollection('blog');
	const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: `<language>pt-br</language><managingEditor>${SITE_AUTHOR}</managingEditor>`,
		items: sorted.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: getPostUrl(post),
			content: md.render(post.body ?? ''),
			categories: post.data.tags ?? [],
		})),
	});
}
