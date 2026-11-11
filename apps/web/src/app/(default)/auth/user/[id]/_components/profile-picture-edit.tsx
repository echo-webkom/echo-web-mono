"use client";

import { useRef } from "react";
import { toast } from "sonner";

import { Text } from "../../../../../../components/typography/text";
import {
  deleteProfilePictureAction,
  uploadProfilePictureAction,
} from "../_actions/profile-picture";

type ProfilePictureActionsProps = {
  onImageChanged: () => void;
  onImageRemoved: () => void;
  hasImage: boolean;
};

const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

export function ProfilePictureEdit({
  onImageChanged,
  onImageRemoved,
  hasImage,
}: ProfilePictureActionsProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

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

      onImageChanged();
    } catch (error) {
      console.error("Upload threw an exception:", error);
      toast.error("Noe gikk galt");
    }
  };

  const handleRemoveImage = async () => {
    const ok = await deleteProfilePictureAction();
    if (!ok) {
      toast.error("Noe gikk galt");
      return;
    }

    onImageRemoved();
  };

  return (
    <div>
      <Text size="sm" className="font-semibold">
        Profilbilde
      </Text>
      <input
        onChange={handleImageChange}
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES.join(",")}
        hidden
      />
      {!hasImage ? (
        <button
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit text-blue-600 hover:underline"
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
  );
}
