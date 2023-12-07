import { groq } from "next-sanity";
import { z } from "zod";

import { type StudentGroupType } from "@echo-webkom/lib";

import { sanityClient } from "../client";
import { studentGroupSchema, studentGroupTypes, type StudentGroup } from "./schemas";

export * from "./schemas";

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  board: "Hovedstyre",
  subgroup: "Undergrupper",
  intgroup: "Interessegrupper",
  suborg: "Underorganisasjoner",
  sport: "Idrettslag",
  hidden: "Skjult",
} as const;

export async function fetchStudentGroupParams() {
  const query = groq`*[_type == "studentGroup" && groupType != "hidden"]{ "slug": slug.current, groupType }`;

  const result =
    await sanityClient.fetch<Array<{ slug: string; groupType: StudentGroupType }>>(query);

  const studentGroupSlugSchema = z.object({
    slug: z.string(),
    groupType: z.enum(studentGroupTypes),
  });

  const studentGroupPaths = result.map((studentGroup) =>
    studentGroupSlugSchema.parse(studentGroup),
  );

  const paths = studentGroupPaths
    .filter((studentGroup) => studentGroup.groupType !== "hidden")
    .map((studentGroup) => ({
      groupType: studentGroupTypeName[studentGroup.groupType],
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

  const result = await sanityClient.fetch<Array<StudentGroup>>(query, params);

  return studentGroupSchema.array().parse(result);
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

  const result = await sanityClient.fetch<StudentGroup>(query, params);

  return studentGroupSchema.parse(result);
}
