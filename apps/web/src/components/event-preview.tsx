import Link from "next/link";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

import {type Event} from "@/api/event";
import {cn} from "@/utils/cn";
import {capitalize} from "@/utils/string";

type EventPreviewProps = {
  event: Event;
};

const EventPreviewBox = ({event}: EventPreviewProps) => {
  return (
    <Link href={`/event/${event.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-neutral-100")}>
        <div className="overflow-x-hidden">
          <h3 className="line-clamp-1 text-2xl font-semibold">{event.title}</h3>
          <ul>
            <li>
              <span className="font-semibold">Gruppe:</span>{" "}
              {capitalize(event.organizers.map((o) => o.name).join(", "))}
            </li>
            {event.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(event.date), "d. MMMM yyyy", {locale: nb})}
              </li>
            )}
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {event.registrationStart
                ? format(new Date(event.registrationStart), "d. MMMM yyyy", {
                    locale: nb,
                  })
                : "Påmelding åpner snart"}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default EventPreviewBox;
