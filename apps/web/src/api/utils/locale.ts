import {z} from "zod";

const localeSchema = z.object({
  no: z.string(),
  en: z.string().nullable(),
});

export const localeStringSchema = localeSchema;
export const localeMarkdownSchema = localeSchema;

export type LocaleString = z.infer<typeof localeStringSchema>;
export type LocaleMarkdown = z.infer<typeof localeMarkdownSchema>;
