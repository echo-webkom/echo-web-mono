import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";

import { jobTypeToString, type JobAd } from "@/sanity/job-ad";
import { cn } from "@/utils/cn";
import { urlFor } from "@/utils/image-builder";
import { Button } from "./ui/button";

type JobAdSidebarProps = {
  jobAd: JobAd;
};

export function JobAdSidebar({ jobAd }: JobAdSidebarProps) {
  return (
    <div className="flex flex-col">
      <div className="relative hidden h-48 w-48 overflow-hidden sm:block">
        <Image src={urlFor(jobAd.company.image).url()} alt={`${jobAd.company.name} logo`} fill />
      </div>

      <div>
        <ul className="grid grid-cols-2 gap-4 sm:flex sm:flex-col sm:pt-8">
          <li>
            <span className="font-semibold">Bedrift:</span> {jobAd.company.name}
          </li>
          <li>
            <span className=" font-semibold">Sted: </span>
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
            <span className="font-semibold">Årstrinn: </span>
            {degreeYearText({jobAd.degreeYears})}
          </li>
          <li>
            <span className="font-semibold">Stillingstype:</span> {jobTypeToString[jobAd.jobType]}
          </li>
          <li>
            <Button className="hover:underline" asChild>
              <Link href={jobAd.link}>Søk her!</Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
