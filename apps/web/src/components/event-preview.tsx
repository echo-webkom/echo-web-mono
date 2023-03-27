import Image from "next/image";
import Link from "next/link";
import {type EventPreview} from "@/api/events";
import {capitalize} from "@/utils/string";
import cn from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

type EventPreviewProps = {
  event: EventPreview;
};

const EventPreviewBox = ({event}: EventPreviewProps) => {
  return (
    <Link href={`/event/${event.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-neutral-100")}>
        {/* Image */}
        {event.logoUrl && (
          <div className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full border">
            <Image src={event.logoUrl} alt={event.title} height={500} width={500} />
          </div>
        )}

        {/* Info */}
        <div className="overflow-x-hidden">
          <h3 className="text-2xl font-semibold line-clamp-1">{event.title}</h3>
          <ul>
            <li>
              <span className="font-semibold">Gruppe:</span> {capitalize(event.studentGroupName)}
            </li>
            <li>
              <span className="font-semibold">Dato:</span>{" "}
              {format(new Date(event.date), "d. MMMM yyyy", {locale: nb})}
            </li>
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {event.registrationDate
                ? format(new Date(event.registrationDate), "d. MMMM yyyy", {
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
