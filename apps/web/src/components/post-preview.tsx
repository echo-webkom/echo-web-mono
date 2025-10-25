import Link from "next/link";
import { addDays } from "date-fns";
import removeMd from "remove-markdown";

import { type AllPostsQueryResult } from "@echo-webkom/cms/types";
import { isBoard } from "@echo-webkom/lib";

import { cn } from "@/utils/cn";
import { shortDateNoTimeNoYear } from "@/utils/date";
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
          "hover:border-muted-dark hover:bg-muted relative flex flex-col gap-1 rounded-xl border-2 p-6 transition-colors duration-200 ease-in-out",
          {
            "border-transparent": !withBorder,
            "bg-muted hover:bg-transparent": isNew,
          },
          className,
        )}
      >
        <h3 className="text-md line-clamp-2 flex gap-2 truncate font-semibold sm:text-xl">
          {post.title}
        </h3>

        <p className="top-2 right-2 text-xs text-gray-500 sm:absolute sm:text-sm">
          {shortDateNoTimeNoYear(post._createdAt)}
        </p>

        {post.body && <p className="my-2 line-clamp-3 text-sm italic">{removeMd(post.body)}</p>}

        <div className="flex flex-row flex-wrap items-center gap-1 sm:absolute sm:right-4 sm:-bottom-4">
          {isNew && <Chip>NY</Chip>}
          {post.authors?.map((author) => (
            <Chip variant="secondary" key={author._id}>
              {isBoard(author.name) ? "Hovedstyret" : author.name}
            </Chip>
          ))}
        </div>
      </div>
    </Link>
  );
};
