import { type StudentGroupType } from "@echo-webkom/lib";

import { sanityFetch } from "../client";
import { studentGroupBySlugQuery, studentGroupsByTypeQuery } from "./queries";
import { studentGroupSchema } from "./schemas";

export async function fetchStudentGroupsByType(type: StudentGroupType, n: number) {
  const orderDir = type === "board" ? "desc" : "asc";

  try {
    return await sanityFetch({
      query: studentGroupsByTypeQuery(orderDir),
      params: {
        type,
        n,
      },
      tags: ["student-groups"],
    }).then((res) => studentGroupSchema.array().parse(res));
  } catch {
    return [];
  }
}

export async function fetchStudentGroupBySlug(slug: string) {
  try {
    return await sanityFetch({
      query: studentGroupBySlugQuery,
      params: {
        slug,
      },
      tags: [`student-groups`],
    }).then((res) => studentGroupSchema.parse(res));
  } catch {
    return null;
  }
}
