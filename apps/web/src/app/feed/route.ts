import { createRSSFeed, type RSSItem } from "@/lib/rss";
import { fetchAllPosts } from "@/sanity/posts";

type Post = Awaited<ReturnType<typeof fetchAllPosts>>[number];

const POST_DESCRIPTION_LENGTH = 300;

const postToRSSItem = (post: Post): RSSItem => {
  const title = post.title;
  const link = `https://echo.uib.no/for-studenter/innlegg/${post.slug}`;
  const creator = post.authors ? post.authors?.map((author) => author.name).join(", ") : "echo";
  const pubDate = new Date(post._createdAt).toUTCString();
  const description =
    post.body.length > POST_DESCRIPTION_LENGTH
      ? post.body.slice(0, POST_DESCRIPTION_LENGTH) + "..."
      : post.body;
  const content = post.body;

  return { title, link, guid: post._id, creator, pubDate, description, content };
};

export async function GET() {
  const posts = await fetchAllPosts();
  const latestPostDate = posts[0] ? new Date(posts[0]._createdAt) : new Date();

  const rssFeed = createRSSFeed({
    title: "echo – Linjeforeningen for informatikk",
    link: "https://echo.uib.no/",
    description: "Innlegg på nettsiden til echo – Linjeforeningen for informatikk",
    language: "nb",
    lastBuildDate: latestPostDate.toUTCString(),
    items: posts.map(postToRSSItem),
  });

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
