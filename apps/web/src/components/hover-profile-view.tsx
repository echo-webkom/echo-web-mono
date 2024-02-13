import Link from "next/link";

import { type User } from "@echo-webkom/db/schemas";

import { mailTo } from "@/utils/prefixes";

export function HoverProfileView({
  user,
  group,
  reason,
}: {
  user: User;
  group: string;
  reason: string;
}) {
  const email = user.alternativeEmail ?? user.email ?? "";

  return (
    <div>
      <div className="absolute left-16 flex flex-col gap-2 rounded-lg border bg-background p-4 text-foreground sm:left-20 ">
        <div className="flex w-full justify-between">
          <p>
            <span className="font-bold">Årstrinn:</span> {user.year}
          </p>
        </div>
        <p>
          <span className="font-bold">E-post:</span>{" "}
          <Link className="hover:underline" href={mailTo(email)}>
            {user.email}
          </Link>
        </p>
        {group.length > 0 && (
          <p>
            <span className="font-bold">Medlem av:</span>
            {group}
          </p>
        )}
        {reason.length > 0 && (
          <p>
            <span className="font-bold">Grunn: </span>
            {reason}
          </p>
        )}
      </div>
    </div>
  );
}
