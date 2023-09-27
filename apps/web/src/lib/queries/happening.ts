import { Prisma } from "@prisma/client";

import { prisma, type Happening } from "@echo-webkom/db";

import { type Result } from "./utils";

const happeningWithQuestions = Prisma.validator<Prisma.HappeningDefaultArgs>()({
  include: {
    questions: true,
  },
});

type HappeningWithQuestions = Prisma.HappeningGetPayload<typeof happeningWithQuestions> | null;

export async function getHappeningBySlug(
  slug: Happening["slug"],
): Promise<Result<HappeningWithQuestions>> {
  try {
    const data = await prisma.happening.findUnique({
      where: { slug },
      include: {
        questions: true,
      },
    });

    return {
      data,
    };
  } catch {
    return {
      error: "Failed to get happening",
    };
  }
}
