import { revalidateTag } from "next/cache";

import { withBasicAuth } from "@/lib/checks/with-basic-auth";

const typeToRevalidate = {
  post: ["posts"],
  company: ["jobAds"],
  job: ["jobAds"],
  profile: [""],
  staticInfo: ["staticInfo"],
};

const revalidateTags = (tags: Array<string>) => {
  for (const tag of tags) {
    revalidateTag(tag);
  }
};

const isValidType = (type: string): type is keyof typeof typeToRevalidate =>
  Object.keys(typeToRevalidate).includes(type);

export const POST = withBasicAuth(async (req) => {
  try {
    const { type } = (await req.json()) as { type: string };

    if (isValidType(type)) {
      revalidateTags(typeToRevalidate[type]);
      return new Response(`Revalidated ${type}`, { status: 200 });
    }

    return new Response(`We have not implemented ${type} yet.`, {
      status: 400,
    });
  } catch {
    return new Response("Invalid request", { status: 400 });
  }
});
