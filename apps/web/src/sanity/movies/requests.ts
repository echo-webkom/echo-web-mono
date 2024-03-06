import { sanityClient } from "../client";
import { moviesQuery } from "./queries";
import { type Movies } from "./schemas";

/**
 * Fetches a number of movies
 *
 * @param n number of movies to fetch
 * @returns movies or null if not found
 */

export async function fetchMovies() {
  return await sanityClient.fetch<Array<Movies>>(moviesQuery);
}

/**
 * Fetches a number of job ads where the deadline hasn't expired
 *
 * @param n the number of job ads to fetch
 * @returns job ads or an empty array if error
 */
export async function fetchNewestMovie(n: number) {
  return await fetchMovies().then((res) =>
    res.filter((movie) => new Date(movie.date) > new Date()).slice(0, n),
  );
}
