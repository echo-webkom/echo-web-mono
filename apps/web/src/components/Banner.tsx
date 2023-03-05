import {type Banner} from "@/api/banner/schemas";
import Link from "next/link";

interface BannerProps {
  banner: Banner | null;
}

export const WebsiteBanner = ({banner}: BannerProps) => {
  if (!banner) {
    return null;
  }

  const externalProps = banner.isExternal
    ? {
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <div className="bg-echo-blue2 py-5 px-5 text-center text-lg font-bold">
      {banner.linkTo ? (
        <Link
          href={banner.linkTo}
          className="hover:underline"
          {...externalProps}
        >
          {banner.text}
        </Link>
      ) : (
        banner.text
      )}
    </div>
  );
};
