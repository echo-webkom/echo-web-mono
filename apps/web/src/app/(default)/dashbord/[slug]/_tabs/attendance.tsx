import { unoWithAdmin } from "@/api/server";
import { type FullHappening, type Group } from "@/api/uno/client";
import { QrScanner } from "../_components/qr-scanner";
import { RegistrationWithUser } from "../_lib/types";

type RegistrationsTabProps = {
  happening: FullHappening;
  registrations: Array<RegistrationWithUser>;
};

export const AttendanceTab = async ({ happening, registrations }: RegistrationsTabProps) => {
  const groups = await unoWithAdmin.groups.all();
  return (
    <div>
      <h1>qr scanner</h1>
      <QrScanner registrations={registrations} happening={happening} studentGroups={groups} />
    </div>
  );
};
