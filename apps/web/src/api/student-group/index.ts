import {type ErrorMessage} from "@/utils/error";
import {groq} from "next-sanity";

import {sanityClient} from "../sanity.client";
import {slugSchema} from "../utils/slug";
import {studentGroupSchema, type StudentGroup, type StudentGroupType} from "./schemas";

export * from "./schemas";

export const studentGroupTypeName: Record<StudentGroupType, string> = {
  board: "Hovedstyret",
  subgroup: "Undergrupper",
  intgroup: "Interessegrupper",
  suborg: "Underorganisasjoner",
};

/**
 *
 * @returns Array of all student group slugs
 */
export const fetchStudentGroupPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "studentGroup"]{ "slug": slug.current }`;
    const result = await sanityClient.fetch<Array<string>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

export const fetchStudentGroupPathsByType = async (
  type: StudentGroupType,
): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "studentGroup" && groupType == $type && !(_id in path('drafts.**'))]{ "slug": slug.current }`;
    const params = {
      type,
    };

    const result = await sanityClient.fetch<Array<string>>(query, params);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch (error) {
    return [];
  }
};

export const fetchStudentGroupsByType = async (
  type: StudentGroupType,
  n: number,
): Promise<Array<StudentGroup> | ErrorMessage> => {
  try {
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
  "description": description {
    no,
    en,
  },
  "imageUrl": image.assets->url,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      "imageUrl": image.asset->url,
      socials,
    },
  },
}[0..$n]
      `;

    const params = {
      type,
      n,
    };

    const res = await sanityClient.fetch<Array<StudentGroup>>(query, params);

    return studentGroupSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to fetch student groups",
    };
  }
};

export const fetchStudentGroupBySlug = async (
  slug: string,
): Promise<StudentGroup | ErrorMessage> => {
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
  "description": description {
    no,
    en,
  },
  "imageUrl": image.assets->url,
  "members": members[] {
    role,
    "profile": profile->{
      _id,
      name,
      "imageUrl": image.asset->url,
      socials,
    },
  },
}[0]
    `;

    const params = {
      slug,
    };

    const result = await sanityClient.fetch<StudentGroup>(query, params);

    return studentGroupSchema.parse(result);
  } catch (error) {
    return {
      message: JSON.stringify(error),
    };
  }
};
