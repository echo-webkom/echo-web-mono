"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoCloudUploadOutline } from "react-icons/io5";
import { z } from "zod";

import { uploadImage } from "@/actions/images";
import { useToast } from "@/hooks/use-toast";
import { Text } from "./typography/text";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

const imageSchema = z.object({
  userId: z.string(),
  file: z.custom<File | undefined | null>(),
});

type ImageFormProps = {
  userId: string;
  imageURL: string | null;
};

export function ProfileImage({ userId, imageURL }: ImageFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof imageSchema>>({
    defaultValues: {
      userId: userId,
    },
    resolver: zodResolver(imageSchema),
  });

  const onSubmit = form.handleSubmit(
    async () => {
      setIsLoading(true);

      if (!file) {
        toast({
          title: "Du må velge et bilde",
          variant: "warning",
        });
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      const { success, message } = await uploadImage(userId, formData);

      setIsLoading(false);

      toast({
        title: message,
        variant: success ? "success" : "warning",
      });

      setFile(null);
      router.refresh();
    },
    () => {
      toast({
        title: "Noe gikk galt",
        variant: "warning",
      });
    },
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newFile = files[0];
    if (!newFile) return;

    if (newFile.size === 0) {
      toast({
        title: "Kan ikke laste opp et tomt bilde",
        variant: "warning",
      });
      return;
    }

    // 4MB is max
    if (newFile.size > 4 * 1024 * 1024) {
      toast({
        title: "Bildet er for stort",
        variant: "warning",
      });
      return;
    }

    // valid image types are jpg, jpeg, png, gif
    if (!["image/jpeg", "image/png", "image/gif"].includes(newFile.type)) {
      toast({
        title: "Bildet har feil format",
        variant: "warning",
      });
      return;
    }

    setFile(newFile);
  }

  function openFilePicker() {
    if (!ref.current) return;
    ref.current.click();
  }

  return (
    <div className="mx-auto flex w-64 flex-col items-center gap-2 pt-4">
      <div
        role="button"
        tabIndex={-1}
        className="relative h-64 w-full rounded-full"
        onClick={openFilePicker}
        onKeyDown={() => null}
      >
        {imageURL ? (
          <div
            className="h-full w-full overflow-hidden rounded-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src={file ? URL.createObjectURL(file) : imageURL}
              alt="Profilbilde"
              width={200}
              height={200}
              className="h-full w-full rounded-full border border-foreground object-cover"
            />
            <button
              onClick={openFilePicker}
              className={`${isHovering && !file ? "-translate-y-24 opacity-100" : "-translate-y-10 opacity-0"} 
                        w-full bg-black/40 pb-16 pt-4 text-center font-semibold text-white
                        transition-all delay-500 duration-200 ease-in hover:underline`}
            >
              Endre bilde
            </button>
          </div>
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-y-2 rounded-full
              border border-foreground bg-transparent text-foreground transition-colors duration-300
              hover:bg-foreground hover:text-background
              hover:dark:bg-white/90 hover:dark:text-background"
          >
            {file ? (
              <Image
                src={URL.createObjectURL(file)}
                alt="Profilbilde"
                width={200}
                height={200}
                className="h-full w-full rounded-full border border-foreground object-cover"
              />
            ) : (
              <>
                <IoCloudUploadOutline className="text-6xl" />
                <Text className="text-xl font-semibold">Last opp bilde</Text>
              </>
            )}
          </div>
        )}
      </div>

      <Form {...form}>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <form onSubmit={onSubmit}>
          <div
            className={`flex min-w-full flex-col items-center             
            ${file ? "translate-y-0 opacity-100" : "-translate-y-20 opacity-0"}
            transition-all duration-200`}
          >
            <input type="file" id="file" ref={ref} className="hidden" onChange={handleChange} />

            <Text className="text-center text-sm">{file?.name}</Text>
            <div className="flex w-full gap-2">
              <Button type="submit" disabled={!file} className="w-full">
                {isLoading ? "Lagrer..." : "Lagre"}
              </Button>
              <Button variant="outline" onClick={() => setFile(null)} className="w-full">
                Fjern
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
