import { cache } from "react";

import { Container } from "@/components/container";
import { PostPreview } from "@/components/post-preview";
import { Heading } from "@/components/typography/heading";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchAllPosts } from "@/sanity/posts";

export const metadata = {
  title: "Innlegg",
};

const getData = cache(async () => {
  return await fetchAllPosts();
});

export default async function PostsOverviewPage() {
  const posts = await getData();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div className="space-y-8">
        <Heading>Innlegg</Heading>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
          {posts.map((post) => (
            <div key={post._id}>
              <PostPreview post={post} withBorder />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
