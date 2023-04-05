import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import {format} from "date-fns";
import nb from "date-fns/locale/nb";

import {type Bedpres} from "@/api/bedpres";

type BedpresPreviewProps = {
  bedpres: Bedpres;
};

const BedpresPreviewBox = ({bedpres}: BedpresPreviewProps) => {
  return (
    <Link href={`/bedpres/${bedpres.slug}`}>
      <div className={cn("flex h-full items-center gap-5 p-5", "hover:bg-neutral-100")}>
        <div className="overflow-hidden rounded-full border">
          <div className="relative aspect-square h-20 w-20">
            <Image src={bedpres.company.imageUrl} alt={`${bedpres.company.name} logo`} fill />
          </div>
        </div>
        <div className="overflow-x-hidden">
          <h3 className="text-2xl font-semibold line-clamp-1">{bedpres.title}</h3>
          <ul>
            {bedpres.date && (
              <li>
                <span className="font-semibold">Dato:</span>{" "}
                {format(new Date(bedpres.date), "d. MMMM yyyy", {locale: nb})}
              </li>
            )}
            <li>
              <span className="font-semibold">Påmelding:</span>{" "}
              {bedpres.registrationDate
                ? format(new Date(bedpres.registrationDate), "d. MMMM yyyy", {
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

export default BedpresPreviewBox;
