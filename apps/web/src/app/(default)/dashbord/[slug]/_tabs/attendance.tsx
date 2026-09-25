import { QrCode } from "lucide-react";
import Link from "next/link";

import { unoWithAdmin } from "@/api/server";
import { type FullHappening, type SpotRange } from "@/api/uno/client";

import { Chip } from "../../../../../components/typography/chip";
import { Button } from "../../../../../components/ui/button";
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
      <div className="mt-8 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Heading>Ta oppmøte</Heading>
          <Chip variant="secondary" className="px-2 py-0.5">
            Beta feature
          </Chip>
        </div>
        <Button
          asChild
          size="sm"
          className="ml-auto h-9 w-9 shrink-0 p-0 sm:w-auto sm:px-4"
          aria-label="La deltagere møte opp selv"
        >
          <Link
            href={`/dashbord/${happening.slug}/qr-code`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <QrCode className="size-4 sm:hidden" aria-hidden="true" />
            <span className="hidden sm:inline">La deltagere møte opp selv</span>
          </Link>
        </Button>
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
