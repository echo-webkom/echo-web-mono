"use client";

import Link from "next/link";

export default function VervBanner() {
  return (
    <Link href={"https://verv.echo-webkom.no/"}>
      <div
        className="flex h-full w-full items-center justify-center space-x-3 rounded-md bg-primary bg-gradient-to-r from-banner to-primary py-4 text-base font-semibold text-white sm:space-x-5 sm:text-2xl"
        suppressHydrationWarning
      >
        <span>Søk verv i Webkom eller Gnist her! Søknadsfristen er 14. Februar</span>
      </div>
    </Link>
  );
}
