import {type Registration} from "@prisma/client";

import {prisma} from "../client";

export const getRegistrationsBySlug = async (slug: Registration["happeningSlug"]) => {
  return await prisma.registration.findMany({
    where: {
      happeningSlug: slug,
    },
  });
};
