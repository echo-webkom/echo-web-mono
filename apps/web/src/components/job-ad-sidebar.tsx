import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";

import { urlFor } from "@echo-webkom/sanity";

import { degreeYearsToList, degreeYearText } from "@/lib/degree-year-text";
import { type JobAdsQueryResult } from "@/sanity.types";
import { jobTypeString } from "@/sanity/job-ad";
import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "./sidebar";
import { Button } from "./ui/button";

type JobAdSidebarProps = {
  jobAd: JobAdsQueryResult[number];
};

export function JobAdSidebar({ jobAd }: JobAdSidebarProps) {
  return (
    <Sidebar>
      <SidebarItem>
        <Link href={jobAd.company.website}>
          <div className="overflow-hidden">
            <div className="relative aspect-square w-full">
              <Image
                src={urlFor(jobAd.company.image).url()}
                alt={`${jobAd.company.name} logo`}
                fill
              />
            </div>
          </div>
        </Link>
      </SidebarItem>

      <SidebarItem>
        <SidebarItemTitle>Bedrift</SidebarItemTitle>
        <SidebarItemContent>{jobAd.company.name}</SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Sted</SidebarItemTitle>
        <SidebarItemContent>
          {jobAd.locations.map((location) => location.name).join(", ")}
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Søknadsfrist</SidebarItemTitle>
        <SidebarItemContent>
          {format(new Date(jobAd.deadline), "d. MMMM yyyy", {
            locale: nb,
          })}
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Årstrinn</SidebarItemTitle>
        <SidebarItemContent>
          {degreeYearText(degreeYearsToList(jobAd.degreeYears))}
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Stillingstype</SidebarItemTitle>
        <SidebarItemContent>{jobTypeString(jobAd.jobType)}</SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <Button className="w-full hover:underline" asChild>
          <Link href={jobAd.link}>Søk her!</Link>
        </Button>
      </SidebarItem>
    </Sidebar>
  );
}
