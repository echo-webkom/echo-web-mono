export const PRODUCTION_DOMAIN = "echo.uib.no";

export const ENVIRONMENT = (process.env.ENVIRONMENT ?? "").toLowerCase();

export const DEV = ENVIRONMENT === "development";

export const HTTP = DEV ? "http" : "https";

export const PORT = process.env.PORT ?? 3000;

export const BASE_URL = DEV
  ? `http://localhost:${process.env.PORT ?? 3000}`
  : `https://${PRODUCTION_DOMAIN}`;
