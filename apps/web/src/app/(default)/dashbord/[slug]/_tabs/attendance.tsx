import { getStudentGroups } from "@/data/groups/queries";
import { getFullHappening } from "@/data/happenings/queries";
import { QrScanner } from "../_components/qr-scanner";
import { RegistrationTable } from "../_components/registration-table";
import { RegistrationWithUser } from "../_lib/types";

type RegistrationsTabProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

const groups = await getStudentGroups();
export const AttendanceTab = ({ happening, registrations }: RegistrationsTabProps) => {
  return (
    <div>
      <h1>qr scanner</h1>
      <QrScanner />
      <RegistrationTable
        questions={happening.questions}
        registrations={registrations}
        studentGroups={groups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
      />
    </div>
  );
};
