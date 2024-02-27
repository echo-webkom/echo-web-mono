import { sanityFetch } from "../client";
import {moviesQuery} from "./queries"
import {moviesSchema} from "./schemas"


/**
 * Fetches a number of movies
 *
 * @param n number of movies to fetch
 * @returns movies or null if not found
 */

export async function fetchMovies() {
    return await sanityFetch({
      query: moviesQuery,
      tags: ["movies"],
    })
      .then((res) => moviesSchema.array().parse(res))
      .catch(() => []);
  }