"use server";

import { auth } from "@echo-webkom/auth";

import { echoGram } from "@/api/echogram";

export async function uploadImage(userId: string, file: File) {
  try {
    const user = await auth();

    if (!user || user.id !== userId) {
      return {
        success: false,
        message: "Du må være logget inn for å laste opp bilder",
      };
    }

    return await echoGram.uploadImage(userId, file);
  } catch (err) {
    console.error("HELP");
    console.error(err);

    return {
      success: false,
      message: `Det skjedde en feil: ${err}`,
    };
  }
}
