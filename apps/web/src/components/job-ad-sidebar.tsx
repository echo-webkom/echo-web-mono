import Image from "next/image";
import Link from "next/link";
import { LuExternalLink as ExternalLink } from "react-icons/lu";

import type { UnoReturnType } from "@/api/uno/client";
import { degreeYearsToList, degreeYearText } from "@/lib/degree-year-text";
import { jobTypeString } from "@/lib/mappers";
import { urlFor } from "@/lib/sanity";
import { shortDate } from "@/utils/date";

import { Sidebar, SidebarItem, SidebarItemContent, SidebarItemTitle } from "./sidebar";
import { Button } from "./ui/button";

type JobAdSidebarProps = {
  jobAd: UnoReturnType["sanity"]["jobAds"]["all"][number];
};

export const JobAdSidebar = ({ jobAd }: JobAdSidebarProps) => {
  return (
    <Sidebar className="flex h-fit w-full flex-col gap-4 lg:max-w-[360px]">
      {jobAd.company && (
        <SidebarItem>
          <Link href={jobAd.company.website}>
            <div className="overflow-hidden rounded-xl border-2 bg-white">
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
      )}

      {jobAd.company && (
        <SidebarItem>
          <SidebarItemTitle>Bedrift</SidebarItemTitle>
          <SidebarItemContent>
            <a className="hover:underline" href={jobAd.company.website}>
              {jobAd.company.name}
              <ExternalLink className="ml-1 inline-block h-4 w-4" />
            </a>
          </SidebarItemContent>
        </SidebarItem>
      )}
      <SidebarItem>
        <SidebarItemTitle>Sted</SidebarItemTitle>
        <SidebarItemContent>
          {jobAd.locations.map((location) => location.name).join(", ")}
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Søknadsfrist</SidebarItemTitle>
        <SidebarItemContent>
          {jobAd.deadline !== null ? shortDate(jobAd.deadline) : "Fortløpende"}
        </SidebarItemContent>
      </SidebarItem>
      <SidebarItem>
        <SidebarItemTitle>Årstrinn</SidebarItemTitle>
        <SidebarItemContent>
          {degreeYearText(
            degreeYearsToList(jobAd.degreeYears as Parameters<typeof degreeYearsToList>[0]),
          )}
        </SidebarItemContent>
      </SidebarItem>
      {jobAd.jobType && (
        <SidebarItem>
          <SidebarItemTitle>Stillingstype</SidebarItemTitle>
          <SidebarItemContent>
            {jobTypeString(jobAd.jobType as Parameters<typeof jobTypeString>[0])}
          </SidebarItemContent>
        </SidebarItem>
      )}
      {jobAd.link && (
        <SidebarItem>
          <Button data-attr="apply-link" className="w-full hover:underline" asChild>
            <Link href={jobAd.link}>Søk her!</Link>
          </Button>
        </SidebarItem>
      )}
    </Sidebar>
  );
};
