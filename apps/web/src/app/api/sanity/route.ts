import {NextResponse} from "next/server";

import {prisma} from "@echo-webkom/db/client";
import {type Happening} from "@echo-webkom/db/types";

import {withBasicAuth} from "@/lib/checks/with-basic-auth";
import {fetchAllBedpresses, type Bedpres} from "@/sanity/bedpres";
import {fetchAllEvents, type Event} from "@/sanity/event";

// Don't cache this route.
export const revalidate = 0;

/**
 * Updates or creates bedpresses in the database.
 * A bedpres is always hosted by bedkom.
 *
 * @param happenings
 * @returns {Promise<Array<Happening>>} The updated or created bedpresses.
 */
const updateOrCreateBedpres = async (happenings: Array<Bedpres>): Promise<Array<Happening>> => {
  return await prisma.$transaction(
    happenings.map((happening) =>
      prisma.happening.upsert({
        where: {
          slug: happening.slug,
        },
        create: {
          slug: happening.slug,
          type: "BEDPRES",
          title: happening.title,
          questions: {
            create: happening.additionalQuestions?.map((question) => ({
              title: question.title,
              type: question.type === "text" ? "TEXT" : "CHOICE",
              required: question.required,
              options: question.options ?? [],
            })),
          },
          spotRanges: {
            create: happening.spotRanges?.map(({minDegreeYear, maxDegreeYear, spots}) => ({
              minDegreeYear,
              maxDegreeYear,
              spots,
            })),
          },
          studentGroups: {
            connect: {
              id: "bedkom",
            },
          },
          date: happening.date,
          registrationStart: happening.registrationStart,
          registrationEnd: happening.registrationEnd,
        },
        update: {
          title: happening.title,
          spotRanges: {
            deleteMany: {},
            create: happening.spotRanges?.map(({minDegreeYear, maxDegreeYear, spots}) => ({
              minDegreeYear,
              maxDegreeYear,
              spots,
            })),
          },
          questions: {
            deleteMany: {},
            create: happening.additionalQuestions?.map((question) => ({
              title: question.title,
              type: question.type === "text" ? "TEXT" : "CHOICE",
              required: question.required,
              options: question.options ?? [],
            })),
          },
          date: happening.date,
          registrationStart: happening.registrationStart,
          registrationEnd: happening.registrationEnd,
        },
      }),
    ),
  );
};

/**
 * Updates or creates events in the database.
 *
 * @param happenings
 * @returns {Promise<Array<Happening>>} The updated or created events.
 */
const updateOrCreateEvent = async (happenings: Array<Event>): Promise<Array<Happening>> => {
  return await prisma.$transaction(
    happenings.map((happening) =>
      prisma.happening.upsert({
        where: {
          slug: happening.slug,
        },
        create: {
          slug: happening.slug,
          type: "EVENT",
          title: happening.title,
          questions: {
            create: happening.additionalQuestions?.map((question) => ({
              title: question.title,
              type: question.type === "text" ? "TEXT" : "CHOICE",
              required: question.required,
              options: question.options ?? [],
            })),
          },
          spotRanges: {
            create: happening.spotRanges?.map(({minDegreeYear, maxDegreeYear, spots}) => ({
              minDegreeYear,
              maxDegreeYear,
              spots,
            })),
          },
          studentGroups: {
            connectOrCreate: happening.organizers.map((group) => ({
              where: {id: group.slug},
              create: {id: group.slug, name: group.name},
            })),
          },
          date: happening.date,
          registrationStart: happening.registrationStart,
          registrationEnd: happening.registrationEnd,
        },
        update: {
          title: happening.title,
          spotRanges: {
            deleteMany: {},
            create: happening.spotRanges?.map(({minDegreeYear, maxDegreeYear, spots}) => ({
              minDegreeYear,
              maxDegreeYear,
              spots,
            })),
          },
          questions: {
            deleteMany: {},
            create: happening.additionalQuestions?.map((question) => ({
              title: question.title,
              type: question.type === "text" ? "TEXT" : "CHOICE",
              required: question.required,
              options: question.options ?? [],
            })),
          },
          studentGroups: {
            deleteMany: {},
            connectOrCreate: happening.organizers.map((group) => ({
              where: {id: group.slug},
              create: {id: group.slug, name: group.name},
            })),
          },
          date: happening.date,
          registrationStart: happening.registrationStart,
          registrationEnd: happening.registrationEnd,
        },
      }),
    ),
  );
};

export const GET = withBasicAuth(async () => {
  try {
    const startTime = new Date().getTime();

    const events = await fetchAllEvents();
    const bedpresses = await fetchAllBedpresses();

    const updatedEvents = await updateOrCreateEvent(events);
    const updatedBedpresses = await updateOrCreateBedpres(bedpresses);

    const endTime = new Date().getTime();
    const totalSeconds = (endTime - startTime) / 1000;

    return NextResponse.json({
      message: "Success",
      events: updatedEvents,
      bedpresses: updatedBedpresses,
      timeInSeconds: totalSeconds,
    });
  } catch (error) {
    return new Response("Error updating happenings", {
      status: 500,
    });
  }
});
