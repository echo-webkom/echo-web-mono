import Image from "next/image";

import { fetchMovies } from "@/sanity/movies";
import { shortDate } from "@/utils/date";
import { urlFor } from "@/utils/image-builder";

export default async function MovieClubCard() {
  const movies = await fetchMovies();

  const thisWeekMovie = movies[0];

  if (!thisWeekMovie) {
    return null;
  }
  return (
    <div className="flex justify-center p-5">
      <div className="relative h-96 w-64">
        <div>
          <Image
            className="rounded-md border"
            fill
            src={urlFor(thisWeekMovie?.image).url()}
            alt={`${thisWeekMovie.title} logo`}
          />
          <div className="absolute inset-0 flex flex-col-reverse rounded-md border p-2">
            <div className="rounded-md bg-background p-2 opacity-90">
              <h1 className="font-semibold">{thisWeekMovie?.title}</h1>
              <ul className="content-evenly text-sm">
                <li>
                  <span className="font-semibold">Sted:</span> Store Aud
                </li>
                <li>
                  <span className="font-semibold">Dato:</span> {shortDate(thisWeekMovie?.date)}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
