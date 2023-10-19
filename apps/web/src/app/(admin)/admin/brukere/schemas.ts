import { z } from "zod";

import { userTypeEnum } from "@echo-webkom/db/schemas";

export const userFormSchema = z.object({
  memberships: z.string().array(),
  type: z.enum(userTypeEnum.enumValues),
});
