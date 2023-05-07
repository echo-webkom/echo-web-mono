import {NextResponse} from "next/server";

import {type HappeningType, type PrismaClient} from "@echo-webkom/db";
import {prisma} from "@echo-webkom/db/client";

import {$fetchAllBedpresses, type Bedpres} from "@/sanity/bedpres";
import {$fetchAllEvents, type Event} from "@/sanity/event";
import {isErrorMessage} from "@/utils/error";

const updateOrCreate = async (
  prisma: PrismaClient,
  type: HappeningType,
  happenings: Array<Event | Bedpres>,
) => {
  return await prisma.$transaction(
    happenings.map((happening) =>
      prisma.happening.upsert({
        where: {
          slug: happening.slug,
        },
        create: {
          slug: happening.slug,
          type,
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

export async function GET() {
  const startTime = new Date().getTime();

  const events = await $fetchAllEvents();
  const bedpresses = await $fetchAllBedpresses();

  if (isErrorMessage(events) || isErrorMessage(bedpresses)) {
    return new Response("Error fetching data from Sanity", {
      status: 500,
    });
  }

  const updatedEvents = await updateOrCreate(prisma, "EVENT", events);
  const updatedBedpresses = await updateOrCreate(prisma, "BEDPRES", bedpresses);

  const endTime = new Date().getTime();
  const totalSeconds = (endTime - startTime) / 1000;

  return NextResponse.json({
    message: "Success",
    events: updatedEvents,
    bedpresses: updatedBedpresses,
    timeInSeconds: totalSeconds,
  });
}
