import { revalidateTag } from "next/cache";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";

const revalidateTags = (tags: Array<string>) => {
  for (const tag of tags) {
    revalidateTag(tag);
  }
};

/**
 * Updates static content on the site.
 *
 * Data is sent from a GROQ projection in Sanity:
 * ```
 * {
 *   "operation": delta::operation(),
 *   "documentId": _id,
 *   "type": _type,
 *   "slug": slug.current,
 * }
 * ```
 */
export const POST = withBasicAuth(async (req) => {
  try {
    const { type, slug } = (await req.json()) as {
      operation: "create" | "update" | "delete";
      documentId: string;
      type: string;
      slug: string | null;
    };

    if (type === "staticInfo") {
      revalidateTags(["static-info"]);
    }

    if (type === "jobAds") {
      revalidateTags(["job-ads"]);
    }

    if (type === "posts") {
      revalidateTags(["posts"]);
    }

    if (type === "meetingMinute") {
      revalidateTags(["minutes"]);
    }

    if (type === "studentGroup") {
      revalidateTags(["student-groups"]);
      if (slug) {
        revalidateTags([`student-group-${slug}`]);
      }
    }

    return new Response(`Revalidated type: "${type}".`, {
      status: 200,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(error);
      return new Response("Invalid request", { status: 400 });
    }

    return new Response("Invalid request", { status: 400 });
  }
});
