import Container from "@/components/container";
import PostPreview from "@/components/post-preview";
import {fetchPosts} from "@/sanity/posts";

export const metadata = {
  title: "Innlegg",
};

export default async function PostsOverviewPage() {
  const posts = await fetchPosts(-1);

  return (
    <Container>
      <h1 className="text-5xl font-bold">Innlegg</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {posts.map((post) => (
          <div key={post._id}>
            <PostPreview post={post} />
          </div>
        ))}
      </div>
    </Container>
  );
}
