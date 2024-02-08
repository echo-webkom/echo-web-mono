import Link from "next/link";
import { add, format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import removeMd from "remove-markdown";

import { isBoard } from "@/lib/is-board";
import { type Post } from "@/sanity/posts";
import { cn } from "@/utils/cn";
import { Chip } from "./typography/chip";

type PostPreviewProps = {
  post: Post;
  withBorder?: boolean;
  className?: string;
};

export function PostPreview({ post, withBorder = false, className }: PostPreviewProps) {
  const isNew = add(new Date(post._createdAt), { days: 2 }) > new Date();

  return (
    <Link href={`/for-studenter/innlegg/${post.slug}`}>
      <div
        className={cn(
          "relative flex h-full flex-col gap-1 rounded-lg p-5 shadow-lg transition-colors duration-200 ease-in-out hover:bg-muted",
          withBorder && "border",
          isNew && "bg-muted hover:bg-transparent",
          className,
        )}
      >
        {isNew && <Chip className="absolute -top-2 left-0 bg-primary text-white">NY</Chip>}
        <h3 className="line-clamp-2 flex gap-2 text-xl font-semibold md:text-2xl">{post.title}</h3>

        <p className="right-1 top-1 text-sm text-gray-500 sm:absolute">
          {format(new Date(post._createdAt), "d. MMMM yyyy", {
            locale: nb,
          })}
        </p>

        <p className="my-2 line-clamp-2 italic">{removeMd(post.body)}</p>

        {post.authors && (
          <div className="flex flex-row flex-wrap items-center gap-1 sm:absolute sm:-bottom-1 sm:right-4">
            {post.authors.map((author) => (
              <Chip className="bg-secondary text-secondary-foreground" key={author._id}>
                {isBoard(author.name) ? "Hovedstyret" : author.name}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
