import Image from "next/image";
import Link from "next/link";
import { isFuture, isToday } from "date-fns";

import { urlFor } from "@echo-webkom/sanity";

import { apiServer } from "@/api/server";
import { Chip } from "@/components/typography/chip";
import { createHappeningLink } from "@/lib/create-link";
import { getSpotRangeInfo } from "@/lib/spot-range-info";
import { type fetchHomeHappenings } from "@/sanity/happening";
import { cn } from "@/utils/cn";
import { shortDateNoTimeNoYear, shortDateNoYear, time } from "@/utils/date";

export const HappeningPreview = ({
  happening,
}: {
  happening: Awaited<ReturnType<typeof fetchHomeHappenings>>[number];
}) => {
  const href = createHappeningLink(happening);

  return (
    <Link href={href}>
      <div
        className={cn(
          "hover:border-muted-dark hover:bg-muted relative flex h-18 items-center gap-4 rounded-xl border-2 border-transparent p-4",
          {
            "h-26": happening.happeningType === "bedpres",
            "border-secondary-dark": happening.isPinned === true,
          },
        )}
      >
        {happening.happeningType === "bedpres" && happening.image && (
          // Outer div is needed to that the image is not squished
          <div>
            <div className="relative h-16 w-16 overflow-hidden rounded-full border md:h-16 md:w-16">
              <Image src={urlFor(happening.image).url()} alt={happening.title} fill />
            </div>
          </div>
        )}

        {happening.isPinned === true && (
          <Chip variant="secondary" className="absolute -top-4 -right-2 rotate-6">
            📍 Festet
          </Chip>
        )}

        <div className="flex w-full justify-between gap-2">
          <div className="my-auto flex flex-col">
            <h1 className="my-auto line-clamp-1 overflow-hidden font-medium">{happening.title}</h1>
            <div className="text-muted-foreground items-center text-xs font-medium">
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
            <li className="text-muted-foreground flex justify-end text-xs">
              <time>{shortDateNoTimeNoYear(happening.date)}</time>
            </li>
            <li className="text-muted-foreground">
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
  const { waiting, registered, max } = await apiServer
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

  return <p className="text-xs font-medium">{info}</p>;
};
