export const PROFILE_IMAGE_FUNCTION_URL = "https://echo-images.azurewebsites.net/api/images";

export class EchoGram {
  #apiKey: string | undefined;

  constructor(apiKey: string | undefined) {
    this.#apiKey = apiKey;
  }

  async getImageByUserId(userId: string) {
    // TODO: handle errors
    try {
      const response = await fetch(`${PROFILE_IMAGE_FUNCTION_URL}?userId=${userId}`, {
        method: "GET",
        cache: "no-store",
      });

      return response.status === 200 ? `${PROFILE_IMAGE_FUNCTION_URL}?userId=${userId}` : null;
    } catch (err) {
      return null;
    }
  }

  async uploadImage(userId: string, formData: FormData) {
    try {
      const file = formData.get("image") as File;

      if (file.size === 0 || typeof file.size === "undefined") {
        return {
          success: false,
          message: "Kan ikke laste opp et tomt bilde",
        };
      }

      // 4MB is max
      if (file.size > 4 * 1024 * 1024) {
        return {
          success: false,
          message: "Bildet er for stort",
        };
      }

      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        return {
          success: false,
          message: "Bildet har feil format",
        };
      }

      const response = await fetch(PROFILE_IMAGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "User-ID": userId,
        },
        body: formData,
      });

      switch (response.status) {
        case 200:
          break;
        case 400:
          return {
            success: false,
            message: `Bildet er for stort eller har feil format: ${await response.text()}`,
          };
        case 500:
          return {
            success: false,
            message: `Det skjedde en feil: ${await response.text()}`,
          };
      }

      return {
        success: true,
        message: "Bildet ble lastet opp - det kan ta litt tid før det vises på profilen din",
      };
    } catch (err) {
      return {
        success: false,
        message: `Det skjedde en feil: ${err}`,
      };
    }
  }
}
