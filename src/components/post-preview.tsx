import Link from "next/link";
import { addDays, format } from "date-fns";
import { nb } from "date-fns/locale/nb";
import removeMd from "remove-markdown";

import { isBoard } from "@/lib/is-board";
import { type AllPostsQueryResult } from "@/sanity.types";
import { cn } from "@/utils/cn";
import { Chip } from "./typography/chip";

type PostPreviewProps = {
  post: AllPostsQueryResult[number];
  withBorder?: boolean;
  className?: string;
};

export const PostPreview = ({ post, withBorder = false, className }: PostPreviewProps) => {
  const isNew = addDays(new Date(post._createdAt), 3) > new Date();

  return (
    <Link href={`/for-studenter/innlegg/${post.slug}`}>
      <div
        className={cn(
          "relative flex h-full flex-col gap-1 rounded-xl border-2 p-6 transition-colors duration-200 ease-in-out hover:border-muted-dark hover:bg-muted",
          {
            "border-transparent": !withBorder,
            "bg-muted hover:bg-transparent": isNew,
          },
          className,
        )}
      >
        {isNew && <Chip className="absolute -top-2 left-0 bg-primary text-white">NY</Chip>}
        <h3 className="line-clamp-2 flex gap-2 text-xl font-semibold md:text-2xl">{post.title}</h3>

        <p className="right-2 top-2 text-sm text-gray-500 sm:absolute">
          {format(new Date(post._createdAt), "d. MMMM yyyy", {
            locale: nb,
          })}
        </p>

        {post.body && <p className="my-2 line-clamp-2 italic">{removeMd(post.body)}</p>}

        {post.authors && (
          <div className="flex flex-row flex-wrap items-center gap-1 sm:absolute sm:-bottom-4 sm:right-4">
            {post.authors.map((author) => (
              <Chip variant="secondary" key={author._id}>
                {isBoard(author.name) ? "Hovedstyret" : author.name}
              </Chip>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
