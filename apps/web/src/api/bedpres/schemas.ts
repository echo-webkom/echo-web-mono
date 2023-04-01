import {z} from "zod";

import {companySchema} from "../company";
import {locationSchema} from "../location";
import {contactProfileSchema} from "../profile/schemas";
import {localeMarkdownSchema} from "../utils/locale";
import {questionSchema} from "../utils/question";
import {spotRangeSchema} from "../utils/spot-range";

export const bedpresSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  _updatedAt: z.string(),
  title: z.string(),
  slug: z.string(),
  company: companySchema.pick({_id: true, name: true, imageUrl: true, website: true}),
  contacts: contactProfileSchema.array().nullable(),
  date: z.string().nullable(),
  registrationDate: z.string().nullable(),
  registrationDeadline: z.string().nullable(),
  location: locationSchema.pick({name: true}).nullable(),
  spotRanges: spotRangeSchema.array().nullable(),
  additionalQuestions: questionSchema.array().nullable(),
  body: localeMarkdownSchema.nullable(),
});
export type Bedpres = z.infer<typeof bedpresSchema>;
