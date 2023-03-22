import {z} from "zod";

const jobTypeSchema = z.enum(["fulltime", "parttime", "internship", "summerjob"]);
export type JobType = z.infer<typeof jobTypeSchema>;

export const jobAdSchema = z.object({
  _id: z.string(),
  slug: z.string(),
  body: z.string(),
  companyName: z.string(),
  title: z.string(),
  logoUrl: z.string(),
  deadline: z.string(),
  locations: z.array(z.string()),
  advertLink: z.string(),
  jobType: jobTypeSchema,
  degreeYears: z.array(z.number()),
  _createdAt: z.string(),
  weight: z.number(),
});
export type JobAd = z.infer<typeof jobAdSchema>;
