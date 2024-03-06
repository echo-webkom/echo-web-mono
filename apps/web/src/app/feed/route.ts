import { fetchAllPosts } from "@/sanity/posts";

export async function GET() {
  const posts = await fetchAllPosts();

  const latestPostDate = posts[0] ? new Date(posts[0]._createdAt) : new Date();

  const rssFeed = `<?xml version="1.0" ?>
  <rss
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:atom="http://www.w3.org/2005/Atom"
      version="2.0"
  >
      <channel>
          <title><![CDATA[echo – Linjeforeningen for informatikk]]></title>
          <link>https://echo.uib.no/</link>
          <description></description>
          <language>en-US</language>
          <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
            ${posts.map(formatPostToXML).join("")}
      </channel>
  </rss>
  `;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

const POST_DESCRIPTION_LENGTH = 70;

function formatPostToXML(post: Awaited<ReturnType<typeof fetchAllPosts>>[number]) {
  const title = post.title;
  const link = `https://echo.uib.no/for-studenter/innlegg/${post.slug}`;
  const creator = post.authors ? post.authors?.map((author) => author.name).join(", ") : "echo";
  const pubDate = new Date(post._createdAt).toUTCString();
  const description =
    post.body.length > POST_DESCRIPTION_LENGTH
      ? post.body.slice(0, POST_DESCRIPTION_LENGTH) + "..."
      : post.body;
  const content = post.body;

  return `
  <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="false">${link}</guid>
      <dc:creator><![CDATA[${creator}]]></dc:creator>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <content:encoded><![CDATA[${content}]]></content:encoded>
  </item>
  `;
}
