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

export async function atMaxCapacity(happening: Happening) {
  const max = await maxCapacity(happening);
  const registrations = await prisma.registration.count({
    where: {
      happeningSlug: happening.slug,
    }
  })
  return registrations >= max;
  }

export async function maxCapacity(happening?: Happening, slug?: string) {
  if (!happening && !slug) {
    throw new Error("Must provide either happening or slug");
  }
  return (
    await prisma.spotRange.findMany({
      where: {
        happeningSlug: happening ? happening.slug : slug,
      },
    })
  ).reduce((acc, curr) => acc + curr.spots, 0);
}
