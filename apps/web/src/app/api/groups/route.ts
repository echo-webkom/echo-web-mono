import { db } from "@echo-webkom/db";

import { withBearerAuth } from "@/lib/checks/with-bearer-auth";

export const GET = withBearerAuth(async (req) => {
  const feideId = req.nextUrl.searchParams.get("feideId");

  if (!feideId) {
    return new Response("Missing feideId", { status: 400 });
  }

  const account = await db.query.accounts.findFirst({
    where: (account, { and, eq }) =>
      and(eq(account.providerAccountId, feideId), eq(account.provider, "feide")),
  });

  if (!account) {
    return new Response("Unauthorized", { status: 401 });
  }

  const groups = await db.query.usersToGroups
    .findMany({
      where: (utg, { eq }) => eq(utg.userId, account.userId),
    })
    .then((res) => res.map((utg) => utg.groupId));

  return new Response(JSON.stringify(groups), { status: 200 });
});
