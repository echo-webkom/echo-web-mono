import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
  debug: process.env.NODE_ENV === "development",
  cookieless_mode: "always",
});
