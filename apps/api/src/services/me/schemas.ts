import { z } from "zod";

import { degreeEnum, yearEnum } from "@echo-webkom/storage";

export const updateSelfSchema = z.object({
  firstName: z.string().nonempty().optional(),
  lastName: z.string().nonempty().optional(),
  email: z.string().email().optional(),
  degree: z.enum(degreeEnum.enumValues).optional(),
  year: z.enum(yearEnum.enumValues).optional(),
});
