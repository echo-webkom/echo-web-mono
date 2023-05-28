import {z} from "zod";

import {prisma} from "@echo-webkom/db/client";

import {getUser} from "@/lib/session";

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export async function DELETE(_request: Request, context: z.infer<typeof routeContextSchema>) {
  const parsedContext = routeContextSchema.safeParse(context);
  if (!parsedContext.success) {
    return new Response(undefined, {status: 500});
  }

  const {id} = parsedContext.data.params;

  const user = await getUser();
  if (!user) {
    return new Response("Unauthorized", {status: 401});
  }

  if (user.type !== "ADMIN") {
    return new Response("Forbidden", {status: 403});
  }

  await prisma.studentGroup.delete({
    where: {
      id,
    },
  });

  return new Response(`Student group with id, ${id}, deleted.`, {status: 200});
}
