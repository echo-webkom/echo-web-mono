import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";

import { jobTypeToString, type JobAd } from "@/sanity/job-ad";
import { cn } from "@/utils/cn";
import { urlFor } from "@/utils/image-builder";

type JobAdPreviewProps = {
  jobAd: JobAd;
};

export function JobAdPreview({ jobAd }: JobAdPreviewProps) {
  return (
    <Link href={`/for-studenter/jobb/${jobAd.slug}`}>
      <div
        className={cn(
          "flex h-full flex-col gap-5 rounded-lg border p-5",
          "hover:bg-muted",
          "transition-colors duration-200 ease-in-out",
        )}
      >
        <div className=" flex sm:space-x-8">
          <div className="hidden h-32 min-w-32 overflow-hidden rounded-full border sm:block">
            <div className="relative aspect-square ">
              {jobAd.company && (
                <Image
                  src={urlFor(jobAd.company.image).url()}
                  alt={`${jobAd.company.name} logo`}
                  fill
                />
              )}
            </div>
          </div>
          <div className="relative flex w-auto flex-col">
            <h3 className="truncate text-2xl font-semibold">{jobAd.title}</h3>
            <p className="max- line-clamp-3 overflow-hidden text-ellipsis">{jobAd.body}</p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1 overflow-x-hidden">
          <hr />
          <ul className="flex justify-evenly space-x-2 pt-2 text-[10px] sm:text-sm">
            <li>
              <span className="font-semibold">Bedrift:</span>
              {jobAd.company.name}
            </li>
            <li>
              <span className="font-semibold">Sted:</span>{" "}
              {jobAd.locations.map((location) => location.name).join(", ")}
            </li>
            <li>
              <span
                className={cn("font-semibold", {
                  "line-through": new Date(jobAd.deadline) < new Date(),
                })}
              >
                Søknadsfrist:
              </span>{" "}
              {format(new Date(jobAd.deadline), "d. MMMM yyyy", {
                locale: nb,
              })}
            </li>
            <li>
              <span className="font-semibold">Stillingstype:</span> {jobTypeToString[jobAd.jobType]}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}
