import Link from "next/link";
import {ExternalLinkIcon} from "@radix-ui/react-icons";

import {type Banner} from "@/api/settings/schemas";

type WebsiteBannerProps = {
  banner: Banner | null;
};

const WebsiteBanner = ({banner}: WebsiteBannerProps) => {
  if (!banner) {
    return null;
  }

  return (
    <div className="text-md z-30 flex justify-center bg-banner px-5 py-3 font-bold md:text-lg">
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
        <h3>{banner.title}</h3>
      )}
    </div>
  );
};

export default WebsiteBanner;
