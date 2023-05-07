import {groq} from "next-sanity";
import {z} from "zod";

import {type StudentGroupType} from "@echo-webkom/lib";

import {sanityClient} from "../client";
import {studentGroupSchema, type StudentGroup} from "./schemas";

export * from "./schemas";

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  BOARD: "Hovedstyret",
  SUBGROUP: "Undergrupper",
  INTGROUP: "Interessegrupper",
  SUBORG: "Underorganisasjoner",
};

export const studentGroupTypeToUrl: Record<StudentGroupType, string> = {
  BOARD: "board",
  SUBGROUP: "subgroup",
  INTGROUP: "intgroup",
  SUBORG: "suborg",
};

export const fetchStudentGroupParams = async () => {
  const query = groq`*[_type == "studentGroup"]{ "slug": slug.current, groupType }`;

  const result = await sanityClient.fetch<Array<{slug: string; pageType: StudentGroupType}>>(query);

  const studentGroupSlugSchema = z.object({
    groupType: z.enum(["board", "subgroup", "intgroup", "suborg"]),
    slug: z.string(),
  });

  const studentGroupPaths = result.map((studentGroup) =>
    studentGroupSlugSchema.parse(studentGroup),
  );

  const paths = studentGroupPaths.map((studentGroup) => {
    return {
      params: {
        groupType: studentGroupTypeToUrl[studentGroup.groupType.toUpperCase() as StudentGroupType],
        slug: studentGroup.slug,
      },
    };
  });

  return paths;
};

export const fetchStudentGroupsByType = async (type: StudentGroupType, n: number) => {
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
    // TODO: Should not be toLowerCase but is because of legacy data
    type: type.toLowerCase(),
    n,
  };

  const res = await sanityClient.fetch<Array<StudentGroup>>(query, params);

  return studentGroupSchema.array().parse(res);
};

export const fetchStudentGroupBySlug = async (slug: string) => {
  try {
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
  } catch {
    throw new Error(`Could not find student group with slug ${slug}`);
  }
};
