import Link from "next/link";
import {ExternalLinkIcon} from "@radix-ui/react-icons";

import {fetchBanner} from "@/sanity/settings";
import {type Banner} from "@/sanity/settings/schemas";

export const dynamic = "force-static";

export default async function WebsiteBanner() {
  const banner = await fetchBanner();

  if (!banner) {
    return null;
  }

  if (banner.link) {
    return (
      <Link href={banner.link}>
        <BaseBanner banner={banner} />
      </Link>
    );
  }

  return <BaseBanner banner={banner} />;
}

function BaseBanner({banner}: {banner: Banner}) {
  return (
    <div className="relative z-30 justify-center gap-3 bg-wave py-4 text-center">
      <div className="flex items-center justify-center gap-3 text-center">
        <h3 className="text-xl font-bold">{banner.title}</h3>
        {banner.link && <ExternalLinkIcon className="h-4 w-4" style={{verticalAlign: "middle"}} />}
      </div>
      {banner.subtitle && <p className="text-sm">{banner.subtitle}</p>}
    </div>
  );
}
