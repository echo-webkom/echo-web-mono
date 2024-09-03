import { cache } from "react";
import { type Metadata } from "next/types";

import { Container } from "@/components/container";
import { PostPreview } from "@/components/post-preview";
import { Heading } from "@/components/typography/heading";
import { fetchAllPosts } from "@/sanity/posts/requests";

export const metadata = {
  title: "Innlegg",
} satisfies Metadata;

const getData = cache(async () => {
  return await fetchAllPosts();
});

export default async function PostsOverviewPage() {
  const posts = await getData();

  return (
    <Container className="space-y-8 py-10">
      <Heading>Innlegg</Heading>

      <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
        {posts.map((post) => (
          <div key={post._id}>
            <PostPreview post={post} withBorder />
          </div>
        ))}
      </div>
    </Container>
  );
}
