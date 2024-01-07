import { type StudentGroupType } from "@echo-webkom/lib";

import { sanityFetch } from "../client";
import { studentGroupTypeName } from "./mappers";
import {
  studentGroupBySlugQuery,
  studentGroupPathsQuery,
  studentGroupsByTypeQuery,
} from "./queries";
import { studentGroupSchema, studentGroupSlugSchema } from "./schemas";

/**
 *
 * @returns
 */
export async function fetchStudentGroupParams() {
  try {
    const allPaths = await sanityFetch({
      query: studentGroupPathsQuery,
      tags: ["student-group-params"],
    }).then((res) => studentGroupSlugSchema.array().parse(res));

    return allPaths
      .filter((path) => path.groupType !== "hidden")
      .map((path) => ({
        groupType: studentGroupTypeName[path.groupType],
        slug: path.slug,
      }));
  } catch {
    return [];
  }
}

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
      tags: [`student-group-${slug}`],
    }).then((res) => studentGroupSchema.parse(res));
  } catch {
    return null;
  }
}
