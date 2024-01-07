import { type JobType } from "./schemas";

export const jobTypeToString: Record<JobType, string> = {
  fulltime: "Fulltid",
  parttime: "Deltid",
  internship: "Internship",
  summerjob: "Sommerjobb",
};
