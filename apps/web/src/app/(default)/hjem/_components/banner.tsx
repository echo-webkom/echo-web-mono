import { isPast } from "date-fns";
import Link from "next/link";

import { type CMSBanner } from "@/api/uno/client";

export const Banner = ({ banner }: { banner: CMSBanner | null }) => {
  if (!banner?.text) {
    return null;
  }

  const linkTo = banner.linkTo ?? "/";
  const backgroundColor = banner.backgroundColor?.hex ?? "var(--primary)";
  const color = banner.textColor?.hex ?? "white";

  if (banner.expiringDate && isPast(new Date(banner.expiringDate))) {
    return null;
  }

  return (
    <div>
      <div className="block">
        <Link href={linkTo}>
          <div
            className="flex h-fit min-h-14 w-full cursor-pointer items-center justify-center"
            style={{ backgroundColor }}
          >
            <p
              className="flex items-center gap-3 py-4 text-center text-xl font-bold sm:py-0"
              style={{ color }}
            >
              {banner.text}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};
