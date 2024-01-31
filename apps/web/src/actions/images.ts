"use server";

import { auth } from "@echo-webkom/auth";

import { echoGram } from "@/lib/echogram";

export async function uploadImage(userId: string, formData: FormData) {
  try {
    const user = await auth();

    if (!user || user.id !== userId) {
      return {
        success: false,
        message: "Du må være logget inn for å laste opp bilder",
      };
    }

    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        message: "Kan ikke laste opp et tomt bilde",
      };
    }

    return await echoGram.uploadImage(userId, formData);
  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: `Det skjedde en feil: ${err}`,
    };
  }
}
