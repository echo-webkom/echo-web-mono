import { Briefcase, CalendarClock, Coffee, Pin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { UnoReturnType } from "@/api/uno/client";
import { jobTypeString } from "@/lib/mappers";
import { urlFor } from "@/lib/sanity";
import { cn } from "@/utils/cn";
import { shortDateNoTime } from "@/utils/date";

type JobAdPreviewProps = {
  jobAd: UnoReturnType["sanity"]["jobAds"]["all"][number];
  hideBorder?: boolean;
};

export const JobAdPreview = ({ jobAd, hideBorder = false }: JobAdPreviewProps) => {
  return (
    <Link href={`/for-studenter/stillingsannonse/${jobAd.slug}`}>
      <div
        className={cn(
          "flex flex-row items-center gap-4 rounded-xl border-2 p-6 sm:gap-8",
          "hover:bg-muted",
          "transition-colors duration-200 ease-in-out",
          {
            "hover:border-border border-transparent": !hideBorder,
            "border-border": hideBorder,
          },
        )}
      >
        {jobAd.company && (
          <div className="block">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 bg-white sm:h-20 sm:w-20">
              <Image
                src={urlFor(jobAd.company.image).url()}
                alt={`${jobAd.company.name} logo`}
                fill
              />
            </div>
          </div>
        )}
        <div className="flex h-full w-full flex-col gap-1 overflow-x-hidden">
          <h3 className="text-md truncate font-semibold sm:text-lg">{jobAd.title}</h3>
          <ul className="mt-auto flex flex-wrap gap-3 gap-y-1 p-0 text-xs sm:text-sm">
            {jobAd.company && (
              <li className="flex items-center gap-2">
                <Briefcase className="h-3 w-3 text-yellow-800 sm:h-4 sm:w-4" /> {jobAd.company.name}
              </li>
            )}
            <li className="flex items-center gap-2">
              <Pin className="h-3 w-3 text-red-600 sm:h-4 sm:w-4" />{" "}
              {jobAd.locations.map((location) => location.name).join(", ")}
            </li>
            <li className="flex items-center gap-2">
              <CalendarClock className="h-3 w-3 text-stone-700 sm:h-4 sm:w-4 dark:text-stone-400" />{" "}
              {jobAd.deadline !== null ? shortDateNoTime(jobAd.deadline) : "Fortløpende"}
            </li>
            {jobAd.jobType && (
              <li className="flex items-center gap-2">
                <Coffee className="h-3 w-3 text-amber-900 sm:h-4 sm:w-4" />{" "}
                {jobTypeString(jobAd.jobType as Parameters<typeof jobTypeString>[0])}
              </li>
            )}
          </ul>
        </div>
      </div>
    </Link>
  );
};
