import Link from "next/link";
import { LuGraduationCap, LuMail, LuUsers } from "react-icons/lu";
import { RxInfoCircled } from "react-icons/rx";

import { type User } from "@echo-webkom/db/schemas";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mailTo } from "@/utils/prefixes";

export const HoverProfileView = ({ user, group }: { user: User; group: string }) => {
  return (
    <Popover>
      <PopoverTrigger className="my-auto p-1">
        <RxInfoCircled className="size-5" />
      </PopoverTrigger>
      <PopoverContent className="mx-2 flex w-fit flex-col gap-1">
        <p className="font-bold">{user.name}</p>
        {user.year && user.degreeId && (
          <p className="text-muted-foreground flex">
            <LuGraduationCap className="my-auto mr-2" />
            {user.year.toString() + ". trinn " + user.degreeId.toUpperCase()}
          </p>
        )}
        {group.length > 0 && (
          <p className="text-muted-foreground flex">
            <LuUsers className="my-auto mr-2" />
            {group}
          </p>
        )}
        <p className="text-muted-foreground flex">
          <LuMail className="my-auto mr-2" />
          <Link className="hover:underline" href={mailTo(user.email)}>
            {user.alternativeEmail ?? user.email}
          </Link>
        </p>
      </PopoverContent>
    </Popover>
  );
};
