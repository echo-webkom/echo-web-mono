import { type Registration, type User } from "@echo-webkom/db/schemas";

import { ellipsis, initials } from "@/utils/string";
import { Text } from "../typography/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type ProfilePreviewProps = {
  user: User;
};

const ProfilePreview = ({ user }: ProfilePreviewProps) => {
  const fallback = initials(user.name ?? "BO");

  return (
    <Avatar className="size-8">
      <AvatarImage src={user.image ?? ""} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};

type RegistrationsPreviewProps = {
  registrations: Array<
    Registration & {
      user: User;
    }
  >;
};

const MAX = 7;

export const RegistrationsPreview = ({ registrations }: RegistrationsPreviewProps) => {
  const sorted = registrations
    .filter((registration) => registration.status === "registered")
    .sort((a, b) => {
      if (a.user.image && !b.user.image) {
        return -1;
      } else if (!a.user.image && b.user.image) {
        return 1;
      }
      return 0;
    })
    .slice(0, MAX);

  if (sorted.length < 3) {
    return null;
  }

  const extra = registrations.length - MAX;
  const names = `${sorted.map((registration) => ellipsis(registration.user?.name ?? "", 7)).join(", ")}${
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
                      <ProfilePreview key={registration.user.id} user={registration.user} />
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
        <div className="px-4 pb-4">
          {registrations
            .filter((registration) => registration.status === "registered")
            .map((registration) => (
              <div key={registration.userId} className="flex items-center space-x-4">
                <ProfilePreview user={registration.user} />
                <Text className="text-muted-foreground">{registration.user.name}</Text>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
