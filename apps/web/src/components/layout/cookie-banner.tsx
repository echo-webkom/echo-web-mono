import { cookies } from "next/headers";

import { COOKIE_BANNER } from "@/config";
import { CookieBannerClient } from "./cookie-banner-client";

export function CookieBanner() {
  if (cookies().get(COOKIE_BANNER)) {
    return null;
  }

  return <CookieBannerClient />;
}
