import Link from "next/link";

import { fetchBannerInfo } from "@/sanity/banner";

export const Banner = async () => {
  const bannerInfo = await fetchBannerInfo();
  const linkTo = bannerInfo?.linkTo ? bannerInfo.linkTo : "/";
  const backgroundColor = bannerInfo?.backgroundColor?.hex || "var(--primary)";
  const color = bannerInfo?.textColor?.hex || "white";
  return (
    <div>
      <div className="block">
        <Link href={linkTo}>
          <div
            className="absolute flex h-14 w-full cursor-pointer items-center justify-center"
            style={{ backgroundColor }}
          >
            <p className="flex items-center gap-3 text-xl font-bold" style={{ color }}>
              {bannerInfo?.text}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
