"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { type JobAdsQueryResult } from "@echo-webkom/cms/types";

import { JobAdPreview } from "@/components/job-ad-preview";

export const JobAdCarousel = ({ jobAds }: { jobAds: Array<JobAdsQueryResult[number]> }) => {
  const [page, setPage] = useState(0);
  const adsPerPage = 2;

  const start = page * adsPerPage;
  const currentAds = jobAds.slice(start, start + adsPerPage);

  const hasPrev = page > 0;
  const hasNext = start + adsPerPage < jobAds.length;

  return (
    <>
      {/* Mobil */}
      <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto sm:hidden">
        {jobAds.map((jobAd) => (
          <li key={jobAd._id} className="min-w-[90%] snap-center">
            <JobAdPreview jobAd={jobAd} hideBorder={true} />
          </li>
        ))}
      </ul>

      {/* Desktop */}
      <div className="relative hidden items-center sm:flex">
        {hasPrev && (
          <button
            onClick={() => setPage((p) => p - 1)}
            className="absolute left-[-25px] z-10 rounded-md border bg-background p-2"
          >
            <ArrowLeft />
          </button>
        )}

        <ul className="flex gap-2">
          {currentAds.map((jobAd) => (
            <li key={jobAd._id} className="flex-1">
              <JobAdPreview jobAd={jobAd} hideBorder={true} />
            </li>
          ))}
        </ul>

        {hasNext && (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="absolute right-[-25px] z-10 rounded-md border bg-background p-2"
          >
            <ArrowRight />
          </button>
        )}
      </div>
    </>
  );
};
