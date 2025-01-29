import "server-only";

import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";
import { fetchAllRepeatingHappenings } from "@/sanity/repeating-happening";
import {
  happeningsToCalendarEvent,
  moviesToCalendarEvent,
  repeatingEventsToCalendarEvent,
} from "./calendar-event-helpers";

export const getCalendarEvents = async () => {
  const [happenings, repeatingHappenings, movies] = await Promise.all([
    fetchAllHappenings(),
    fetchAllRepeatingHappenings(),
    fetchMovies(),
  ]);

  return happeningsToCalendarEvent(happenings)
    .concat(moviesToCalendarEvent(movies))
    .concat(repeatingEventsToCalendarEvent(repeatingHappenings));
};
