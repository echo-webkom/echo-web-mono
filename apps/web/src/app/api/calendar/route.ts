import { type NextRequest } from "next/server";
import { isFuture, isPast, subMinutes } from "date-fns";
import { createEvents, type EventAttributes } from "ics";
import removeMarkdown from "remove-markdown";

import { happeningTypeToPath, happeningTypeToString } from "@echo-webkom/lib";

import {
  HAPPENING_TYPE_PARAM,
  INCLUDE_BEDPRES_REGISTRATION_PARAM,
  INCLUDE_MOVIES_PARAM,
  INCLUDE_PAST_PARAM,
} from "@/lib/calendar-url-builder";
import { fetchAllHappenings } from "@/sanity/happening";
import { fetchMovies } from "@/sanity/movies";

export const GET = async (req: NextRequest) => {
  const includePast = req.nextUrl.searchParams.has(INCLUDE_PAST_PARAM);
  const happeningType = req.nextUrl.searchParams.getAll(HAPPENING_TYPE_PARAM);
  const includeMovies = req.nextUrl.searchParams.has(INCLUDE_MOVIES_PARAM);
  const includeBedpresRegistration = req.nextUrl.searchParams.has(
    INCLUDE_BEDPRES_REGISTRATION_PARAM,
  );

  const happenings = await fetchAllHappenings();
  const movies = await fetchMovies();

  const filteredHappenings = happenings
    .filter((happening) => {
      return happeningType.includes(happening.happeningType);
    })
    .filter((happening) => Boolean(happening.date));

  const mappedEvents: Array<EventAttributes> = [];

  for (const event of filteredHappenings) {
    if (!event.date || (!includePast && !isFuture(new Date(event.date)))) {
      continue;
    }

    mappedEvents.push({
      title: event.title,
      location: event.location?.name ?? undefined,
      duration: { hours: 2 },
      start: new Date(event.date).getTime(),
      startInputType: "utc",
      busyStatus: "BUSY",
      url: `https://echo.uib.no${happeningTypeToPath[event.happeningType]}/${event.slug}`.replaceAll(
        " ",
        "%20",
      ),
      description: event.body ? removeMarkdown(event.body) : undefined,
      categories: [happeningTypeToString[event.happeningType]],

      method: "PUBLISH",
    } satisfies EventAttributes);
  }

  if (includeMovies) {
    for (const movie of movies) {
      if (!movie.date || (!includePast && !isFuture(new Date(movie.date)))) {
        continue;
      }

      mappedEvents.push({
        title: movie.title,
        duration: { hours: 2 },
        location: "Høyteknologisenteret, Stort auditorium",
        start: new Date(movie.date).getTime(),
        startInputType: "utc",
        busyStatus: "BUSY",
        url: movie.link ?? undefined,
        description: `Se ${movie.title} sammen med echo! ${movie.link}`,
        categories: ["Film"],

        method: "PUBLISH",
      } satisfies EventAttributes);
    }
  }

  if (includeBedpresRegistration) {
    const bedpresses = happenings.filter((happening) => happening.happeningType === "bedpres");

    for (const bedpres of bedpresses) {
      if (!bedpres.date || isPast(new Date(bedpres.date)) || !bedpres.registrationStart) {
        continue;
      }

      const registrationStart = subMinutes(new Date(bedpres.registrationStart), 5);

      mappedEvents.push({
        title: `Påmelding til ${bedpres.title}`,
        duration: { minutes: 5 },
        start: registrationStart.getTime(),
        startInputType: "utc",
        busyStatus: "BUSY",
        url: `https://echo.uib.no/bedpres/${bedpres.slug}`.replaceAll(" ", "%20"),
        description: bedpres.body ? removeMarkdown(bedpres.body) : undefined,
        categories: ["Bedriftspresentasjon"],

        method: "PUBLISH",
      } satisfies EventAttributes);
    }
  }

  const { error, value } = createEvents(mappedEvents, {
    calName: "Kalender for echo.uib.no",
  });

  if (error) {
    return new Response("Failed to create ics file", {
      status: 500,
    });
  }

  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename="echo-kalender.ics"`,
    },
  });
};
