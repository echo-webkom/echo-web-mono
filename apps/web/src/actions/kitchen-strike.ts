"use server";

import { revalidatePath } from "next/cache";

import { getAuth } from "@echo-webkom/auth";

import { coffeeStriker } from "@/lib/coffee-striker";
import { userIsInGroup } from "@/lib/groups";

export async function addStrikeToKitchen() {
  try {
    const user = await getAuth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const canAddStrike = (await userIsInGroup(user.id, ["hovedstyret"])) || user.type === "admin";

    if (!canAddStrike) {
      return {
        success: false,
        message: "Du har ikke lov til å legge til anmerkinger",
      };
    }

    await coffeeStriker.addStrike(user.id);

    revalidatePath("/kjokken");

    return {
      success: true,
      message: "Anmerkning lagt til",
    };
  } catch {
    return {
      success: false,
      message: "Internal error",
    };
  }
}

export async function clearAllStrikes() {
  try {
    const user = await getAuth();

    if (!user) {
      return {
        success: false,
        message: "Du er ikke logget inn",
      };
    }

    const canAddStrike = (await userIsInGroup(user.id, ["hovedstyret"])) || user.type === "admin";

    if (!canAddStrike) {
      return {
        success: false,
        message: "Du har ikke lov til å fjerne anmerkninger",
      };
    }

    await coffeeStriker.clearStrikes();

    revalidatePath("/kjokken");

    return {
      success: true,
      message: "Anmerkninger fjernet",
    };
  } catch {
    return {
      success: false,
      message: "Internal error",
    };
  }
}
