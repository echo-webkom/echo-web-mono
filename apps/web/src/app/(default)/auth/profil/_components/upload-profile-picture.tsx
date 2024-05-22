"use client";

import { useRef, useState } from "react";

import { deleteProfilePictureAction, uploadProfilePictureAction } from "@/actions/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { initials } from "@/utils/string";

type UploadProfilePictureProps = {
  name: string;
  image: string | null;
};

const ACCEPTED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/gif"];

export const UploadProfilePicture = ({ name, image }: UploadProfilePictureProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(image);
  const { toast } = useToast();

  const handleChooseFile = () => {
    inputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast({ title: "Bare bilder er tillatt" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const { success, message } = await uploadProfilePictureAction(formData);

    if (!success) {
      toast({ title: message });
      return;
    }

    setImageUrl(message);
  };

  const handleRemoveImage = async () => {
    await deleteProfilePictureAction();
    setImageUrl(null);
  };

  return (
    <div className="space-y-2">
      <Avatar>
        <AvatarImage src={imageUrl ?? ""} />
        <AvatarFallback className="text-2xl">{initials(name)}</AvatarFallback>
      </Avatar>

      <div>
        <input
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onChange={handleImageChange}
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES.join(",")}
          hidden
        />
        {!imageUrl ? (
          <button
            onClick={handleChooseFile}
            type="button"
            className="w-fit text-blue-600 hover:underline md:w-full md:text-center"
          >
            Last opp
          </button>
        ) : (
          <button
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
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
