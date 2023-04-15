import {z} from "zod";

export const registrationDatesSchema = z.object({
  date: z.string(),
  registrationStart: z.string(),
  registrationEnd: z.string(),
});
