import { createRSSFeed } from "@/lib/rss";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchAllPosts } from "@/sanity/posts";
import { happeningToRSSItem, postToRSSItem } from "./_lib/mappers";

export const GET = async () => {
  const [posts, happenings] = await Promise.all([fetchAllPosts(), fetchAllHappenings()]);

  const latestPostDate = posts[0] ? new Date(posts[0]._createdAt) : new Date();
  const latestHappeningDate = happenings[0] ? new Date(happenings[0]._createdAt) : new Date();
  const lastBuildDate = latestPostDate > latestHappeningDate ? latestPostDate : latestHappeningDate;

  const rssItems = [posts.map(postToRSSItem), happenings.map(happeningToRSSItem)]
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const rssFeed = createRSSFeed({
    title: "echo – Linjeforeningen for informatikk",
    link: "https://echo.uib.no/",
    description: "Innlegg og arrangementer på nettsiden til echo – Linjeforeningen for informatikk",
    language: "nb",
    lastBuildDate: lastBuildDate.toUTCString(),
    items: rssItems,
  });

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
