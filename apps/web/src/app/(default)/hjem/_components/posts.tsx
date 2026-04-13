import { type CMSPost } from "@/api/uno/client";
import { PostPreview } from "@/components/post-preview";

import { BentoBox } from "./bento-box";

export const Posts = ({ posts, className }: { posts: Array<CMSPost>; className?: string }) => {
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
