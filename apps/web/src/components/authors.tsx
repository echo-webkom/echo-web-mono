import { isBoard } from "@echo-webkom/lib";
import { urlFor } from "@echo-webkom/sanity";

import { type AllPostsQueryResult } from "@/sanity.types";
import { initials } from "@/utils/string";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type AuthorsProps = {
  authors: AllPostsQueryResult[number]["authors"];
};

export const Authors = ({ authors }: AuthorsProps) => {
  if (!authors) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-bold">Publisert av:</p>

      <div className="flex flex-col flex-wrap gap-5 md:flex-row">
        {authors?.map((author) => {
          return (
            <div key={author._id} className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={author.image ? urlFor(author.image).url() : undefined} />
                <AvatarFallback>{initials(author.name)}</AvatarFallback>
              </Avatar>

              <p>{isBoard(author.name) ? "Hovedstyret" : author.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
