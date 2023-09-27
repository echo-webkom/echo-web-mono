import { z } from "zod";

export const spotRangeSchema = z.object({
  minDegreeYear: z.number().min(1).max(5),
  maxDegreeYear: z.number().min(1).max(5),
  spots: z.number().min(0),
});

export type SpotRange = z.infer<typeof spotRangeSchema>;
