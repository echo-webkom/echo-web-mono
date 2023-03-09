import {groq} from "next-sanity";
import {sanityClient} from "../sanity.client";
import {JobAd, jobAdSchema} from "./schemas";
import {slugSchema} from "@/utils/slug";
import {ErrorMessage} from "@/utils/error";

export * from "./schemas";

/**
 * @returns Array of slugs for all job ads
 */
export const fetchJobAdPaths = async (): Promise<Array<string>> => {
  try {
    const query = groq`*[_type == "jobAdvert"]{ "slug": slug.current }`;
    const result = await sanityClient.fetch<Array<string>>(query);

    return slugSchema
      .array()
      .parse(result)
      .map((nestedSlug) => nestedSlug.slug);
  } catch {
    return [];
  }
};

/**
 * @param n - number of job ads to fetch
 * @returns Array of job ads or an error message
 */
export const fetchJobAds = async (n: number): Promise<Array<JobAd>> => {
  try {
    const query = groq`
        *[_type == "jobAdvert"
          && !(_id in path('drafts.**'))]
          | order(_createdAt desc) [0..$n]
        {
          "slug": slug.current,
          body,
          companyName,
          title,
          "logoUrl": logo.asset -> url,
          deadline,
          locations,
          advertLink,
          jobType,
          degreeYears,
          _createdAt,
          weight
        }
      `;

    const params = {
      n,
    };

    const result = await sanityClient.fetch<Array<JobAd>>(query, params);

    return jobAdSchema.array().parse(result);
  } catch {
    return [];
  }
};

/**
 * @param slug - slug of job ad to fetch
 * @returns Job ad or an error message
 */
export const fetchJobAdBySlug = async (
  slug: string,
): Promise<JobAd | ErrorMessage> => {
  try {
    const query = groq`
          *[_type == "jobAdvert" && slug.current == "${slug}"
            && !(_id in path('drafts.**'))] {
              "slug": slug.current,
              body,
              companyName,
              title,
              "logoUrl": logo.asset -> url,
              deadline,
              locations,
              advertLink,
              jobType,
              degreeYears,
              _createdAt,
              weight
          }[0]
        `;

    const result = await sanityClient.fetch<JobAd>(query);

    return jobAdSchema.parse(result);
  } catch {
    return {
      message: "Error fetching job ad",
    };
  }
};
