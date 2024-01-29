import Link from "next/link";
import { RxBell } from "react-icons/rx";

import { type Group, type User, type UsersToGroups } from "@echo-webkom/db/schemas";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NotificationButtonProps = {};

export default function NotificationButton() {
  function displayNotifications() {
    const notifications = [];
    return (
    <DropdownMenuItem asChild>
      <span>Her kommer det vars12312312p938712893712980371929083217ler del3</span>
    </DropdownMenuItem>);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <RxBell className="h-7 w-7" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-3 w-56">
        <DropdownMenuLabel>
          <p className="font-normal">Varsler</p>
        </DropdownMenuLabel>
        {displayNotifications()}
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href="/auth/profil">
            <span>Her kommer det varsler</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <span>Her kommer det varsler2</span>
        </DropdownMenuItem>


      </DropdownMenuContent>
    </DropdownMenu>
  );
}
