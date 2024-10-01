"use client";

import { useMemo, useState } from "react";

import { type JobType } from "@echo-webkom/lib";

import { Container } from "@/components/container";
import { JobAdPreview } from "@/components/job-ad-preview";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { type JobAdsQueryResult } from "@/sanity.types";
import { jobTypeString } from "@/sanity/job-ad";

type JobAdListProps = {
  jobAds: JobAdsQueryResult;
};

type Sort = "newest" | "oldest" | "expiresSoon" | "expiresLate";

export const JobAdList = ({ jobAds }: JobAdListProps) => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("expiresSoon");
  const [companyFilter, setCompanyFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const workTypes = useMemo(() => {
    return jobAds.reduce<Array<JobType>>((acc, jobAd) => {
      if (!acc.includes(jobAd.jobType)) {
        return [...acc, jobAd.jobType];
      }

      return acc;
    }, []);
  }, [jobAds]);

  const locations = useMemo(() => {
    return jobAds.reduce<Array<{ id: string; name: string }>>((acc, jobAd) => {
      const locations = jobAd.locations;

      if (!locations) {
        return acc;
      }

      return locations.reduce((acc, location) => {
        if (!acc.find((loc) => loc.id === location._id)) {
          return [
            ...acc,
            {
              id: location._id,
              name: location.name,
            },
          ];
        }

        return acc;
      }, acc);
    }, []);
  }, [jobAds]);

  const companies = useMemo(() => {
    return jobAds.reduce<Array<{ id: string; name: string }>>((acc, jobAd) => {
      if (!acc.find((company) => company.id === jobAd.company._id)) {
        return [
          ...acc,
          {
            id: jobAd.company._id,
            name: jobAd.company.name,
          },
        ];
      }

      return acc;
    }, []);
  }, [jobAds]);

  const filteredJobAds = useMemo(() => {
    return jobAds
      .filter((jobAd) => {
        return (
          jobAd.title.toLowerCase().includes(search.toLowerCase()) ||
          jobAd.company.name.toLowerCase().includes(search.toLowerCase())
        );
      })
      .filter((jobAd) => {
        return companyFilter ? jobAd.company._id === companyFilter : true;
      })
      .filter((jobAd) => {
        return workTypeFilter ? jobAd.jobType === workTypeFilter : true;
      })
      .filter((jobAd) => {
        return locationFilter
          ? jobAd.locations?.some((location) => location._id === locationFilter)
          : true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "newest":
            return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
          case "oldest":
            return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
          case "expiresSoon":
            if (a.deadline === null) {
              return 1;
            }

            if (b.deadline === null) {
              return -1;
            }

            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          case "expiresLate":
            if (a.deadline === null) {
              return -1;
            }

            if (b.deadline === null) {
              return 1;
            }
            return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
        }
      });
  }, [jobAds, search, companyFilter, workTypeFilter, locationFilter, sort]);

  return (
    <Container className="space-y-4 py-10">
      <Heading>Stillingsannonser</Heading>

      <Text>
        Her finner du en oversikt over alle stillingsannonsene vi har tilgjengelig. Du kan filtrere
        på sted, stillingstype og bedrift for å finne stillingen som passer best for deg.
      </Text>

      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-1">
          <Label htmlFor="search">Søk</Label>
          <Input
            id="search"
            placeholder="Søk etter stilling"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex w-full flex-col gap-1 md:max-w-44">
          <Label htmlFor="location">Sted</Label>
          <Select
            id="location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">Alle steder</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex w-full flex-col gap-1 md:max-w-40">
          <Label htmlFor="sort">Sorter etter</Label>
          <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="newest">Nyeste først</option>
            <option value="oldest">Eldste først</option>
            <option value="expiresSoon">Utløper snart</option>
            <option value="expiresLate">Utløper senere</option>
          </Select>
        </div>

        <div className="flex w-full flex-col gap-1 md:max-w-40">
          <Label htmlFor="workType">Stillingstype</Label>
          <Select
            id="workType"
            value={workTypeFilter}
            onChange={(e) => setWorkTypeFilter(e.target.value)}
          >
            <option value="">Alle stillingstyper</option>
            {workTypes.map((workType) => (
              <option key={workType} value={workType}>
                {jobTypeString(workType)}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex w-full flex-col gap-1 md:max-w-40">
          <Label htmlFor="company">Bedrift</Label>
          <Select
            id="company"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="">Alle bedrifter</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <hr className="border-border" />

      <p className="text-sm text-muted-foreground">Antall resultater: {filteredJobAds.length}</p>

      <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {filteredJobAds.map((jobAd) => (
          <li key={jobAd._id}>
            {/* FIX hideBorder thing */}
            <JobAdPreview jobAd={jobAd} hideBorder />
          </li>
        ))}
      </ul>
    </Container>
  );
};
