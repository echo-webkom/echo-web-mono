import { type RegistrationStatus } from "@echo-webkom/db/schemas";

import { createProfilePictureUrl } from "@/api/client";
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
  hasImage: boolean;
  name: string | null;
  userId: string;
  status: RegistrationStatus;
};

type ProfilePreviewProps = {
  registration: Registration;
};

const ProfilePreview = ({ registration }: ProfilePreviewProps) => {
  const fallback = initials(registration.name ?? "BO");
  const imageUrl = registration.hasImage ? createProfilePictureUrl(registration.userId) : undefined;

  return (
    <Avatar className="size-8">
      <AvatarImage src={imageUrl} />
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
      return a.hasImage === b.hasImage ? 0 : a.hasImage ? -1 : 1;
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
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <button type="button" className="group flex w-fit items-start">
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
              </button>
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent>
            <p>{names}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
                <Text className="text-muted-foreground">{registration.name}</Text>
              </div>
            ))}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};
