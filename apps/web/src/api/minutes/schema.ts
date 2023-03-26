import {z} from "zod";

export const minuteSchema = z.object({
  _id: z.string(),
  date: z.string(),
  allmote: z.boolean(),
  title: z.string(),
  document: z.string(),
});
export type Minute = z.infer<typeof minuteSchema>;
