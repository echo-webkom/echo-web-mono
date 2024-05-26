import { type StudentGroupType } from "@echo-webkom/lib";

import {
  type StudentGroupBySlugQueryResult,
  type StudentGroupsByTypeQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "../client";
import { studentGroupBySlugQuery, studentGroupsByTypeQuery } from "./queries";

export async function fetchStudentGroupsByType(type: StudentGroupType, n: number) {
  try {
    const studentGroups = await sanityFetch<StudentGroupsByTypeQueryResult>({
      query: studentGroupsByTypeQuery,
      params: {
        type,
        n,
      },
      tags: ["student-groups"],
    });

    if (type === "board") {
      studentGroups.sort((a, b) => a.name.localeCompare(b.name));
    }

    return studentGroups;
  } catch {
    return [];
  }
}

export async function fetchStudentGroupBySlug(slug: string) {
  try {
    return await sanityFetch<StudentGroupBySlugQueryResult>({
      query: studentGroupBySlugQuery,
      params: {
        slug,
      },
      tags: ["student-groups"],
    });
  } catch {
    return null;
  }
}
