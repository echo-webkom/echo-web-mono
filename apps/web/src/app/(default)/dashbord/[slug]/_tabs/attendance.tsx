import { type FullHappening, type Group } from "@/api/uno/client";
import { QrScanner } from "../_components/qr-scanner";
import { RegistrationWithUser } from "../_lib/types";

type RegistrationsTabProps = {
  happening: FullHappening;
  registrations: Array<RegistrationWithUser>;
  groups: Array<Group>;
};

export const AttendanceTab = ({ happening, registrations, groups }: RegistrationsTabProps) => {
  return (
    <div>
      <QrScanner registrations={registrations} happening={happening} studentGroups={groups} />
    </div>
  );
};
