import { type AllHappeningsQueryResult, type AllPostsQueryResult } from "@echo-webkom/cms/types";

import { type RSSItem } from "@/lib/rss";

type Post = AllPostsQueryResult[number];
type Happening = AllHappeningsQueryResult[number];

const POST_DESCRIPTION_LENGTH = 300;
const HAPPENING_DESCRIPTION_LENGTH = 300;

export const postToRSSItem = (post: Post): RSSItem => {
  const title = post.title;
  const link = `https://echo.uib.no/for-studenter/innlegg/${post.slug}`;
  const creator = post.authors ? post.authors?.map((author) => author.name).join(", ") : "echo";
  const pubDate = new Date(post._createdAt).toUTCString();
  const description =
    post.body && post.body.length > POST_DESCRIPTION_LENGTH
      ? post.body.slice(0, POST_DESCRIPTION_LENGTH) + "..."
      : post.body;
  const content = post.body;

  return { title, link, guid: post._id, creator, pubDate, description, content };
};

export const happeningToRSSItem = (happening: Happening): RSSItem => {
  const title = happening.title;
  const link =
    happening.happeningType === "bedpres"
      ? `https://echo.uib.no/bedpres/${happening.slug}`
      : `https://echo.uib.no/arrangement/${happening.slug}`;
  const creator =
    happening.organizers?.map((organizer) => organizer.name).join(", ") ?? "Ingen arrangør";
  const pubDate = new Date(happening._createdAt).toUTCString();
  const description =
    happening.body && happening.body.length > HAPPENING_DESCRIPTION_LENGTH
      ? happening.body.slice(0, HAPPENING_DESCRIPTION_LENGTH) + "..."
      : (happening.body ?? "");
  const content = happening.body ?? "";

  return { title, link, guid: happening._id, creator, pubDate, description, content };
};
