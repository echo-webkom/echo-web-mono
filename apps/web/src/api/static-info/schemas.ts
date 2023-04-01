import {z} from "zod";

import {localeMarkdownSchema} from "../utils/locale";

export const staticInfoSchema = z.object({
  title: z.string(),
  slug: z.string(),
  pageType: z.enum(["ABOUT", "STUDENTS", "COMPANIES"]),
  body: localeMarkdownSchema,
});
export type StaticInfo = z.infer<typeof staticInfoSchema>;
