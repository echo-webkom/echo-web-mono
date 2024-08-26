import Link from "next/link";
import { redirect } from "next/navigation";
import { BiHelpCircle } from "react-icons/bi";
import { RxArrowRight as ArrowRight } from "react-icons/rx";

import { Chip } from "@/components/typography/chip";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUserStrikes } from "@/data/strikes/queries";
import { getNextBedpresAfterBan } from "@/lib/ban-info";
import { getUser } from "@/lib/get-user";
import { split } from "@/utils/list";
import { mailTo } from "@/utils/prefixes";

export default async function UserStrikePagez() {
  const user = await getUser();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  const strikes = (await getAllUserStrikes(user.id)).reverse();

  const [validStrikes, earlierStrikes] = split(
    strikes,
    (strike) => strike.id > (user.bannedFromStrike ?? -1),
  );

  const nextBedpresAfterBan = user.isBanned ? await getNextBedpresAfterBan(user) : null;

  return (
    <div className="max-w-4xl">
      <Heading level={2} className="my-4">
        Oversikt over dine prikker
      </Heading>
      {user.isBanned && (
        <p className="mb-2 font-semibold text-destructive">
          Du er utestengt{" "}
          {nextBedpresAfterBan && (
            <>
              til:{" "}
              <Link className="hover:underline" href={`/bedpres/${nextBedpresAfterBan.slug}`}>
                {nextBedpresAfterBan.title}
              </Link>
            </>
          )}
        </p>
      )}
      {validStrikes.length === 0 && earlierStrikes.length === 0 && (
        <p className="mb-2">Du har ingen prikker. Fortsett sånn!</p>
      )}

      <div className="relative sm:w-fit">
        <Popover>
          <PopoverTrigger className="absolute right-2 top-2">
            <BiHelpCircle className="size-6" />
          </PopoverTrigger>
          <PopoverContent>
            For spørsmål om dine prikker, ta kontakt med bedkom på{" "}
            <Link href={mailTo("bedkom@echo.uib.no")} className="underline">
              bedkom@echo.uib.no
            </Link>
          </PopoverContent>
        </Popover>
        <div className="rounded-xl bg-muted">
          <div className="w-fit px-4 pt-1">
            <Chip variant="secondary" className="my-6 block text-xl">
              {validStrikes.toString() || 0 + " gyldige prikker"}
            </Chip>
            <Chip variant="primary" className="my-6 block text-xl">
              {validStrikes.toString() || 0 + " tidligere prikker"}
            </Chip>
          </div>
          <Link
            className="group flex items-center space-x-1 p-2 underline-offset-4 hover:underline"
            href="https://docs.google.com/document/d/1hzkwiVmdsLov-A-57AMdbkkvGgNAC25cQ_YmAf-zzZI/edit"
          >
            <h2 className="ml-2 text-center">Les om Bedkom sine retningslinjer</h2>
            <ArrowRight className="inline size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
      {validStrikes.length > 0 && (
        <>
          <Heading className="mt-8" level={3}>
            Gyldige prikker
          </Heading>
          <Text size="sm">
            Får du 5 gyldige prikker vil du bli utestengt fra 3 bedriftspresentasjoner.
          </Text>
          <StrikeTable strikes={validStrikes} />
        </>
      )}
      {earlierStrikes.length > 0 && (
        <>
          <Heading level={3} className="mt-8">
            Tidligere prikker
          </Heading>
          <Text size="sm">
            Disse prikkene er ikke lenger gyldige, og regnes ikke med i en eventuell neste
            utestengelse.
          </Text>
          <StrikeTable strikes={earlierStrikes} />
        </>
      )}
    </div>
  );
}

function StrikeTable({ strikes }: { strikes: Awaited<ReturnType<typeof getAllUserStrikes>> }) {
  return (
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead scope="col">Bedpres</TableHead>
          <TableHead scope="col">Årsak</TableHead>
          <TableHead scope="col">Dato utstedt</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {strikes.map((strike) => {
          return (
            <TableRow key={strike.id}>
              <TableCell>
                <Link
                  className="hover:underline"
                  href={`/bedpres/${strike.strikeInfo.happening.slug}`}
                >
                  {strike.strikeInfo.happening.title}
                </Link>
              </TableCell>
              <TableCell>{strike.strikeInfo.reason}</TableCell>
              <TableCell>{new Date(strike.strikeInfo.createdAt).toDateString()}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
