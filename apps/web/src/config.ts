export const PRODUCTION_DOMAIN = "echo.uib.no";

export const baseURL =
  process.env.NODE_ENV === "production"
    ? `https://${PRODUCTION_DOMAIN}`
    : `http://localhost:${process.env.PORT ?? 3000}`;

export const COOKIE_BANNER = "cookie-banner";
