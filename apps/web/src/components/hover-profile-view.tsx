import { GraduationCap, Info, Mail, Users } from "lucide-react";
import Link from "next/link";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { mailTo } from "@/utils/prefixes";

type HoverUser = {
  name: string | null;
  year: number | null;
  degreeId: string | null;
  email: string;
  alternativeEmail: string | null;
};

export const HoverProfileView = ({ user, group }: { user: HoverUser; group: string }) => {
  return (
    <Popover>
      <PopoverTrigger className="my-auto p-1">
        <Info className="size-5" />
      </PopoverTrigger>
      <PopoverContent className="mx-2 flex w-fit flex-col gap-1">
        <p className="font-bold">{user.name}</p>
        {user.year && user.degreeId && (
          <p className="text-muted-foreground flex">
            <GraduationCap className="my-auto mr-2" />
            {user.year.toString() + ". trinn " + user.degreeId.toUpperCase()}
          </p>
        )}
        {group.length > 0 && (
          <p className="text-muted-foreground flex">
            <Users className="my-auto mr-2" />
            {group}
          </p>
        )}
        <p className="text-muted-foreground flex">
          <Mail className="my-auto mr-2" />
          <Link className="hover:underline" href={mailTo(user.email)}>
            {user.alternativeEmail ?? user.email}
          </Link>
        </p>
      </PopoverContent>
    </Popover>
  );
};
