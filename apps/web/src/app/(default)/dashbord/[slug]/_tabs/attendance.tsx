import { unoWithAdmin } from "@/api/server";
import { type FullHappening, type SpotRange } from "@/api/uno/client";

import { RegistrationTable } from "../_components/registration-table";
import { type RegistrationWithUser } from "../_lib/types";
import { QrScanner } from "../_components/qr-scanner";

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
      <QrScanner registrations={registrations} happening={happening} spotRanges={spotRanges} groups={groups} />
      
      {/* <RegistrationTable
        questions={happening.questions}
        registrations={registrations}
        studentGroups={groups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
        spotRanges={spotRanges}
      /> */}
      
    </div>
  );
};
