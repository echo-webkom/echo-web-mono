import Image from "next/image";
import { redirect } from "next/navigation";

import { urlFor } from "@echo-webkom/sanity";

import { auth } from "@/auth/session";
import { Heading } from "@/components/typography/heading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { fetchAllTrophies } from "@/sanity/trophies";

export default async function UserTrophies() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const trophies = await fetchAllTrophies();

  if (!trophies) {
    return <p>Kunne ikke hente troféer.</p>;
  }

  return (
    <div>
      <Heading level={2} className="">
        Dine troféer
      </Heading>
      <p>Denne siden er under produksjon ... </p>
      <div className="mt-20 grid gap-y-10 sm:grid-cols-3 sm:gap-y-14">
        {trophies.map((trophy) => (
          <Popover key={trophy._id}>
            <PopoverTrigger>
              <Image
                src={urlFor(trophy.baseImage ?? "").url()}
                alt="Empty trophy"
                width={120}
                height={120}
              />
              <Heading level={3}>{trophy.title}</Heading>
            </PopoverTrigger>
            <PopoverContent>
              <Image
                src={urlFor(trophy.baseImage ?? "").url()}
                alt="Empty trophy"
                width={120}
                height={120}
              />
              <p className="mb-5 text-lg font-semibold">{trophy.title}</p>
              <p>{trophy.baseDescription}</p>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </div>
  );
}
