import {z} from "zod";

export const jobAdSchema = z.object({
  slug: z.string(),
  body: z.string(),
  companyName: z.string(),
  title: z.string(),
  logoUrl: z.string(),
  deadline: z.string(),
  locations: z.array(z.string()),
  advertLink: z.string(),
  jobType: z.enum(["fulltime", "parttime", "internship", "summerjob"]),
  degreeYears: z.array(z.number()),
  _createdAt: z.string(),
  weight: z.number(),
});
export type JobAd = z.infer<typeof jobAdSchema>;
