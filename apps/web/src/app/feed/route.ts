import { createRSSFeed } from "@/lib/rss";
import { fetchAllPosts } from "@/sanity/posts";
import { postToRSSItem } from "./_lib/mappers";

export const GET = async () => {
  const posts = await fetchAllPosts();
  const latestPostDate = posts[0] ? new Date(posts[0]._createdAt) : new Date();

  const rssItems = [posts.map(postToRSSItem)]
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const rssFeed = createRSSFeed({
    title: "echo – Linjeforeningen for informatikk",
    link: "https://echo.uib.no/",
    description: "Innlegg på nettsiden til echo – Linjeforeningen for informatikk",
    language: "nb",
    lastBuildDate: latestPostDate.toUTCString(),
    items: rssItems,
  });

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
