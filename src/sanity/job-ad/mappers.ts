import { JOB_TYPES, JobType } from "@/constants";

export const jobTypeString = (type: JobType) =>
  JOB_TYPES.find((t) => t.value === type)?.title ?? type;
