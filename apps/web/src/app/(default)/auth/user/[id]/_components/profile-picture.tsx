"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfilePictureAvatar } from "./profile-picture-avatar";
import { ProfilePictureEdit } from "./profile-picture-edit";

type ProfilePictureProps = {
  userId: string;
  name: string;
  hasImage: boolean;
  edit?: boolean;
};

export function ProfilePicture({
  userId,
  name,
  hasImage: initialHasImage,
  edit,
}: ProfilePictureProps) {
  const [hasImage, setHasImage] = useState(initialHasImage);
  const [imageVersion, setImageVersion] = useState(() => Date.now());
  const router = useRouter();

  const refreshImage = () => {
    setImageVersion(Date.now());
    router.refresh();
  };

  if (edit) {
    return (
      <ProfilePictureEdit
        hasImage={hasImage}
        onImageChanged={() => {
          setHasImage(true);
          refreshImage();
        }}
        onImageRemoved={() => {
          setHasImage(false);
          refreshImage();
        }}
      />
    );
  }

  return (
    <ProfilePictureAvatar
      userId={userId}
      name={name}
      hasImage={hasImage}
      imageVersion={imageVersion}
    />
  );
}
