export const PRODUCTION_DOMAIN = "echo.uib.no";

export const dev = process.env.NODE_ENV !== "production";

export const HTTP = dev ? "http" : "https";

export const WS = dev ? "ws" : "wss";

export const PORT = process.env.PORT ?? 3000;

export const BASE_URL = dev
  ? `http://localhost:${process.env.PORT ?? 3000}`
  : `https://${PRODUCTION_DOMAIN}`;
