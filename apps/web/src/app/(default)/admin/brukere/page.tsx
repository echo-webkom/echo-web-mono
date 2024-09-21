import { RxDotsHorizontal as Dots } from "react-icons/rx";

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/data/users/queries";
import { ensureWebkom } from "@/lib/ensure";
import { UserTableView } from "./user_table_view";

export const dynamic = "force-dynamic";

export type AllUsers = Awaited<ReturnType<typeof getAllUsers>>;

export default async function UsersOverview() {
  await ensureWebkom();

  const [users, groups] = await Promise.all([getAllUsers(), db.query.groups.findMany()]);
  return <UserTableView users={users} groups={groups} />;
}
