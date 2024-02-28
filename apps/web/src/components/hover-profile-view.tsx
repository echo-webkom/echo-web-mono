import { useRef, useState } from "react";
import Link from "next/link";
import { LuClock, LuGraduationCap, LuMail, LuUsers } from "react-icons/lu";
import { RxInfoCircled } from "react-icons/rx";

import { type User } from "@echo-webkom/db/schemas";

import { useOutsideClick } from "@/hooks/use-outsideclick";
import { shortDateNoYear } from "@/utils/date";
import { mailTo } from "@/utils/prefixes";
import { Button } from "./ui/button";

export function HoverProfileView({
  user,
  group,
  deregisteredAt,
}: {
  user: User;
  group: string;
  deregisteredAt: Date;
}) {
  const [isClicked, setIsClicked] = useState(false);
  const profileRef = useRef(null);

  useOutsideClick(() => setIsClicked(false), [profileRef]);

  return (
    <div className="flex" ref={profileRef}>
      <Button
        className="p-0 hover:bg-transparent"
        variant="ghost"
        onClick={() => setIsClicked(!isClicked)}
      >
        <RxInfoCircled className="size-5 origin-center transition-all hover:size-6" />
      </Button>
      {isClicked && (
        <div className="absolute left-16 flex flex-row gap-4 rounded-lg border bg-background p-4 text-foreground sm:left-24 ">
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
              <Link className="hover:underline" href={mailTo(user.email)}>
                {user.email}
              </Link>
            </p>
            <p className="flex text-muted-foreground">
              <LuClock className="my-auto mr-2" />
              {shortDateNoYear(deregisteredAt)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
