import Image from "next/image";
import Link from "next/link";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuGraduationCap, LuMail, LuUsers } from "react-icons/lu";
import { RxEnvelopeClosed, RxHome, RxPerson, RxRocket } from "react-icons/rx";

import { type User } from "@echo-webkom/db/schemas";

import { mailTo } from "@/utils/prefixes";

export function HoverProfileView({
  user,
  group,
  reason,
}: {
  user: User;
  group: string;
  reason?: string;
}) {
  const email = user.alternativeEmail ?? user.email ?? "";

  return (
    <>
      <div className="absolute left-16 flex flex-row gap-4 rounded-lg border bg-background p-4 text-foreground sm:left-20 ">
        <div
          className="m-1 my-auto flex h-16 w-16 items-center justify-center rounded-full
              border border-foreground bg-transparent text-foreground"
        >
          {" "}
          <RxPerson className="text-4xl" />
        </div>
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
