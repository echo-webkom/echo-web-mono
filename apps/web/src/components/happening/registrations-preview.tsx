import Link from "next/link";

import { type RegistrationStatus } from "@echo-webkom/db/schemas";

import { initials } from "@/utils/string";
import { Text } from "../typography/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type Registration = {
  image: string | null;
  name: string | null;
  userId: string;
  status: RegistrationStatus;
};

type ProfilePreviewProps = {
  registration: Registration;
};

const ProfilePreview = ({ registration }: ProfilePreviewProps) => {
  const fallback = initials(registration.name ?? "BO");

  return (
    <Avatar className="size-8">
      <AvatarImage src={registration.image ?? ""} />
      <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
    </Avatar>
  );
};

type RegistrationsPreviewProps = {
  registrations: Array<Registration>;
};

const MAX = 13;

export const RegistrationsPreview = ({ registrations }: RegistrationsPreviewProps) => {
  const sorted = registrations
    .filter((registration) => registration.status === "registered")
    .sort((a, b) => {
      if (a.image && !b.image) {
        return -1;
      } else if (!a.image && b.image) {
        return 1;
      }
      return 0;
    })
    .slice(0, MAX);

  if (sorted.length < 3) {
    return null;
  }

  const extra =
    registrations.filter((registration) => registration.status === "registered").length - MAX;
  const names = `${sorted.map((registration) => registration.name?.split(" ")[0]).join(", ")}${
    extra > 0 ? ` +${extra}` : ""
  }`;

  return (
    <Dialog>
      <DialogTrigger className="group flex w-fit items-start">
        <TooltipProvider>
          <Tooltip>
            <div>
              <TooltipTrigger>
                <div className="flex items-center">
                  <div className="flex items-center -space-x-4">
                    {sorted.map((registration) => (
                      <ProfilePreview key={registration.userId} registration={registration} />
                    ))}
                  </div>
                  {extra > 0 && (
                    <div className="ml-2 text-sm font-medium text-gray-600 group-hover:underline">
                      +{extra}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
            </div>
            <TooltipContent>
              <p>{names}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Påmeldte brukere</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {registrations
            .filter((registration) => registration.status === "registered")
            .map((registration) => (
              <div key={registration.userId} className="flex items-center space-x-4">
                <ProfilePreview registration={registration} />
                <Link href={`/profile/${registration.userId}`} className="hover:underline">
                  <Text className="text-muted-foreground">{registration.name}</Text>
                </Link>
              </div>
            ))}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
