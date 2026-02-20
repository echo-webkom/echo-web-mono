import Image from "next/image";

import { unoWithAdmin } from "@/api/server";
import { type getFullHappening } from "@/data/happenings/queries";
import { RegistrationTable } from "../_components/registration-table";
import { type RegistrationWithUser } from "../_lib/types";

type RegistrationsTabProps = {
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  registrations: Array<RegistrationWithUser>;
};

export const RegistrationsTab = async ({ happening, registrations }: RegistrationsTabProps) => {
  const groups = await unoWithAdmin.groups.all();

  if (registrations.length < 1) {
    return (
      <div className="mx-auto mt-8 flex w-fit flex-col gap-8 p-5">
        <h3 className="text-center text-xl font-medium">Ingen registrerte!</h3>
        <Image
          className="rounded-lg"
          src="/gif/empty-shelves-john-travolta.gif"
          alt="Travolta looking around in an empty store"
          width={600}
          height={600}
        />
      </div>
    );
  }

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
