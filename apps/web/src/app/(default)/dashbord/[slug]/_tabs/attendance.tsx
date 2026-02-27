import { getFullHappening } from "@/data/happenings/queries";
import { QrScanner } from "../_components/qr-scanner";
import { RegistrationTable } from "../_components/registration-table";
import { RegistrationWithUser } from "../_lib/types";
import { getStudentGroupsWithMembers } from "../../../../../data/groups/queries";

type RegistrationsTabProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

const groups = await getStudentGroupsWithMembers();
export const AttendanceTab = ({ happening, registrations }: RegistrationsTabProps) => {
  return (
    <div>
      <h1>qr scanner</h1>
      <QrScanner registrations={registrations} happening={happening} studentGroups={groups} />
    </div>
  );
};
