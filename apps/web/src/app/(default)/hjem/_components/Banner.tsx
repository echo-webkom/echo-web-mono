import Link from "next/link";

import { fetchBannerInfo } from "@/sanity/banner";

export const Banner = async () => {
  const bannerInfo = await fetchBannerInfo();
  console.log("bannerinfo:", bannerInfo);
  const text = bannerInfo?.text ? bannerInfo.text : "echo.uib.no";
  const linkTo = bannerInfo?.linkTo ? bannerInfo.linkTo : "/hjem";
  const color = bannerInfo?.color ? bannerInfo.color : "bg-blue-500";
  const textColor = bannerInfo?.textColor ? bannerInfo.textColor : "text-white";
  return (
    <div>
      <div className="block">
        <Link href={linkTo}>
          <div
            className={`${color} bg-{bannerInfo.color} absolute flex h-14 w-full cursor-pointer items-center justify-center`}
          >
            <p className={`${textColor} flex items-center gap-3 text-xl font-bold`}>{text}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Banner;
