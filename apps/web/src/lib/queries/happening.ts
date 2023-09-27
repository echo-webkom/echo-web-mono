import { type Happening } from "@prisma/client";

import { prisma } from "@echo-webkom/db";

export async function getHappeningBySlug(slug: Happening["slug"]) {
  return await prisma.happening.findUnique({
    where: { slug },
    include: {
      questions: true,
    },
  });
}
