export const PRODUCTION_DOMAIN = "echo.uib.no";

export const dev = process.env.NODE_ENV !== "production";

export const HTTP = dev ? "http" : "https";

export const WS = dev ? "ws" : "wss";

export const PORT = process.env.PORT ?? 3000;

export const BASE_URL = dev
  ? `http://localhost:${process.env.PORT ?? 3000}`
  : `https://${PRODUCTION_DOMAIN}`;

export const PROFILE_IMAGE_FUNCTION_URL = "https://echo-images.azurewebsites.net/api/images";

export const COOKIE_BANNER = "cookie-banner";

export const BOOMTOWN_HOSTNAME = process.env.NEXT_PUBLIC_BOOMTOWN_HOSTNAME;

export const NUM_HAPPENINGS = !isNaN(Number(process.env.NUM_HAPPENINGS))
  ? Number(process.env.NUM_HAPPENINGS)
  : 4;
