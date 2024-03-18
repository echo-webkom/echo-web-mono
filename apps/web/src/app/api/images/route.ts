import type { NextRequest } from "next/server";

import { auth } from "@echo-webkom/auth";

import { echoGram } from "@/api/echogram";

export async function POST(req: NextRequest) {
  const user = await auth();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return new Response("Missing userId or file", { status: 400 });
  }

  const response = await echoGram.uploadImage(user.id, file);

  return new Response("OK", {
    status: response.success ? 200 : 400,
  });
}
