import { unoWithAdmin } from "@/api/server";
import { type UnoReturnType } from "@/api/uno/client";
import { ensureWebkom } from "@/lib/ensure";
import { UserTableView } from "./user-table";

export type AllUsers = UnoReturnType["users"]["all"];

export default async function UsersOverview() {
  await ensureWebkom();
  const [users, groups] = await Promise.all([unoWithAdmin.users.all(), unoWithAdmin.groups.all()]);

  return <UserTableView users={users} groups={groups} />;
}
