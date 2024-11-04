import { cookies, type UnsafeUnwrappedCookies } from "next/headers";

import { COOKIE_BANNER } from "@/config";
import { CookieBannerClient } from "./cookie-banner-client";

export const CookieBanner = () => {
  if ((cookies() as unknown as UnsafeUnwrappedCookies).get(COOKIE_BANNER)) {
    return null;
  }

  return <CookieBannerClient />;
};
