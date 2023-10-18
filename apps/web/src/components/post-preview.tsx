import Link from "next/link";
import { format } from "date-fns";
import nb from "date-fns/locale/nb";
import removeMd from "remove-markdown";

import { type Post } from "@/sanity/posts";
import { cn } from "@/utils/cn";

type PostPreviewProps = {
  post: Post;
  withBorder?: boolean;
  className?: string;
};

export function PostPreview({ post, withBorder = false, className }: PostPreviewProps) {
  return (
    <Link
      href={`/for-studenter/innlegg/${post.slug}`}
      className={cn(
        "flex h-full flex-col gap-1 rounded-lg p-5",
        "hover:bg-muted",
        "shadow-lg transition-colors duration-200 ease-in-out",
        withBorder && "border",
        className,
      )}
    >
      <h3 className="line-clamp-2 flex gap-2 text-xl font-semibold md:text-2xl">{post.title}</h3>

      <p>
        Publisert:{" "}
        {format(new Date(post._createdAt), "d. MMMM yyyy", {
          locale: nb,
        })}
      </p>

      <hr />

      <p className="my-2 line-clamp-3 italic">{removeMd(post.body)}</p>

      {post.authors && (
        <p>
          <span className="font-semibold">Skrevet av:</span>{" "}
          {post.authors.map((author) => author.name).join(", ")}
        </p>
      )}
    </Link>
  );
}
