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

export const createRSSItem = (item: RSSItem) => {
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

export const createRSSFeed = (feed: RSSFeed) => {
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
        ${feed.items.map(createRSSItem).join("\n")}
    </channel>
</rss>
    `;
};
