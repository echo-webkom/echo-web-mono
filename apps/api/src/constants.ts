export const IS_CI = !!process.env.CI;
export const HOSTNAME = IS_CI ? "localhost" : "0.0.0.0";
export const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 8000;

export const IS_PROD = process.env.NODE_ENV === "production";
export const IS_DEV = !IS_PROD;

export const BASE_URL = IS_PROD ? "https://api.echo-webkom.no" : `http://localhost:${PORT}`;
