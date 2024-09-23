import Image from "next/image";
import Link from "next/link";
import { isFuture, isToday } from "date-fns";
import { RxCalendar } from "react-icons/rx";

import { urlFor } from "@echo-webkom/sanity";

import { apiClient } from "@/api/client";
import { createHappeningLink } from "@/lib/create-link";
import { getSpotRangeInfo } from "@/lib/spot-range-info";
import { type fetchHomeHappenings } from "@/sanity/happening";
import { shortDateNoTimeNoYear, shortDateNoYear, time } from "@/utils/date";

export const HappeningPreview = ({
  happening,
}: {
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number];
}) => {
  const href = createHappeningLink(happening);

  return (
    <Link href={href}>
      <div className="flex h-32 items-center gap-4 rounded-xl border-2 border-transparent p-4 hover:border-muted-dark hover:bg-muted">
        {happening.happeningType === "bedpres" && happening.image && (
          // Outer div is needed to that the image is not squished
          <div>
            <div className="relative h-16 w-16 overflow-hidden rounded-full border md:h-20 md:w-20">
              <Image src={urlFor(happening.image).url()} alt={happening.title} fill />
            </div>
          </div>
        )}

        <div className="flex w-full justify-between gap-2">
          <div className="my-auto flex flex-col">
            <h1 className="my-auto line-clamp-1 overflow-hidden text-lg font-medium sm:text-2xl">
              {happening.title}
            </h1>
            <div className="items-center text-sm font-medium text-muted-foreground">
              {happening.registrationStart &&
                isFuture(new Date(happening.registrationStart)) &&
                (isToday(new Date(happening.registrationStart)) ? (
                  <p>{`Påmelding i dag kl ${time(happening.registrationStart)}`}</p>
                ) : (
                  <time>{`Påmelding ${shortDateNoYear(happening.registrationStart)}`}</time>
                ))}
            </div>
          </div>

          <ul className="sm:text-md text-md my-auto flex-none text-right">
            <li className="flex justify-end text-sm">
              <span className="flex-none font-medium">
                <RxCalendar className="mx-1 h-full" />
              </span>{" "}
              <time>{shortDateNoTimeNoYear(happening.date)}</time>
            </li>
            <li>
              <HappeningRegistrationInfo happening={happening} />
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

const HappeningRegistrationInfo = async ({
  happening,
}: {
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number];
}) => {
  const { waiting, registered, max } = await apiClient
    .get(`happening/${happening._id}/registrations/count`)
    .json<{
      waiting: number;
      registered: number;
      max: number | null;
    }>();

  const info = getSpotRangeInfo({
    registrationStart: happening.registrationStart,
    waiting,
    registered,
    max,
  });

  if (!info) {
    return null;
  }

  return <p className="text-sm font-medium">{info}</p>;
};
