import { unoWithAdmin } from "@/api/server";
import { createRSSFeed } from "@/lib/rss";

import { happeningToRSSItem, meetingMinuteToRSSItem, postToRSSItem } from "./_lib/mappers";

export const revalidate = 1800;

export const GET = async () => {
  const [posts, happenings, minutes] = await Promise.all([
    unoWithAdmin.sanity.posts.all().catch(() => []),
    unoWithAdmin.sanity.happenings.all().catch(() => []),
    unoWithAdmin.sanity.minutes.all().catch(() => []),
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
