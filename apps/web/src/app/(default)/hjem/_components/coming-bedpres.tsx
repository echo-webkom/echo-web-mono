import { Clock10 } from "lucide-react";

import { type CMSHomeHappening, type RegistrationCount } from "@/api/uno/client";

import { BentoBox } from "./bento-box";
import { HappeningPreview } from "./happening-preview";

type ComingHappeningsProps = {
  title: string;
  href: string;
  happenings: Array<CMSHomeHappening>;
  registrationCounts: Array<RegistrationCount>;
  className?: string;
};

export const ComingHappenings = ({
  title,
  href,
  happenings,
  registrationCounts,
  className,
}: ComingHappeningsProps) => {
  return (
    <BentoBox title={title} href={href} className={className}>
      {happenings.length > 0 ? (
        <ul className="grid grid-cols-1 gap-x-3">
          {happenings.map((happening) => {
            const registrationCount =
              registrationCounts.find((count) => count.happeningId === happening._id) ?? null;

            return (
              <li key={happening._id}>
                <HappeningPreview happening={happening} registrationCount={registrationCount} />
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center text-gray-500">
          <Clock10 className="mb-4 size-16" />
          <p className="font-medium">Ingen kommende {title.toLowerCase()}</p>
        </div>
      )}
    </BentoBox>
  );
};
