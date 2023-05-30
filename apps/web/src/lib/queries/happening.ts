import {cache} from "react";
import {type Happening} from "@prisma/client";

import {prisma} from "@echo-webkom/db/client";

export const getHappeningBySlug = cache(async (slug: Happening["slug"]) => {
  return await prisma.happening.findUnique({
    where: {slug},
    include: {
      questions: true,
    },
  });
});
