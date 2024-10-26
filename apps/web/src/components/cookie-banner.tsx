import { cookies } from "next/headers";

import { COOKIE_BANNER } from "@/config";
import { CookieBannerClient } from "./cookie-banner-client";

export const CookieBanner = async () => {
  const cookieStore = await cookies();
  if (cookieStore.get(COOKIE_BANNER)) {
    return null;
  }

  return <CookieBannerClient />;
};
