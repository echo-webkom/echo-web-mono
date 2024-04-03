import Image from "next/image";
import Link from "next/link";
import { isFuture, isToday } from "date-fns";
import { RxCalendar } from "react-icons/rx";

import { type Registration } from "@echo-webkom/db/schemas";
import { urlFor } from "@echo-webkom/sanity";

import { getRegistrationsByHappeningId } from "@/data/registrations/queries";
import { getSpotRangeByHappeningId } from "@/data/spotrange/queries";
import { createHappeningLink } from "@/lib/create-link";
import { isBedpres } from "@/lib/is-bedpres";
import { type fetchHomeHappenings } from "@/sanity/happening";
import { cn } from "@/utils/cn";
import { shortDateNoTimeNoYear, shortDateNoYear, time } from "@/utils/date";

const getSpotRangeInfo = <TSpotRange extends { spots: number; minYear: number; maxYear: number }>(
  spotRanges: Array<TSpotRange>,
  registrations: Array<Registration>,
) => {
  const maxCapacity = spotRanges.reduce((acc, curr) => acc + curr.spots, 0);
  const registeredCount = registrations.filter(
    (registration) => registration.status === "registered",
  ).length;
  const waitingListCount = registrations.filter(
    (registration) => registration.status === "waiting",
  ).length;

  return {
    maxCapacity,
    registeredCount,
    waitingListCount,
  };
};

export async function HappeningPreview({
  happening,
}: {
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number];
}) {
  const href = createHappeningLink(happening);

  const [registrations, spotRange] = await Promise.all([
    getRegistrationsByHappeningId(happening._id),
    getSpotRangeByHappeningId(happening._id),
  ]);

  const { maxCapacity, registeredCount, waitingListCount } = getSpotRangeInfo(
    spotRange ?? [],
    registrations,
  );

  return (
    <Link href={href}>
      <div className="flex h-32 items-center gap-4 rounded-lg p-4 hover:bg-muted">
        {isBedpres(happening) && (
          // Outer div is needed to that the image is not squished
          <div>
            <div className="relative h-16 w-16 overflow-hidden rounded-full border md:h-20 md:w-20">
              <Image src={urlFor(happening.image).url()} alt={happening.title} fill />
            </div>
          </div>
        )}

        <div className="flex w-full justify-between gap-2">
          <div className="my-auto flex flex-col">
            <h1 className="my-auto line-clamp-1 overflow-hidden text-lg sm:text-2xl">
              {happening.title}
            </h1>
            <div className=" items-center text-muted-foreground">
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
            <li className="flex justify-end">
              <span className="flex-none font-medium">
                <RxCalendar className="mx-1 h-full" />
              </span>{" "}
              <time>{shortDateNoTimeNoYear(happening.date)}</time>
            </li>
            <li>
              <span className="tracking-wider">
                {happening.registrationStart &&
                  maxCapacity > 0 &&
                  (isFuture(new Date(happening.registrationStart)) ? (
                    maxCapacity + " plasser"
                  ) : (
                    <p>
                      {cn(
                        registeredCount + waitingListCount >= maxCapacity
                          ? "Fullt"
                          : `${registeredCount}/${maxCapacity}` || ("Uendelig" && "∞"),
                      )}
                    </p>
                  ))}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
}
