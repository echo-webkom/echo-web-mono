import { createProfilePictureUrl } from "@/api/client";
import { initials } from "@/utils/string";

import { Avatar, AvatarFallback, AvatarImage } from "../../../../../../components/ui/avatar";

type ProfilePictureAvatarProps = {
  userId: string;
  name: string;
  hasImage: boolean;
  imageVersion: number;
};

export function ProfilePictureAvatar({
  userId,
  name,
  hasImage,
  imageVersion,
}: ProfilePictureAvatarProps) {
  return (
    <Avatar className="size-64">
      {hasImage && (
        <AvatarImage src={createProfilePictureUrl(userId, 2, imageVersion)} alt={name} />
      )}
      <AvatarFallback className="text-2xl">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
