import Link from "next/link";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";
import removeMd from "remove-markdown";

import {type Post} from "@/sanity/posts";
import {cn} from "@/utils/cn";

export default function PostPreview({post}: {post: Post}) {
  return (
    <Link href={`/for-students/post/${post.slug}`}>
      <div
        className={cn(
          "relative flex h-auto flex-col gap-1 rounded-lg p-5",
          "hover:bg-muted",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        <h3 className="line-clamp-2 flex gap-2 text-2xl font-semibold">{post.title}</h3>

        <p>
          Publisert:{" "}
          {format(new Date(post._createdAt), "d. MMMM yyyy", {
            locale: nb,
          })}
        </p>

        <hr />

        <p className="my-2 line-clamp-3 italic">{removeMd(post.body)}</p>

        <p>
          <span className="font-semibold">Skrevet av:</span>{" "}
          {post.authors.map((author) => author.name).join(", ")}
        </p>
      </div>
    </Link>
  );
}
