import { type StudentGroupType } from "@echo-webkom/lib";

import { unoWithAdmin } from "@/api/server";

export const fetchStudentGroupsByType = async (type: StudentGroupType, n: number) => {
  try {
    const studentGroups = await unoWithAdmin.sanity.studentGroups.all({
      type,
      n,
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
  return await unoWithAdmin.sanity.studentGroups.bySlug(slug).catch(() => {
    console.error(`Failed to fetch student group with slug ${slug}`);
    return null;
  });
};
