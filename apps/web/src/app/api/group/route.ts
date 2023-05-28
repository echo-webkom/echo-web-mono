import {NextResponse} from "next/server";
import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {getUser} from "@/lib/session";

const payloadSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return new Response("Unauthorized", {status: 401});
  }

  if (user.type !== "ADMIN") {
    return new Response("Forbidden", {status: 403});
  }

  const payload = payloadSchema.safeParse(await request.json());

  if (!payload.success) {
    return new Response(payload.error.message, {status: 400});
  }

  const {id, name} = payload.data;

  const group = await prisma.studentGroup.create({
    data: {
      id,
      name,
    },
  });

  return NextResponse.json(group, {status: 201});
}
