import "server-only";
import { unoWithAdmin } from "@/api/server";

import {
  happeningsToCalendarEvent,
  moviesToCalendarEvent,
  repeatingEventsToCalendarEvent,
} from "./calendar-event-helpers";

export const getCalendarEvents = async () => {
  const [happenings, repeatingHappenings, movies] = await Promise.all([
    unoWithAdmin.sanity.happenings.all().catch(() => []),
    unoWithAdmin.sanity.happenings.repeating().catch(() => []),
    unoWithAdmin.sanity.movies.all().catch(() => []),
  ]);

  return happeningsToCalendarEvent(happenings)
    .concat(moviesToCalendarEvent(movies))
    .concat(repeatingEventsToCalendarEvent(repeatingHappenings));
};
