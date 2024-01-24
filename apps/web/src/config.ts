export const PRODUCTION_DOMAIN = "echo.uib.no";

export const baseURL =
  process.env.NODE_ENV === "production"
    ? `https://${PRODUCTION_DOMAIN}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

export const PROFILE_IMAGE_FUNCTION_URL = "https://echo-images.azurewebsites.net/api/images";

export const PROFILE_IMAGE_FUNCTION_URL = "https://echo-images.azurewebsites.net/api/images";

export const COOKIE_BANNER = "cookie-banner";
