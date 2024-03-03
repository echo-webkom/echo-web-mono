import { sanityClient } from "../client";
import { moviesQuery } from "./queries";
import { Movies } from "./schemas";

/**
 * Fetches a number of movies
 *
 * @param n number of movies to fetch
 * @returns movies or null if not found
 */

export async function fetchMovies() {
  return await sanityClient.fetch<Array<Movies>>(moviesQuery);
}
