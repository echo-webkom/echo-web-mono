import Image from "next/image";
import Link from "next/link";
import { isPast } from "date-fns/isPast";

import { urlFor } from "@echo-webkom/sanity";

import { fetchNewestMovie } from "@/sanity/movies";
import { shortDateNoTimeNoYear, shortDateNoYear } from "@/utils/date";

export const MovieClubCard = async () => {
  const movies = await fetchNewestMovie(3);

  const thisWeekMovie = movies[0];
  const nextWeekMovie = movies[1];
  const nextNextWeekMovie = movies[2];

  if (!thisWeekMovie) {
    return (
      <div className="text-center font-bold">
        <p>Ingen film denne uken</p>
      </div>
    );
  } else if (isPast(thisWeekMovie.date)) {
    return (
      <div className="text-center font-semibold">
        <p>Ingen film denne uken</p>
      </div>
    );
  }
  return (
    <div className="flex justify-evenly">
      <div className="flex flex-col">
        <div className="group relative h-72 w-48 md:flex lg:h-96 lg:w-[16rem]">
          <div>
            <Image
              className="rounded-md border"
              fill
              src={urlFor(thisWeekMovie.image).url()}
              alt={`${thisWeekMovie.title} logo`}
            />
          </div>
          <Link href={thisWeekMovie.link ?? "#"}>
            <div className="absolute inset-0 flex flex-col-reverse overflow-hidden rounded-md border p-2">
              <div className="bg-background rounded-md p-2 opacity-90 transition-transform duration-300 group-hover:translate-y-40">
                <ul>
                  <label className="line-clamp-1 overflow-hidden text-2xl font-semibold">
                    {thisWeekMovie.title}
                  </label>
                  <li>
                    <span className="font-semibold">Sted:</span> Store Aud
                  </li>
                  <li>
                    <span className="font-semibold">Dato:</span>{" "}
                    {shortDateNoYear(thisWeekMovie.date)}
                  </li>
                </ul>
              </div>
            </div>
          </Link>
        </div>
      </div>
      {nextWeekMovie && (
        <ul className="flex flex-col space-y-1 md:hidden xl:block">
          <div className="relative h-36 w-24 lg:h-44 lg:w-28">
            <Image
              className="rounded-md border"
              fill
              src={urlFor(nextWeekMovie.image).url()}
              alt={`${nextWeekMovie.title} logo`}
            />
            <div className="absolute inset-0 flex flex-col-reverse overflow-hidden rounded-md border p-2">
              <li className="bg-background rounded-md p-2 text-xs opacity-90">
                {shortDateNoTimeNoYear(nextWeekMovie.date)}
              </li>
            </div>
          </div>
          {nextNextWeekMovie && (
            <div className="relative h-36 w-24 lg:w-28 xl:h-44">
              <Image
                className="rounded-md border"
                fill
                src={urlFor(nextNextWeekMovie.image).url()}
                alt={`${nextNextWeekMovie.title} logo`}
              />
              <div className="absolute inset-0 flex flex-col-reverse overflow-hidden rounded-md border p-2">
                <li className="bg-background rounded-md p-2 text-xs opacity-90">
                  {shortDateNoTimeNoYear(nextNextWeekMovie.date)}
                </li>
              </div>
            </div>
          )}
        </ul>
      )}
    </div>
  );
};
