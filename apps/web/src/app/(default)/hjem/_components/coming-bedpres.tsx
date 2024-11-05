import { LuClock10 } from "react-icons/lu";

import { type HappeningType } from "@echo-webkom/lib";

import { fetchHomeHappenings } from "@/sanity/happening";
import { BentoBox } from "./bento-box";
import { HappeningPreview } from "./happening-preview";

type ComingHappeningsProps = {
  title: string;
  href: string;
  types: Array<HappeningType>;
  n: number;
  className?: string;
};

export const ComingHappenings = async ({
  title,
  href,
  types,
  n,
  className,
}: ComingHappeningsProps) => {
  const happenings = await fetchHomeHappenings(types, n);

  return (
    <BentoBox title={title} href={href} className={className}>
      {happenings.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-3">
          {happenings.map((happening) => (
            <li key={happening._id}>
              <HappeningPreview happening={happening} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center text-gray-500">
          <LuClock10 className="mb-4 size-16" />
          <p className="font-medium">Ingen kommende {title.toLowerCase()}</p>
        </div>
      )}
    </BentoBox>
  );
};
