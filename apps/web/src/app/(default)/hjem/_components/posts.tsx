import { PostPreview } from "@/components/post-preview";
import { fetchPosts } from "@/sanity/posts";
import { BentoBox } from "./bento-box";

export async function Posts({ className }: { className?: string }) {
  const posts = await fetchPosts(2);

  return (
    <BentoBox title="Siste nytt" href="/for-studenter/innlegg" className={className}>
      <ul className="grid grid-cols-1 gap-x-3 gap-y-5 py-4">
        {posts.map((post) => (
          <li key={post._id}>
            <PostPreview post={post} className="shadow-none" />
          </li>
        ))}
      </ul>
    </BentoBox>
  );
}
