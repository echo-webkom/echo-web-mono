/* eslint-disable no-console */
import { revalidateTag } from "next/cache";
import { log } from "next-axiom";

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
    const { type } = (await req.json()) as {
      operation: "create" | "update" | "delete";
      documentId: string;
      type: string;
      slug: string | null;
    };

    log.info("Revalidating static content", {
      type,
    });

    if (type === "staticInfo") {
      console.log("Revalidating static-info");
      revalidateTags(["static-info"]);
    }

    if (type === "job") {
      console.log("Revalidating job-ads");
      revalidateTags(["job-ads"]);
    }

    if (type === "post") {
      console.log("Revalidating posts");
      revalidateTags(["posts"]);
    }

    if (type === "meetingMinute") {
      console.log("Revalidating minutes");
      revalidateTags(["minutes"]);
    }

    if (type === "studentGroup") {
      console.log("Revalidating student-groups");
      revalidateTags(["student-groups"]);
    }

    if (type === "movie") {
      console.log("Revalidating movies");
      revalidateTags(["movies"]);
    }

    return new Response(`Revalidated type: "${type}".`, {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof SyntaxError) {
      return new Response("Invalid request", { status: 400 });
    }

    return new Response("Invalid request", { status: 400 });
  }
});
