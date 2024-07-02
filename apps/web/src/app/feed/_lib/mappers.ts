import { type RSSItem } from "@/lib/rss";
import { type AllPostsQueryResult } from "@/sanity.types";

type Post = AllPostsQueryResult[number];

const POST_DESCRIPTION_LENGTH = 300;

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
