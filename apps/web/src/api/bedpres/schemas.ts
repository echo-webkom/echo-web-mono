import {z} from "zod";

import {companySchema} from "../company";
import {locationSchema} from "../location";
import {contactProfileSchema} from "../profile/schemas";
import {questionSchema} from "../utils/question";
import {spotRangeSchema} from "../utils/spot-range";

export const bedpresSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  company: companySchema.pick({_id: true, name: true, image: true, website: true}),
  contacts: contactProfileSchema.array().nullable(),
  date: z.string().nullable(),
  registrationStart: z.string().nullable(),
  registrationEnd: z.string().nullable(),
  location: locationSchema.pick({name: true}).nullable(),
  spotRanges: spotRangeSchema.array().nullable(),
  additionalQuestions: questionSchema.array().nullable(),
  body: z.string().nullable(),
});
export type Bedpres = z.infer<typeof bedpresSchema>;
