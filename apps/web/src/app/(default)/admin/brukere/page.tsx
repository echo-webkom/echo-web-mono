import { db } from "@echo-webkom/db/serverless";

import { unoWithAdmin } from "@/api/server";
import { type UnoClientType } from "@/api/uno/client";
import { ensureWebkom } from "@/lib/ensure";
import { UserTableView } from "./user-table";

export const dynamic = "force-dynamic";

export type AllUsers = Awaited<ReturnType<UnoClientType["users"]["all"]>>;

export default async function UsersOverview() {
  await ensureWebkom();
  const [users, groups] = await Promise.all([unoWithAdmin.users.all(), db.query.groups.findMany()]);

  return <UserTableView users={users} groups={groups} />;
}
