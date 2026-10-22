import { unoWithAdmin } from "@/api/server";

export type Trophy = {
  image: string;
  text: string;
  amount_needed: number;
};

export async function getBedpresTrophy(amount: number): Promise<Trophy> {
  return unoWithAdmin.sanity.trophies.byAmount("Bedpres", amount);
}
