import { unoWithAdmin } from "@/api/server";
import { type FullHappening, type SpotRange } from "@/api/uno/client";

import { Chip } from "../../../../../components/typography/chip";
import { Heading } from "../_components/heading";
import { QrScanner } from "../_components/qr-scanner";
import { type RegistrationWithUser } from "../_lib/types";

type AttendanceTabProps = {
  happening: FullHappening;
  registrations: Array<RegistrationWithUser>;
  spotRanges: Array<SpotRange>;
};

export const AttendanceTab = async ({
  happening,
  registrations,
  spotRanges,
}: AttendanceTabProps) => {
  const groups = await unoWithAdmin.groups.all();

  return (
    <div>
      <div className="mt-8 flex max-w-3xl items-center gap-2">
        <Heading>Ta oppmøte</Heading>
        <Chip variant="secondary" className="px-2 py-0.5 text-[px20]">
          Beta feature
        </Chip>
      </div>
      <QrScanner
        registrations={registrations}
        happening={happening}
        spotRanges={spotRanges}
        groups={groups}
      />
    </div>
  );
};
