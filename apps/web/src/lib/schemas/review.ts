import { z } from "zod";

export const reviewForm = z.object({
  subjectCode: z.string(),
  difficulty: z
    .number()
    .min(0, { message: "Vurderingen må rangeres fra 0 til 10." })
    .max(10, { message: "Vurderingen må rangeres fra 0 til 10." }),
  usefullness: z
    .number()
    .min(0, { message: "Vurderingen må rangeres fra 0 til 10." })
    .max(10, { message: "Vurderingen må rangeres fra 0 til 10." }),
  enjoyment: z
    .number()
    .min(0, { message: "Vurderingen må rangeres fra 0 til 10." })
    .max(10, { message: "Vurderingen må rangeres fra 0 til 10." }),
});

export type ReviewForm = z.infer<typeof reviewForm>;
