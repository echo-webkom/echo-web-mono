import {
  type StudentGroupBySlugQueryResult,
  type StudentGroupsByProfileIdQueryResult,
  type StudentGroupsByTypeQueryResult,
} from "@echo-webkom/cms/types";
import { type StudentGroupType } from "@echo-webkom/lib";
import { client } from "@echo-webkom/sanity";
import {
  studentGroupBySlugQuery,
  studentGroupsByProfileIdQuery,
  studentGroupsByTypeQuery,
} from "@echo-webkom/sanity/queries";

import { sanityFetch } from "./client";

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

export const fetchStudentGroupsByProfileId = async (profileId: string) => {
  try {
    return await client.fetch<StudentGroupsByProfileIdQueryResult>(studentGroupsByProfileIdQuery, {
      profileId,
    });
  } catch {
    return [];
  }
};
