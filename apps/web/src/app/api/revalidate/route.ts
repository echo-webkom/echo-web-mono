import { revalidatePath, revalidateTag } from "next/cache";

import { createBasicAuthRoute } from "@/lib/factories/route";

export const POST = createBasicAuthRoute({
  adminKey: process.env.ADMIN_KEY ?? "",
  handler: async (req) => {
    try {
      const json = (await req.json()) as { tag: string } | { path: string };

      if ("tag" in json) {
        revalidateTag(json.tag);

        return new Response("Revalidated", { status: 200 });
      }

      if ("path" in json) {
        revalidatePath(json.path);

        return new Response("Revalidated", { status: 200 });
      }

      return new Response("Bad request", { status: 400 });
    } catch (error) {
      if (error instanceof TypeError) {
        return new Response("Bad request", { status: 400 });
      }

      return new Response("Internal server error", { status: 500 });
    }
  },
});
