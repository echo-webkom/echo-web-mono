import removeMarkdown from "remove-markdown";

import { createHappeningLink } from "@/lib/create-link";
import { type fetchAllHappenings } from "@/sanity/happening";
import { type fetchMovies } from "@/sanity/movies";

export const happeningsToCalendarEvent = (
  happenings: Awaited<ReturnType<typeof fetchAllHappenings>>,
) => {
  return happenings
    .filter((happening) => Boolean(happening.date))
    .map((happening) => ({
      id: happening._id,
      title: happening.title,
      date: new Date(happening.date),
      body: removeMarkdown(happening.body ?? ""),
      link: createHappeningLink(happening),
    }));
};

export const moviesToCalendarEvent = (movies: Awaited<ReturnType<typeof fetchMovies>>) => {
  return movies.map((movie) => ({
    id: movie._id,
    title: `Film: ${movie.title}`,
    date: new Date(movie.date),
    body: `Se ${movie.title} med filmklubben!`,
    link: movie.link ?? "#",
  }));
};
