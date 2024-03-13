import { z } from "zod";

export const NotificationSchema = z.object({
  _id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  publishedAt: z.string(),
  validTo: z.string(),
})

export type Notification = z.infer<typeof NotificationSchema>;