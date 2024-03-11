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
 * Fettches latest movies
 *
 * @param n the number of movies to fetch
 * @returns newest movies or an empty array if error
 */
export async function fetchNewestMovie(n: number) {
  return await fetchMovies().then((res) =>
    res.filter((movie) => new Date(movie.date) > new Date()).slice(0, n),
  );
}
