import {type NextApiHandler} from "next";

import {type HappeningType, type PrismaClient} from "@echo-webkom/db";
import {prisma} from "@echo-webkom/db/client";

import {$fetchAllBedpresses, type Bedpres} from "@/api/bedpres";
import {$fetchAllEvents, type Event} from "@/api/event";
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

const handler: NextApiHandler = async (req, res) => {
  if (req.method === "GET") {
    const startTime = new Date().getTime();

    const events = await $fetchAllEvents();
    const bedpresses = await $fetchAllBedpresses();

    if (isErrorMessage(events) || isErrorMessage(bedpresses)) {
      return res.status(500).json({
        message: "Failed to fetch events or bedpresses",
        events: events,
        bedpresses: bedpresses,
      });
    }

    const updatedEvents = await updateOrCreate(prisma, "EVENT", events);
    const updatedBedpresses = await updateOrCreate(prisma, "BEDPRES", bedpresses);

    const endTime = new Date().getTime();
    const totalSeconds = (endTime - startTime) / 1000;

    return res.status(200).json({
      message: "Success",
      events: updatedEvents,
      bedpresses: updatedBedpresses,
      timeInSeconds: totalSeconds,
    });
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
};

export default handler;
