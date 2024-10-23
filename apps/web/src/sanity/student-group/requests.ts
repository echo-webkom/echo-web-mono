import {
  type StudentGroupBySlugQueryResult,
  type StudentGroupsByTypeQueryResult,
} from "@echo-webkom/cms/types";
import { type StudentGroupType } from "@echo-webkom/lib";

import { sanityFetch } from "../client";
import { studentGroupBySlugQuery, studentGroupsByTypeQuery } from "./queries";

export const fetchStudentGroupsByType = async (type: StudentGroupType, n: number) => {
  try {
    const studentGroups = await sanityFetch<StudentGroupsByTypeQueryResult>({
      query: studentGroupsByTypeQuery,
      params: {
        type,
        n,
      },
      tags: ["student-groups"],
    });

    if (type !== "board") {
      studentGroups.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      studentGroups.sort((a, b) => b.name.localeCompare(a.name));
    }

    return studentGroups;
  } catch {
    return [];
  }
};

export const fetchStudentGroupBySlug = async (slug: string) => {
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
};
