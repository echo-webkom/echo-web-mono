import Image from "next/image";

import { Text } from "@/components/typography/text";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { uno } from "../../../../../../api/client";
import {
  type UnoReturnType,
  type User,
} from "../../../../../../api/uno/client";
import { urlFor } from "../../../../../../lib/sanity";
import { cn } from "../../../../../../utils/cn";
import { EditProfileDialog } from "./edit-profile-dialog";
import { ProfileMemberships } from "./profile-memberships";
import { ProfilePicture } from "./profile-picture";
import { ShowQrCode } from "./show-qr-code";
import WhitelistNotification from "./whitelist-notification";

type OwnProfileProps = {
  user: User;
  degrees: UnoReturnType["degrees"]["all"];
};

export async function OwnProfile({ user, degrees }: OwnProfileProps) {
  const userTrophies = await uno.trophy.all(user.id).catch(() => []);

  return (
    <div className="mx-auto flex w-full max-w-350 flex-col space-y-6 pt-12 md:flex-row md:items-start md:space-y-0 md:pt-24">
      <WhitelistNotification />
      <div className="flex flex-col items-center md:items-start">
        <div className="relative mb-8 flex w-fit flex-col items-start">
          <ProfilePicture
            userId={user.id}
            name={user.name ?? "Fant ikke brukernavn  "}
            hasImage={user.hasImage}
          />
          <ShowQrCode
            userId={user.id}
            className="absolute right-0 bottom-0 mx-2 my-2"
          />
        </div>
        <div className="flex flex-col space-y-8 md:px-6">
          <div>
            <div className="flex items-center gap-4">
              <Text className="p-0 text-3xl font-semibold">{user.name}</Text>
            </div>
            <Text className="text-md">{user.email}</Text>
            {user.year && user.degree?.name && (
              <Text className="text-md">
                {user.year}. år {user.degree.name}
              </Text>
            )}
            <Text className="text-md">
              {user.birthday
                ? user.birthday.toLocaleDateString("nb-NO")
                : "Bursdag ikke satt"}
            </Text>
          </div>
          <ProfileMemberships groups={user.groups} variant="profile" />
          <EditProfileDialog user={user} degrees={degrees} />
        </div>
      </div>
      <div className="px-4 md:pr-0 md:pl-16">
        <Text className="mb-6 text-4xl font-semibold text-center md:text-left">
          Trofeer
        </Text>
        <div className="flex flex-wrap gap-6 justify-center">
          {userTrophies.map((trophy) => (
            <Popover key={trophy.trophy.title}>
              <PopoverTrigger className="flex flex-col cursor-pointer items-center gap-2 rounded-md text-center">
                <Image
                  src={urlFor(trophy.currentLevel.image).url()}
                  alt={trophy.currentLevel.name}
                  width={200}
                  height={200}
                  className={cn(
                    "h-40 w-50  max-w-full object-contain",
                    trophy.currentLevel.threshold === 0 && "opacity-30",
                  )}
                />
                <p className="text-lg font-semibold">
                  {trophy.currentLevel.name}
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-60 rounded-xl">
                <p className="mb-3 font-bold">{trophy.currentLevel.name}</p>
                <p>{trophy.currentLevel.text}</p>
              </PopoverContent>
            </Popover>
          ))}
        </div>
      </div>
    </div>
  );
}
