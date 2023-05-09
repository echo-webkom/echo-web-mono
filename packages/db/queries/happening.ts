import {type Happening} from "@prisma/client";

import {prisma} from "../client";

export const getHappeningBySlug = async (slug: Happening["slug"]) => {
  return await prisma.happening.findUnique({
    where: {slug},
    include: {
      questions: true,
    },
  });
};
