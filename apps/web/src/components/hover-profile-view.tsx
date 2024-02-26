import Link from "next/link";
import { LuGraduationCap, LuMail, LuUsers } from "react-icons/lu";

import { type User } from "@echo-webkom/db/schemas";

import { mailTo } from "@/utils/prefixes";

export function HoverProfileView({ user, group }: { user: User; group: string }) {
  const email = user.alternativeEmail ?? user.email ?? "";

  return (
    <>
      <div className="absolute left-16 flex flex-row gap-4 rounded-lg border bg-background p-4 text-foreground sm:left-20 ">
        <div className="flex flex-col gap-1">
          <p className="font-bold">{user.name}</p>
          {user.year && user.degreeId && (
            <p className="flex text-muted-foreground">
              <LuGraduationCap className="my-auto mr-2" />
              {user.year.toString() + ". trinn " + user.degreeId.toUpperCase()}
            </p>
          )}
          {group.length > 0 && (
            <p className="flex text-muted-foreground">
              <LuUsers className="my-auto mr-2" />
              {group}
            </p>
          )}
          <p className="flex text-muted-foreground">
            <LuMail className="my-auto mr-2" />
            <Link className="hover:underline" href={mailTo(email)}>
              {user.email}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
