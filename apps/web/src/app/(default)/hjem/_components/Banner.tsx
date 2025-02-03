import Link from "next/link";
import { isPast } from "date-fns";

import { fetchBannerInfo } from "@/sanity/banner";

export const Banner = async () => {
  const bannerInfo = await fetchBannerInfo();
  const linkTo = bannerInfo?.linkTo ? bannerInfo.linkTo : "/";
  const backgroundColor = bannerInfo?.backgroundColor?.hex ?? "var(--primary)";
  const color = bannerInfo?.textColor?.hex ?? "white";

  if (!bannerInfo?.text) {
    return null;
  }

  if (bannerInfo.expiringDate && isPast(new Date(bannerInfo.expiringDate))) {
    return null;
  }

  return (
    <div>
      <div className="block">
        <Link href={linkTo}>
          <div
            className="flex h-14 w-full cursor-pointer items-center justify-center"
            style={{ backgroundColor }}
          >
            <p className="flex items-center gap-3 text-xl font-bold" style={{ color }}>
              {bannerInfo.text}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
