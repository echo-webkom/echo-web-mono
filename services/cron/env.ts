import { load } from "https://deno.land/std@0.207.0/dotenv/mod.ts";

export const loadEnv = () =>
  load({
    envPath: ".env",
    examplePath: ".env.example",
    allowEmptyValues: true,
    export: true,
  });
