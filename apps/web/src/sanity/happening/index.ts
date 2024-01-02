import { groq } from "next-sanity";

import { type QueryParams } from "@/components/event-filter";
import { type ErrorMessage } from "@/utils/error";
import { sanityClient, sanityFetch } from "../client";
import { happeningSchema, happeningTypeSchema, type Happening } from "./schemas";

const happeningPartial = groq`
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  happeningType,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
  "organizers": organizers[]->{
    _id,
    name,
    "slug": slug.current
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "date": date,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  body
`;

export async function fetchUpcomingHappening(type: "event" | "bedpres", n: number) {
  const query = groq`
*[_type == "happening"
  && happeningType == $type
  && !(_id in path('drafts.**'))
  && date >= now()]
  | order(date asc)
  [0...$n] {
  ${happeningPartial}
}
    `;

  const params = {
    n: n > 0 ? n : -1,
    type,
  };

  try {
    const res = await sanityFetch<Array<Happening>>({
      query,
      params,
      tags: ["upcoming-happenings"],
    });

    return happeningSchema.array().parse(res);
  } catch (error) {
    return null;
  }
}

export async function fetchHappeningBySlug(slug: string) {
  const query = groq`
*[_type == "happening"
  && slug.current == $slug
  && !(_id in path('drafts.**'))] {
${happeningPartial}
}[0]
    `;

  const params = {
    slug,
  };

  try {
    const res = await sanityFetch<Happening>({
      query,
      params,
      tags: [`happening-${slug}`],
    });

    return happeningSchema.parse(res);
  } catch (error) {
    return null;
  }
}

export const fetchFilteredHappening = async (
  q: QueryParams,
): Promise<Array<Happening> | ErrorMessage> => {
  const conditions = [
    `_type == "happening"`,
    `!(_id in path('drafts.**'))`,
    q.type === "all" ? null : `happeningType == "${q.type}"`,
    q.open ? `registrationStart <= now() && registrationEnd > now()` : null,
    q.past ? `date < now()` : `date >= now()`,
    q.search ? `title match "*${q.search}*"` : null,
  ].filter(Boolean);

  try {
    const query = groq`
*[${conditions.join(" && ")}] {
  ${happeningPartial}
}
    `;

    const res = await sanityFetch<Array<Happening>>({
      query,
      tags: ["filtered-bedpresses"],
    });

    return happeningSchema.array().parse(res);
  } catch (error) {
    console.error(error);
    return {
      message: "Could not fetch bedpres.",
    };
  }
};

export async function getHappeningTypeBySlug(slug: string) {
  try {
    const query = groq`
*[_type == "happening" && slug.current == $slug] {
  happeningType,
}.happeningType
`;

    return await sanityClient.fetch(query, { slug }).then((res) => happeningTypeSchema.parse(res));
  } catch {
    return null;
  }
}
