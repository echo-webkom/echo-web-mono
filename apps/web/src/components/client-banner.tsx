"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuX } from "react-icons/lu";

import { type getBanner } from "@/sanity/settings/requests";

const HIDDEN_BANNERS_KEY = "hidden-banners";

function hashBanner(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

const getHiddenBanners = () =>
  JSON.parse(localStorage.getItem(HIDDEN_BANNERS_KEY) ?? "[]") as Array<number>;

export function ClientBanner(banner: Exclude<Awaited<ReturnType<typeof getBanner>>, null>) {
  const [isHidden, setIsHidden] = useState(false);

  const handleClose = () => {
    const hiddenBanners = getHiddenBanners();
    localStorage.setItem(
      HIDDEN_BANNERS_KEY,
      JSON.stringify(
        Array.from(
          new Set([...hiddenBanners, hashBanner(`${banner.title}${banner.subtitle ?? ""}`)]),
        ),
      ),
    );

    setIsHidden(true);
  };

  useEffect(() => {
    if (getHiddenBanners().includes(hashBanner(`${banner.title}${banner.subtitle ?? ""}`))) {
      setIsHidden(() => true);
    }
  }, [banner]);

  if (isHidden) {
    return null;
  }

  const base = (
    <div className="relative bg-primary px-4 py-2 text-center text-white sm:px-8">
      <p className="font-medium group-hover:underline">{banner.title}</p>
      {banner.subtitle && <p className="text-sm">{banner.subtitle}</p>}

      <button
        onClick={handleClose}
        title="Skjul banner"
        className="absolute right-0 top-0 z-20 h-full px-4"
      >
        <LuX className="h-6 w-6" />
      </button>
    </div>
  );

  const type = banner.link ? (banner.link.startsWith("/") ? "internal" : "external") : "none";

  return type === "internal" ? (
    <Link className="group" href={banner.link!}>
      {base}
    </Link>
  ) : type === "external" ? (
    <a className="group" href={banner.link!} target="_blank" rel="noreferrer">
      {base}
    </a>
  ) : (
    base
  );
}
