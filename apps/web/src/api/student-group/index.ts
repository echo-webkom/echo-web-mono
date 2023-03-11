import { groq } from "next-sanity";
import { sanityClient } from "../sanity.client";
import {
  type StudentGroup,
  studentGroupSchema,
  type StudentGroupType,
} from "./schemas";
import { slugSchema } from "@/utils/slug";
import { type ErrorMessage } from "@/utils/error";

export * from "./schemas";

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
  type: StudentGroupType
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
  type: StudentGroupType
): Promise<Array<StudentGroup> | ErrorMessage> => {
  try {
    const query = groq`
          *[_type == "studentGroup" && groupType == $type && !(_id in path('drafts.**'))] | order(name) {
              name,
              "slug": slug.current,
              info,
              "imageUrl": grpPicture.asset -> url,
              "members": members[] {
                  role,
                  "profile": profile -> {
                      name,
                      "imageUrl": picture.asset -> url
                  }
              }
          }
      `;
    const params = {
      type,
    };

    const result = await sanityClient.fetch<Array<StudentGroup>>(query, params);

    return studentGroupSchema.array().parse(result);
  } catch (error) {
    return {
      message: JSON.stringify(error),
    };
  }
};

export const fetchStudentGroupBySlug = async (
  slug: string
): Promise<StudentGroup | ErrorMessage> => {
  try {
    const query = groq`
          *[_type == "studentGroup" && slug.current == $slug && !(_id in path('drafts.**'))] | order(name) {
              name,
              "slug": slug.current,
              info,
              "imageUrl": grpPicture.asset -> url,
              "members": members[] {
                  role,
                  "profile": profile -> {
                      name,
                      "imageUrl": picture.asset -> url
                  }
              }
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
