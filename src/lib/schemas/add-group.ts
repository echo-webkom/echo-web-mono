import { z } from "zod";

export const groupFormSchema = z.object({
  id: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
});
export type GroupForm = z.infer<typeof groupFormSchema>;
