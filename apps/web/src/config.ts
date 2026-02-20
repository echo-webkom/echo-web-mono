export const PRODUCTION_DOMAIN = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN ?? "echo.uib.no";

export const ENVIRONMENT = (process.env.ENVIRONMENT ?? "").toLowerCase();

export const DEV = ENVIRONMENT === "development";

export const HTTP = DEV ? "http" : "https";

export const PORT = process.env.PORT ?? 3000;

export const BASE_URL = DEV
  ? `http://localhost:${process.env.PORT ?? 3000}`
  : `https://${PRODUCTION_DOMAIN}`;

export const UNO_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const IS_DEVTOOLS_ENABLED = ["development", "testing", "staging"].includes(ENVIRONMENT);
