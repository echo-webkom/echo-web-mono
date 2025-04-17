import { axis } from '$lib/axis/client.server';
import { type AllPostsQueryResult } from '@echo-webkom/cms/types';

export type RSSItem = {
	title: string;
	link: string;
	guid: string;
	creator: string;
	pubDate: string;
	description: string;
	content: string;
};

export type RSSFeed = {
	title: string;
	link: string;
	description: string;
	language: string;
	lastBuildDate: string;
	items: Array<RSSItem>;
};

const createRSSItem = (item: RSSItem) => {
	return `<item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <guid isPermaLink="false">${item.guid}</guid>
      <dc:creator><![CDATA[${item.creator}]]></dc:creator>
      <pubDate>${item.pubDate}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      <content:encoded><![CDATA[${item.content}]]></content:encoded>
  </item>
      `;
};

const createRSSFeed = (feed: RSSFeed) => {
	return `<?xml version="1.0" ?>
  <rss
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:atom="http://www.w3.org/2005/Atom"
      version="2.0"
  >
      <channel>
          <title><![CDATA[${feed.title}]]></title>
          <link>${feed.link}</link>
          <description>${feed.description}</description>
          <language>${feed.language}</language>
          <lastBuildDate>${feed.lastBuildDate}</lastBuildDate>
          ${feed.items.map(createRSSItem).join('\n')}
      </channel>
  </rss>
      `;
};

type Post = AllPostsQueryResult[number];

const POST_DESCRIPTION_LENGTH = 300;

const postToRSSItem = (post: Post): RSSItem => {
	const title = post.title;
	const link = `https://echo.uib.no/for-studenter/innlegg/${post.slug}`;
	const creator = post.authors ? post.authors?.map((author) => author.name).join(', ') : 'echo';
	const pubDate = new Date(post._createdAt).toUTCString();
	const description =
		post.body && post.body.length > POST_DESCRIPTION_LENGTH
			? post.body.slice(0, POST_DESCRIPTION_LENGTH) + '...'
			: post.body;
	const content = post.body;

	return { title, link, guid: post._id, creator, pubDate, description, content };
};

export const GET = async () => {
	const posts = await axis.content.posts.list();
	const latestPostDate = posts[0] ? new Date(posts[0]._createdAt) : new Date();

	const rssItems = [posts.map(postToRSSItem)]
		.flat()
		.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

	const rssFeed = createRSSFeed({
		title: 'echo – Linjeforeningen for informatikk',
		link: 'https://echo.uib.no/',
		description: 'Innlegg på nettsiden til echo – Linjeforeningen for informatikk',
		language: 'nb',
		lastBuildDate: latestPostDate.toUTCString(),
		items: rssItems
	});

	return new Response(rssFeed, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
