import { groq } from "next-sanity";
import { z } from "zod";

import { type StudentGroupType } from "@echo-webkom/lib";

import { sanityFetch } from "../client";
import { studentGroupSchema, type StudentGroup } from "./schemas";

export * from "./schemas";

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  BOARD: "Hovedstyre",
  SUBGROUP: "Undergrupper",
  INTGROUP: "Interessegrupper",
  SUBORG: "Underorganisasjoner",
  SPORT: "Idrettslag",
} as const;

export async function fetchStudentGroupParams() {
  const query = groq`*[_type == "studentGroup"]{ "slug": slug.current, groupType }`;

  const result = await sanityFetch<Array<{ slug: string; groupType: StudentGroupType }>>({
    query,
    tags: [],
  });

  const studentGroupSlugSchema = z.object({
    slug: z.string(),
    groupType: z.enum(["BOARD", "SUBGROUP", "INTGROUP", "SUBORG", "SPORT"]),
  });

  const studentGroupPaths = result.map((studentGroup) =>
    studentGroupSlugSchema.parse(studentGroup),
  );

  const paths = studentGroupPaths.map((studentGroup) => ({
    groupType: studentGroupTypeName[studentGroup.groupType].toLowerCase(),
    slug: studentGroup.slug,
  }));

  return paths;
}

export async function fetchStudentGroupsByType(type: StudentGroupType, n: number) {
  const query = groq`
*[_type == "studentGroup"
  && groupType == $type
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  name,
  groupType,
  "slug": slug.current,
  description,
  image,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      image,
      socials,
    },
  },
  "socials": socials {
    facebook,
    instagram,
    linkedin,
    email,
  },
}[0..$n]
      `;

  const params = {
    type,
    n,
  };

  const res = await sanityFetch<Array<StudentGroup>>({
    query,
    params,
    tags: [`student-group-${type}`],
  });

  return studentGroupSchema.array().parse(res);
}

export async function fetchStudentGroupBySlug(slug: string) {
  const query = groq`
*[_type == "studentGroup"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
  _id,
  _createdAt,
  _updatedAt,
  name,
  groupType,
  "slug": slug.current,
  description,
  image,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      image,
      socials,
    },
  },
  "socials": socials {
    facebook,
    instagram,
    linkedin,
    email,
  },
}[0]
    `;

  const params = {
    slug,
  };

  const result = await sanityFetch<StudentGroup>({
    query,
    params,
    tags: [`student-group-${slug}`],
  });

  return studentGroupSchema.parse(result);
}
