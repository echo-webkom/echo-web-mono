import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale/nb";

import { urlFor } from "@echo-webkom/sanity";

import { type AllHappeningsQueryResult } from "@/sanity.types";
import { cn } from "@/utils/cn";
import { shortDateNoTimeWithEndDate } from "@/utils/date";
import { capitalize } from "@/utils/string";

type CombinedHappeningPreviewProps = {
  happening: AllHappeningsQueryResult[number];
};

export function CombinedHappeningPreview({ happening }: CombinedHappeningPreviewProps) {
  const parentPath = happening.happeningType === "bedpres" ? "bedpres" : "arrangement";

  return (
    <Link href={`/${parentPath}/${happening.slug}`}>
      <div
        className={cn(
          "flex h-full items-center justify-between gap-5 rounded-md p-5",
          "hover:bg-muted",
        )}
      >
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-2xl font-semibold">{happening.title}</h3>
          <ul>
            {happening.happeningType === "event" && (
              <li>
                <span className="font-semibold">Gruppe:</span>{" "}
                {capitalize(happening.organizers?.map((o) => o.name).join(", ") ?? "BO")}
              </li>
            )}
            {happening.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {shortDateNoTimeWithEndDate(happening.date, happening.endDate ?? undefined)}
              </li>
            )}
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {happening.registrationStart
                ? format(new Date(happening.registrationStart), "d. MMMM yyyy", {
                    locale: nb,
                  })
                : "Påmelding åpner snart"}
            </li>
          </ul>
        </div>
        {happening.happeningType === "bedpres" && (
          <div className="hidden overflow-hidden rounded-full border sm:block">
            <div className="relative aspect-square h-20 w-20">
              {happening.company && (
                <Image
                  src={urlFor(happening.company.image).url()}
                  alt={`${happening.company.name} logo`}
                  fill
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
