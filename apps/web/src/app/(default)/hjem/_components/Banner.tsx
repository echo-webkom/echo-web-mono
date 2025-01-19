import Link from "next/link";

import { fetchBannerInfo } from "@/sanity/banner";

export const Banner = async () => {
  const bannerInfo = await fetchBannerInfo();

  const linkTo = bannerInfo?.linkTo ? bannerInfo.linkTo : "/";
  const color = "bg-[" + bannerInfo?.backgroundColor?.hex + "]";
  const textColor = "text-[" + bannerInfo?.textColor?.hex + "]";
  return (
    <div>
      <div className="block">
        <Link href={linkTo}>
          <div
            className={`${color} absolute flex h-14 w-full cursor-pointer items-center justify-center`}
          >
            <p className={`${textColor} flex items-center gap-3 text-xl font-bold`}>
              {bannerInfo?.text}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
