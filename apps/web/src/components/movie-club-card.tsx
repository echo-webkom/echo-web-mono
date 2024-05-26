import Image from "next/image";
import Link from "next/link";
import { isPast } from "date-fns/isPast";

import { urlFor } from "@echo-webkom/sanity";

import { fetchNewestMovie } from "@/sanity/movies";
import { shortDateNoTimeNoYear, shortDateNoYear } from "@/utils/date";

export default async function MovieClubCard() {
  const movies = await fetchNewestMovie(3);

  const thisWeekMovie = movies[0];
  const nextWeekMovie = movies[1];
  const nextNextWeekMovie = movies[2];

  if (!thisWeekMovie) {
    return (
      <div className="text-center font-semibold">
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
        <div className="group relative h-[20rem] w-[13rem] sm:h-[24rem] sm:w-[16rem]">
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
              <div className="rounded-md bg-background p-2 opacity-90 transition-transform duration-300 group-hover:translate-y-40">
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
        <div>
          <ul className="flex flex-col space-y-8">
            <div className="relative h-[9rem] w-[6rem] sm:h-[11rem] sm:w-[7rem]">
              <Image
                className="rounded-md border"
                fill
                src={urlFor(nextWeekMovie.image).url()}
                alt={`${nextWeekMovie.title} logo`}
              />
              <div className="absolute inset-0 flex flex-col-reverse overflow-hidden rounded-md border p-2">
                <li className="rounded-md bg-background p-2 text-xs opacity-90">
                  {shortDateNoTimeNoYear(nextWeekMovie.date)}
                </li>
              </div>
            </div>
            {nextNextWeekMovie && (
              <div className="relative h-[9rem] w-[6rem] sm:h-[11rem] sm:w-[7rem]">
                <Image
                  className="rounded-md border"
                  fill
                  src={urlFor(nextNextWeekMovie.image).url()}
                  alt={`${nextNextWeekMovie.title} logo`}
                />
                <div className="absolute inset-0 flex flex-col-reverse overflow-hidden rounded-md border p-2">
                  <li className="rounded-md bg-background p-2 text-xs opacity-90">
                    {shortDateNoTimeNoYear(nextNextWeekMovie.date)}
                  </li>
                </div>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
