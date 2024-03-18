import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { RxArrowRight as ArrowRight } from "react-icons/rx";

import { auth } from "@echo-webkom/auth";
import { db } from "@echo-webkom/db";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mailTo } from "@/utils/prefixes";

//import { getNextBedpresAfterBan } from "@/data/happenings/queries";

export default async function UserStrikePagez() {
  const user = await auth();

  if (!user) {
    return redirect("/auth/logg-inn");
  }

  //const nextBedpres = user.isBanned ? await getNextBedpresAfterBan(user) : null;

  const strikes = await db.query.strikes.findMany({
    where: (strike) => eq(strike.userId, user.id),
    with: {
      strikeInfo: {
        with: {
          happening: true,
          issuer: true,
        },
      },
    },
  });
  //  {nextBedpres && <h1>Du er utestengt til: {nextBedpres}</h1>}

  return (
    <div className="max-w-4xl">
      <Heading level={2} className="mb-4">
        Oversikt over dine prikker
      </Heading>

      <div className="mb-10">
        <Text>
          <Link
            className="group flex items-center underline-offset-4 hover:underline"
            href="https://docs.google.com/document/d/1hzkwiVmdsLov-A-57AMdbkkvGgNAC25cQ_YmAf-zzZI/edit"
          >
            <ArrowRight className="inline h-6 w-6 transition-transform group-hover:translate-x-2" />
            <h2 className="ml-2 text-center">Les om Bedkom sine retningslinjer</h2>
          </Link>
        </Text>
        <Text>
          For spørsmål om dine prikker, ta kontakt med bedkom på{" "}
          <Link href={mailTo("bedkom@echo.uib.no")} className="underline">
            bedkom@echo.uib.no
          </Link>
        </Text>
      </div>

      {strikes.length > 0 ? (
        <Table>
          <TableHeader>
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
                  <TableCell>{strike.strikeInfo.createdAt.toDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <p className="text-2xl">Du har ingen prikker. Fortsett sånn!</p>
      )}
    </div>
  );
}
