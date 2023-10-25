import { revalidatePath } from "next/cache";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";

export const POST = withBasicAuth(async (request: Request) => {
  const payload = (await request.json()) as {
    path?: string;
  };

  if (payload.path && typeof payload.path === "string") {
    revalidatePath(payload.path);
  } else {
    revalidatePath("/");
  }

  return new Response("OK");
});
