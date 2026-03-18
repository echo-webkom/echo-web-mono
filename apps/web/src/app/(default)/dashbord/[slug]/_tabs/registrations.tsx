import { unoWithAdmin } from "@/api/server";
import { type FullHappening } from "@/api/uno/client";
import { RegistrationTable } from "../_components/registration-table";
import { type RegistrationWithUser } from "../_lib/types";

type RegistrationsTabProps = {
  happening: FullHappening;
  registrations: Array<RegistrationWithUser>;
};

export const RegistrationsTab = async ({ happening, registrations }: RegistrationsTabProps) => {
  const groups = await unoWithAdmin.groups.all();

  return (
    <div className="mt-8 flex flex-col gap-3">
      <h2 className="text-3xl font-semibold">Registrerte</h2>
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
