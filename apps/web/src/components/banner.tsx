import Link from "next/link";
import {ExternalLinkIcon} from "@radix-ui/react-icons";

import {type Banner} from "@/api/banner/schemas";

type BannerProps = {
  banner: Banner | null;
};

const WebsiteBanner = ({banner}: BannerProps) => {
  if (!banner) {
    return null;
  }

  return (
    <div className="text-md flex justify-center bg-echo-blue2 px-5 py-3 font-bold md:text-lg">
      {banner.link ? (
        <Link
          href={banner.link}
          className="mx-auto flex w-fit items-center gap-2 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {banner.title}

          <span>
            <ExternalLinkIcon />
          </span>
        </Link>
      ) : (
        banner.title
      )}
    </div>
  );
};

export default WebsiteBanner;
