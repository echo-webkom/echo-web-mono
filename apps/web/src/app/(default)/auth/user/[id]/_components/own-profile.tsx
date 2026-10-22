import { Text } from "@/components/typography/text";

import { type UnoReturnType, type User } from "../../../../../../api/uno/client";
import { EditProfileDialog } from "./edit-profile-dialog";
import { ProfileMemberships } from "./profile-memberships";
import { ProfilePicture } from "./profile-picture";
import { ShowQrCode } from "./show-qr-code";
import WhitelistNotification from "./whitelist-notification";

type OwnProfileProps = {
  user: User;
  degrees: UnoReturnType["degrees"]["all"];
};

export function OwnProfile({ user, degrees }: OwnProfileProps) {
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
          <ShowQrCode userId={user.id} className="absolute right-0 bottom-0 mx-2 my-2" />
        </div>
        <div className="flex flex-col space-y-8 md:px-6">
          <div>
            <div className="flex items-center gap-4">
              <Text className="p-0 text-3xl font-semibold">{user.name}</Text>
            </div>
            <Text className="text-sm">{user.email}</Text>
            {user.year && user.degree?.name && (
              <Text className="text-sm">
                {user.year}. år {user.degree.name}
              </Text>
            )}
            <Text className="text-sm">
              {user.birthday ? user.birthday.toLocaleDateString("nb-NO") : "Bursdag ikke satt"}
            </Text>
          </div>
          <ProfileMemberships groups={user.groups} variant="profile" />
          <EditProfileDialog user={user} degrees={degrees} />
        </div>
      </div>
      <div className="pl-0 md:pl-16">
        <Text className="text-2xl font-semibold">Trofeer</Text>
        <div>
          <div>
            <Text className="text-muted-foreground">Oppdaget</Text>
          </div>
          <div>
            <Text className="text-muted-foreground">Uoppdaget</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
