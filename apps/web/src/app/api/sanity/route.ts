import {NextResponse} from "next/server";

import {prisma} from "@echo-webkom/db/client";

import {withBasicAuth} from "@/lib/checks/with-basic-auth";
import {$fetchAllBedpresses, type Bedpres} from "@/sanity/bedpres";
import {$fetchAllEvents, type Event} from "@/sanity/event";
import {isErrorMessage} from "@/utils/error";

export const revalidate = 0;

const updateOrCreateBedpres = async (happenings: Array<Bedpres>) => {
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

const updateOrCreateEvent = async (happenings: Array<Event>) => {
  const organziers = happenings.flatMap((happening) =>
    happening.organizers.map((organizer) => organizer.slug),
  );

  const foundGroups = await prisma.studentGroup.findMany({
    where: {
      id: {
        in: organziers,
      },
    },
  });

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
            connect: foundGroups.map((group) => ({id: group.id})),
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
            connect: foundGroups.map((group) => ({id: group.id})),
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
  const startTime = new Date().getTime();

  const events = await $fetchAllEvents();
  const bedpresses = await $fetchAllBedpresses();

  if (isErrorMessage(events) || isErrorMessage(bedpresses)) {
    return new Response("Error fetching data from Sanity", {
      status: 500,
    });
  }

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
});
