import { type MoviesQueryResult } from "@/sanity.types";
import { sanityFetch } from "../client";
import { moviesQuery } from "./queries";

/**
 * Fetches a number of movies
 *
 * @param n number of movies to fetch
 * @returns movies or null if not found
 */

export const fetchMovies = async () => {
  return await sanityFetch<MoviesQueryResult>({
    query: moviesQuery,
    tags: ["movies"],
  });
};

/**
 * Fettches latest movies
 *
 * @param n the number of movies to fetch
 * @returns newest movies or an empty array if error
 */
export const fetchNewestMovie = async (n: number): Promise<MoviesQueryResult> => {
  return await fetchMovies().then((res) =>
    res.filter((movie) => new Date(movie.date) > new Date()).slice(0, n),
  );
};
