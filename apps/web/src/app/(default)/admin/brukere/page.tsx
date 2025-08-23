import { db } from "@echo-webkom/db/serverless";

import { getAllUsers } from "@/data/users/queries";
import { ensureWebkom } from "@/lib/ensure";
import { UserTableView } from "./user-table";

export const dynamic = "force-dynamic";

export type AllUsers = Awaited<ReturnType<typeof getAllUsers>>;

export default async function UsersOverview() {
  await ensureWebkom();

  const [users, groups] = await Promise.all([getAllUsers(), db.query.groups.findMany()]);
  return <UserTableView users={users} groups={groups} />;
}
