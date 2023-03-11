import {ExternalLinkIcon} from "@radix-ui/react-icons";
import Link from "next/link";
import {type Banner} from "@/api/banner/schemas";

interface BannerProps {
  banner: Banner | null;
}

export const WebsiteBanner = ({banner}: BannerProps) => {
  if (!banner) {
    return null;
  }

  return (
    <div className="text-md bg-echo-blue2 py-5 px-5 text-center font-bold md:text-lg">
      <p>
        <span>🔊</span>{" "}
        {banner.linkTo ? (
          <Link
            href={banner.linkTo}
            className="mx-auto flex w-fit items-center gap-2 hover:underline"
            {...(banner.isExternal && {
              target: "_blank",
              rel: "noreferrer",
            })}
          >
            {banner.text}

            {/* Add external link icon */}
            {banner.isExternal && (
              <span>
                <ExternalLinkIcon />
              </span>
            )}
          </Link>
        ) : (
          banner.text
        )}
      </p>
    </div>
  );
};
