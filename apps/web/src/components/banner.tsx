import Link from "next/link";

import { fetchBanner } from "@/sanity/settings";

export async function Banner() {
  const banner = await fetchBanner();

  if (!banner?.showBanner) {
    return null;
  }

  if (banner.link) {
    const isExternal = banner.link.startsWith("http");
    const Comp = isExternal ? "a" : Link;

    return (
      <Comp
        href={banner.link}
        className="group"
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
      >
        <BaseBanner banner={banner} />
      </Comp>
    );
  }

  return <BaseBanner banner={banner} />;
}

function BaseBanner({
  banner,
}: {
  banner: Exclude<Awaited<ReturnType<typeof fetchBanner>>, null>;
}) {
  return (
    <div className="bg-primary py-3 text-center text-white selection:text-black">
      <p className="text-lg font-semibold group-hover:underline">{banner.title}</p>
      {banner.subtitle && <p className="text-sm">{banner.subtitle}</p>}
    </div>
  );
}
