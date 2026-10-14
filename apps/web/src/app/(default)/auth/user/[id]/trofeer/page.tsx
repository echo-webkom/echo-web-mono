import Image from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth/session";
import { Heading } from "@/components/typography/heading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { urlFor } from "../../../../../../lib/sanity";
import { unoWithAdmin } from "../../../../../../api/server";

export default async function UserTrophies() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const trophyCollections = await unoWithAdmin.trophies.all();

  if (!trophyCollections || trophyCollections.length === 0) {
    return <p>Kunne ikke hente troféer.</p>;
  }

  const trophies = trophyCollections.flatMap((collection) =>
    collection.trophies.map((trophy) => ({
      ...trophy,
      collectionTitle: collection.title,
      collectionDescription: collection.baseDescription,
    })),
  );

  return (
    <div>
      <Heading level={2} className="">
        Dine troféer
      </Heading>
      <p>Denne siden er under produksjon ...</p>
      <div className="mt-20 grid gap-y-10 sm:grid-cols-3 sm:gap-y-14">
        {trophies.map((trophy) => (
          <Popover key={trophy._key}>
            <PopoverTrigger className="flex cursor-pointer flex-col items-center gap-3 text-left">
              <Image
                src={urlFor(trophy.image).url()}
                alt={trophy.title}
                width={120}
                height={120}
              />
              <Heading level={3}>{trophy.title}</Heading>
            </PopoverTrigger>
            <PopoverContent>
              <Image
                src={urlFor(trophy.image).url()}
                alt={trophy.title}
                width={120}
                height={120}
              />
              <p className="mb-2 text-lg font-semibold">{trophy.title}</p>
              <p className="mb-4 text-sm text-muted-foreground">
                {trophy.collectionTitle}
              </p>
              <p>{trophy.description || trophy.collectionDescription}</p>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
