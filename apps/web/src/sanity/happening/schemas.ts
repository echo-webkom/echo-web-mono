import { type SanityImageSource } from "@sanity/image-url/lib/types/types";
import { z } from "zod";

import { companySchema } from "../company";
import { locationSchema } from "../location";
import { contactProfileSchema } from "../profile/schemas";
import { studentGroupSchema } from "../student-group";
import { questionSchema } from "../utils/question";
import { spotRangeSchema } from "../utils/spot-range";

export const happeningTypeSchema = z.enum(["event", "bedpres", "external"]);

export type HappeningType = z.infer<typeof happeningTypeSchema>;

export const happeningSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  happeningType: happeningTypeSchema,
  organizers: studentGroupSchema
    .pick({ _id: true, name: true, slug: true })
    .array()
    .nullable()
    .transform((groups) => groups ?? []),
  company: companySchema.nullable(),
  contacts: contactProfileSchema.array().nullable(),
  date: z.string().nullable(),
  cost: z.number().nullable(),
  registrationStartGroups: z.string().nullable(),
  registrationGroups: z.array(z.string()).nullable(),
  registrationStart: z.string().nullable(),
  registrationEnd: z.string().nullable(),
  location: locationSchema.pick({ name: true }).nullable(),
  spotRanges: spotRangeSchema.array().nullable(),
  additionalQuestions: questionSchema.array().nullable(),
  body: z.string().nullable(),
});

export type Happening = z.infer<typeof happeningSchema>;

export type HomeHappening<TType extends HappeningType> = {
  _id: string;
  title: string;
  happeningType: TType;
  date: string;
  slug: string;
  registrationStart: string;
  image: TType extends "bedpres" ? SanityImageSource : null;
  organizers: Array<string>;
};
