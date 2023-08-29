import { z } from "zod";

import { locationSchema } from "../location";
import { contactProfileSchema } from "../profile/schemas";
import { studentGroupSchema } from "../student-group";
import { questionSchema } from "../utils/question";
import { spotRangeSchema } from "../utils/spot-range";

export const eventSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  organizers: studentGroupSchema.pick({ _id: true, name: true, slug: true }).array(),
  contacts: contactProfileSchema.array().nullable(),
  date: z.string().nullable(),
  registrationStart: z.string().nullable(),
  registrationEnd: z.string().nullable(),
  location: locationSchema.pick({ name: true }).nullable(),
  spotRanges: spotRangeSchema.array().nullable(),
  additionalQuestions: questionSchema.array().nullable(),
  body: z.string().nullable(),
});

export type Event = z.infer<typeof eventSchema>;
