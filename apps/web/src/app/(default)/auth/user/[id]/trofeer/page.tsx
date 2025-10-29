import Image, { type StaticImageData } from "next/image";
import { redirect } from "next/navigation";

import { auth } from "@/auth/session";
import { Heading } from "@/components/typography/heading";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getUserTrophies } from "./trophy-helpers";

export default async function UserTrophies() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const trophies = await getUserTrophies(user.id);

  return (
    <div>
      <Heading level={2} className="">
        Dine troféer
      </Heading>
      <p>Denne siden er under produksjon ... </p>
      <div className="mt-20 grid grid-cols-2 gap-y-10 sm:grid-cols-3 sm:gap-y-14">
        {trophies.map((trophy) => (
          <div key={trophy.name} className="flex flex-col items-center gap-5">
            <TrophyDisplay
              level={trophy.level}
              image={trophy.image}
              title={trophy.title}
              description={trophy.description}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function TrophyDisplay({
  level,
  image,
  title,
  description,
}: {
  level: number;
  image: StaticImageData;
  title: string;
  description: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Image src={image} alt="Empty trophy" width={120} height={120} />
        <Heading level={3} className="capitalize">
          {title}
        </Heading>
      </PopoverTrigger>
      <PopoverContent>
        <p className="mb-5 text-lg font-semibold">{title}</p>
        <p>{description}</p>
      </PopoverContent>
    </Popover>
  );
}
