import { z } from "zod";

export const spotRangeSchema = z.object({
  minYear: z.number().min(1).max(5),
  maxYear: z.number().min(1).max(5),
  spots: z.number().min(0),
});

export type SpotRange = z.infer<typeof spotRangeSchema>;
