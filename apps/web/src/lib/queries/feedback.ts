import {cache} from "react";

import {prisma} from "@echo-webkom/db/client";

export const getAllFeedback = cache(async () => {
  return await prisma.siteFeedback.findMany();
});
