import Image from "next/image";
import Link from "next/link";
import {type EventPreview} from "@/api/events";
import {capitalize} from "@/utils/string";
import classNames from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

const groupToColor = (group: string) => {
  switch (group) {
    case "makerspace":
      return "border-yellow-500";
    case "hovedstyret":
      return "border-echo-blue";
    case "tilde":
      return "border-green-500";
    case "gnist":
      return "border-red-500";
    case "bedkom":
      return "border-transparent";
    default:
      return "border-gray-500";
  }
};

type EventPreviewProps = {
  event: EventPreview;
};

export const EventPreviewBox: React.FC<EventPreviewProps> = ({event}) => {
  return (
    <Link href={`/event/${event.slug}`}>
      <div
        className={classNames(
          "flex h-full items-center gap-5 border-l-4 p-5",
          "hover:bg-neutral-100",
          groupToColor(event.studentGroupName),
        )}
      >
        {/* Image */}
        {event.logoUrl && (
          <div className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full">
            <div className="aspect-square h-full w-full">
              <Image src={event.logoUrl} alt={event.title} fill />
            </div>
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
