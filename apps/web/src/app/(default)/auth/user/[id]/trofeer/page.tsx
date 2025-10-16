import Image, { type StaticImageData } from "next/image";
import { redirect } from "next/navigation";

import BedriftsturEmpty from "@/assets/images/trophies/bedriftstur-empty.png";
import BedriftsturGold from "@/assets/images/trophies/bedriftstur-gold.png";
import GokartBronze from "@/assets/images/trophies/gokart-bronze.png";
import GokartEmpty from "@/assets/images/trophies/gokart-empty.png";
import GokartGold from "@/assets/images/trophies/gokart-gold.png";
import GokartSilver from "@/assets/images/trophies/gokart-silver.png";
import VinterballBronze from "@/assets/images/trophies/vinterball-bronze.png";
import VinterballEmpty from "@/assets/images/trophies/vinterball-empty.png";
import VinterballGold from "@/assets/images/trophies/vinterball-gold.png";
import VinterballSilver from "@/assets/images/trophies/vinterball-silver.png";
import { auth } from "@/auth/session";
import { Heading } from "@/components/typography/heading";

export default async function UserTrophies() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  return (
    <div>
      <Heading level={2} className="mb-4">
        Dine troféer
      </Heading>
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {TROPHIES.map((trophy) => (
          <div key={trophy.name} className="flex flex-col items-center gap-5">
            <Image
              src={trophy.levels.find((level) => level.name === TrophyName.GOLD)!.image}
              alt="Empty trophy"
              width={120}
              height={120}
            />
            <Heading level={3}>{trophy.name}</Heading>
          </div>
        ))}
      </div>
    </div>
  );
}

enum TrophyName {
  EMPTY = "empty",
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
}

type TrophyLevel = {
  name: TrophyName;
  image: StaticImageData;
  title: string;
  description: string;
};

type Trophy = {
  name: string;
  levels: Array<TrophyLevel>;
};

const TROPHIES: Array<Trophy> = [
  {
    name: "Gokart",
    levels: [
      {
        name: TrophyName.EMPTY,
        image: GokartEmpty,
        title: "Ikke lappen",
        description: "Delta på Gokart arrangement med Gnist for å oppnå dette trofeet!",
      },
      {
        name: TrophyName.BRONZE,
        image: GokartBronze,
        title: "Kjøretime",
        description:
          "Du har deltatt på ett gokart arrangement.\n\nDelta på flere og få gull og bronse!",
      },
      {
        name: TrophyName.SILVER,
        image: GokartSilver,
        title: "Oppkjøring",
        description:
          "Du har deltatt på to gokart arrangement.\n\nDelta på én til og få gull Gokart!",
      },
      {
        name: TrophyName.GOLD,
        image: GokartGold,
        title: "Formel 1 sjåfør",
        description: "Du har deltatt på tre gokart arrangement.\n\nDu er jammen meg glad i Gokart!",
      },
    ],
  },
  {
    name: "Vinterball",
    levels: [
      {
        name: TrophyName.EMPTY,
        image: VinterballEmpty,
        title: "Vinterball",
        description: "Bli med på echo sitt Vinterball for å oppnå dette trofeet!",
      },
      {
        name: TrophyName.BRONZE,
        image: VinterballBronze,
        title: "Vinterball Bronse",
        description:
          "Du har deltatt på étt vinterball med echo. \n\nDelta på flere og få gull og bronse!",
      },
      {
        name: TrophyName.SILVER,
        image: VinterballSilver,
        title: "Vinterball Sølv",
        description:
          "Du har deltatt på to vinterball med echo.\n\nDelta på ett til og få gull-trofé!",
      },
      {
        name: TrophyName.GOLD,
        image: VinterballGold,
        title: "Vinterball Gull",
        description: "Du har sett tre vinterball med echo!\n\necho elsker deg!",
      },
    ],
  },
  {
    name: "Bedriftstur",
    levels: [
      {
        name: TrophyName.EMPTY,
        image: BedriftsturEmpty,
        title: "Bedriftstur",
        description: "Bli med på echo sin bedriftstur for å oppnå dette trofeet!",
      },
      {
        name: TrophyName.GOLD,
        image: BedriftsturGold,
        title: "Bedriftstur Gull",
        description: "Du har vert med på en bedriftstur med echo.\n\nDu er flink!",
      },
    ],
  },
];
