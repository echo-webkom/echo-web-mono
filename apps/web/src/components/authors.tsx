import { isBoard } from "@echo-webkom/lib";
import { urlFor } from "@echo-webkom/sanity";

import { type Author } from "@/sanity/posts";
import { initials } from "@/utils/string";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Authors = ({ authors }: { authors: Array<Author> }) => {
  if (authors.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-lg font-bold">Publisert av:</p>

      <div className="flex flex-col flex-wrap gap-5 md:flex-row">
        {authors.map((author) => {
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
