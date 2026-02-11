import {
  BedriftsturEmpty,
  BedriftsturGold,
  BrannkampBronze,
  BrannkampEmpty,
  BrannkampGold,
  BrannkampSilver,
  GokartBronze,
  GokartEmpty,
  GokartGold,
  GokartSilver,
  VinterballBronze,
  VinterballEmpty,
  VinterballGold,
  VinterballSilver,
} from "@/assets/images/trophies";
import { getRegistrationsForTrophy, type RegistrationForTrophy } from "@/data/trophy/queries";
import { TrophyName } from "./page";

export const getUserTrophies = async (userId: string) => {
  const registrations = await getRegistrationsForTrophy(userId);
  const gokart = getGoKartTrophy(registrations);
  const bedriftstur = getBedriftsturTrophy(registrations);
  return [gokart, bedriftstur];
};

export const getGoKartTrophy = (registrations: Array<RegistrationForTrophy>) => {
  const gokartRegistrations = registrations.filter((registration) =>
    registration.happening.slug.includes("gokart"),
  );
  const name = TrophyName.GOKART;
  const level =
    gokartRegistrations.length >= 3
      ? TrophyName.GOLD
      : gokartRegistrations.length === 2
        ? TrophyName.SILVER
        : gokartRegistrations.length === 1
          ? TrophyName.BRONZE
          : TrophyName.EMPTY;

  const image =
    gokartRegistrations.length >= 3
      ? GokartGold
      : gokartRegistrations.length === 2
        ? GokartSilver
        : gokartRegistrations.length === 1
          ? GokartBronze
          : GokartEmpty;

  const title =
    gokartRegistrations.length >= 3
      ? "Formel 1 sjåfør"
      : gokartRegistrations.length === 2
        ? "Oppkjøring"
        : gokartRegistrations.length === 1
          ? "Kjøretime"
          : "Ikke lappen";
  const description =
    gokartRegistrations.length >= 3
      ? "Du har deltatt på tre gokart arrangement.\n\nDu er jammen meg glad i Gokart!"
      : gokartRegistrations.length === 2
        ? "Du har deltatt på to gokart arrangement.\n\nDelta på én til og få gull Gokart!"
        : gokartRegistrations.length === 1
          ? "Du har deltatt på ett gokart arrangement.\n\nDelta på flere og få gull og bronse!"
          : "Delta på Gokart arrangement med Gnist for å oppnå dette trofeet!";
  return {
    name,
    level,
    image,
    title,
    description,
  };
};

export const getBedriftsturTrophy = (registrations: Array<RegistrationForTrophy>) => {
  const bedriftsturRegistrations = registrations.filter((registration) =>
    registration.happening.slug.includes("bedriftstur"),
  );

  const isGold = bedriftsturRegistrations.length >= 1;

  const name = TrophyName.BEDRIFTSTUR;
  const level = isGold ? TrophyName.GOLD : TrophyName.EMPTY;
  const image = isGold ? BedriftsturGold : BedriftsturEmpty;
  const title = isGold ? "Bedriftstur-veteran" : "Ikke deltatt";
  const description = isGold
    ? "Du har deltatt på bedriftstur med Gnist!\n\nHåper du hadde en fin tur!"
    : "Delta på bedriftstur med Gnist for å oppnå dette trofeet!";

  return {
    name,
    level,
    image,
    title,
    description,
  };
};
