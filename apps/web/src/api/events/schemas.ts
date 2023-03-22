import {z} from "zod";

export const eventTypeSchema = z.enum(["BEDPRES", "EVENT"]);
export type EventType = z.infer<typeof eventTypeSchema>;

export const questionSchema = z.object({
  questionText: z.string(),
  inputType: z.enum(["radio", "textbox"]),
  alternatives: z.array(z.string()).nullable(),
});
export type Question = z.infer<typeof questionSchema>;

export const spotRangeCounterSchema = z.object({
  spots: z.number(),
  minDegreeYear: z.number(),
  maxDegreeYear: z.number(),
  regCount: z.number(),
  waitListCount: z.number(),
});
export type SpotRangeCount = z.infer<typeof spotRangeCounterSchema>;

export const spotRangeSchema = z.object({
  spots: z.number(),
  minDegreeYear: z.number(),
  maxDegreeYear: z.number(),
});
export type SpotRange = z.infer<typeof spotRangeSchema>;

export const eventSchema = z.object({
  _createdAt: z.string(),
  studentGroupName: z.string(),
  title: z.string(),
  slug: z.string(),
  date: z.string(),
  registrationDate: z.string().nullable(),
  registrationDeadline: z.string().nullable(),
  studentGroupRegistrationDate: z.string().nullable(),
  studentGroups: z.array(z.string()).nullable(),
  onlyForStudentGroups: z.boolean().nullable(),
  body: z.object({
    no: z.string(),
    en: z.string().optional(),
  }),
  deductiblePayment: z.string().nullable(),
  location: z.string(),
  locationLink: z.string().nullable(),
  companyLink: z.string().nullable(),
  logoUrl: z.string().nullable(),
  contactEmail: z.string().nullable(),
  additionalQuestions: z
    .array(questionSchema)
    .nullable()
    .transform((aq) => aq ?? []),
  spotRanges: z
    .array(spotRangeSchema)
    .nullable()
    .transform((sr) => sr ?? [])
    .catch([]),
  happeningType: eventTypeSchema,
});
export type Event = z.infer<typeof eventSchema>;

export const eventPreviewSchema = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  title: z.string(),
  slug: z.string(),
  body: z.object({
    no: z.string(),
    en: z.string().optional(),
  }),
  date: z.string(),
  registrationDate: z.string().nullable(),
  logoUrl: z.string().nullable(),
  happeningType: eventTypeSchema,
  studentGroupName: z.string(),
  spotRange: z
    .array(spotRangeSchema)
    .nullable()
    .transform((sr) => sr ?? [])
    .catch([]),
});
export type EventPreview = z.infer<typeof eventPreviewSchema>;

export const happeningInfoSchema = z.object({
  spotRanges: z.array(spotRangeCounterSchema),
});
export type HappeningInfo = z.infer<typeof happeningInfoSchema>;
