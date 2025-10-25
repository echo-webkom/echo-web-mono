import Image from "next/image";
import Link from "next/link";
import { LuBriefcase, LuCalendarClock, LuCoffee, LuPin } from "react-icons/lu";

import { type JobAdsQueryResult } from "@echo-webkom/cms/types";
import { urlFor } from "@echo-webkom/sanity";

import { jobTypeString } from "@/sanity/utils/mappers";
import { cn } from "@/utils/cn";
import { shortDateNoTime } from "@/utils/date";

type JobAdPreviewProps = {
  jobAd: JobAdsQueryResult[number];
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
        <div className="block">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 bg-white sm:h-20 sm:w-20">
            <Image
              src={urlFor(jobAd.company.image).url()}
              alt={`${jobAd.company.name} logo`}
              fill
            />
          </div>
        </div>
        <div className="flex h-full w-full flex-col gap-1 overflow-x-hidden">
          <h3 className="text-md truncate font-semibold sm:text-lg">{jobAd.title}</h3>
          <ul className="mt-auto flex flex-wrap gap-3 gap-y-1 p-0 text-xs sm:text-sm">
            <li className="flex items-center gap-2">
              <LuBriefcase className="h-3 w-3 text-yellow-800 sm:h-4 sm:w-4" /> {jobAd.company.name}
            </li>
            <li className="flex items-center gap-2">
              <LuPin className="h-3 w-3 text-red-600 sm:h-4 sm:w-4" />{" "}
              {jobAd.locations.map((location) => location.name).join(", ")}
            </li>
            <li className="flex items-center gap-2">
              <LuCalendarClock className="h-3 w-3 text-stone-700 sm:h-4 sm:w-4 dark:text-stone-400" />{" "}
              {jobAd.deadline !== null ? shortDateNoTime(jobAd.deadline) : "Fortløpende"}
            </li>
            <li className="flex items-center gap-2">
              <LuCoffee className="h-3 w-3 text-amber-900 sm:h-4 sm:w-4" />{" "}
              {jobTypeString(jobAd.jobType)}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};
