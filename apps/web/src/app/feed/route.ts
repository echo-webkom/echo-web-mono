import { createRSSFeed } from "@/lib/rss";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMinutes } from "@/sanity/minutes";
import { fetchAllPosts } from "@/sanity/posts";
import { happeningToRSSItem, meetingMinuteToRSSItem, postToRSSItem } from "./_lib/mappers";

export const revalidate = 1800;

export const GET = async () => {
  const [posts, happenings, minutes] = await Promise.all([
    fetchAllPosts(),
    fetchAllHappenings(),
    fetchMinutes(),
  ]);

  const lastBuildDate = new Date();

  const rssItems = [
    posts.map(postToRSSItem),
    happenings.map(happeningToRSSItem),
    minutes.map(meetingMinuteToRSSItem),
  ]
    .flat()
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  const rssFeed = createRSSFeed({
    title: "echo – Linjeforeningen for informatikk",
    link: "https://echo.uib.no/",
    description:
      "Innlegg, arrangementer og møtereferater fra echo – Linjeforeningen for informatikk",
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
