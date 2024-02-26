import { JOB_TYPES, type JobType } from "@echo-webkom/lib";

export const jobTypeString = (type: JobType) =>
  JOB_TYPES.find((t) => t.value === type)?.title ?? type;
