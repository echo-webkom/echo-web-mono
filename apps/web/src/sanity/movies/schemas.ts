import { z } from "zod";
import { imageSchema } from "../utils/image";

export const moviesSchema = z.object({

    title: z.string(),
    date: z.string(),
    link: z.string(),
    Image: imageSchema,

})