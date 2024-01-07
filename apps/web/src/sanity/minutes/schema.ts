import { z } from "zod";

export const minuteSchema = z.object({
  _id: z.string(),
  title: z.string(),
  date: z.string(),
  isAllMeeting: z.boolean(),
  document: z.string(),
});

export type Minute = z.infer<typeof minuteSchema>;

export const idSchema = z.object({
  id: z.string(),
});
