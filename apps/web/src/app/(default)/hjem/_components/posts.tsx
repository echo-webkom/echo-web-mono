import { unoWithAdmin } from "@/api/server";
import { PostPreview } from "@/components/post-preview";

import { BentoBox } from "./bento-box";

export const Posts = async ({ className }: { className?: string }) => {
  const posts = await unoWithAdmin.sanity.posts.all({ n: 2 }).catch(() => []);

  return (
    <BentoBox title="Siste nytt" href="/for-studenter/innlegg" className={className}>
      <ul className="grid grid-cols-1 gap-x-3 gap-y-4">
        {posts.map((post) => (
          <li key={post._id}>
            <PostPreview post={post} className="shadow-none" />
          </li>
        ))}
      </ul>
    </BentoBox>
  );
};
