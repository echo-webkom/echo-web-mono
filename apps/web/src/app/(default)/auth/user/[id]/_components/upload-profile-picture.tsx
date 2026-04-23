"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { createProfilePictureUrl } from "@/api/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/utils/string";

import {
  deleteProfilePictureAction,
  uploadProfilePictureAction,
} from "../_actions/profile-picture";

type UploadProfilePictureProps = {
  userId: string;
  name: string;
  hasImage: boolean;
};

const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

export const UploadProfilePicture = ({
  userId,
  name,
  hasImage: initialHasImage,
}: UploadProfilePictureProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasImage, setHasImage] = useState(initialHasImage);
  const [imageVersion, setImageVersion] = useState(() => Date.now());
  const router = useRouter();

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Bare bilder er tillatt");
      return;
    }

    const size = file.size / 1024 / 1024;
    if (size > 5) {
      toast.error("Bildet er for stort. Maks 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadProfilePictureAction(formData);

      if (!result.ok) {
        toast.error(result.message ?? "Noe gikk galt");
        return;
      }

      setHasImage(true);
      setImageVersion(Date.now());
      router.refresh();
    } catch (err) {
      console.error("Upload threw an exception:", err);
      toast.error("Noe gikk galt");
    }
  };

  const handleRemoveImage = async () => {
    const ok = await deleteProfilePictureAction();
    if (!ok) {
      toast.error("Noe gikk galt");
      return;
    }
    setHasImage(false);
    setImageVersion(Date.now());
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar size="xl">
        <AvatarImage src={createProfilePictureUrl(userId, 2, imageVersion)} />
        <AvatarFallback className="text-2xl">{initials(name)}</AvatarFallback>
      </Avatar>

      <div>
        <input
          onChange={handleImageChange}
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          hidden
        />
        {!hasImage ? (
          <button
            onClick={handleChooseFile}
            type="button"
            className="w-fit text-blue-600 hover:underline md:w-full md:text-center"
          >
            Last opp
          </button>
        ) : (
          <button
            onClick={handleRemoveImage}
            type="button"
            className="w-fit text-red-600 hover:underline md:w-full md:text-center"
          >
            Fjern bilde
          </button>
        )}
      </div>
    </div>
  );
};
