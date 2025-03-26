import Link from "next/link";
import { notFound } from "next/navigation";
import { and, desc, eq, lt } from "drizzle-orm";

import { db } from "@echo-webkom/db/serverless";

import { Container } from "@/components/container";
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
import { getAllUserStrikes } from "@/data/strikes/queries";
import { getNextBedpresAfterBan } from "@/lib/ban-info";
import { ensureBedkom } from "@/lib/ensure";
import { split } from "@/utils/list";
import { AddStrikeButton, RemoveBanButton, RemoveStrikeButton } from "./strike-button";

type Props = {
  params: {
    userId: string;
  };
};

export default async function UserStrikesPage({ params }: Props) {
  await ensureBedkom();
  const { userId } = params;

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, userId),
  });

  if (!user) {
    return notFound();
  }

  const strikes = (await getAllUserStrikes(userId)).reverse();

  const [validStrikes, earlierStrikes] = split(
    strikes,
    (strike) => strike.id > (user.bannedFromStrike ?? -1),
  );

  const prevBedpresses = await db.query.happenings.findMany({
    where: (happening) =>
      and(
        lt(happening.date, new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)), // 2 weeks from now
        eq(happening.type, "bedpres"),
      ),
    orderBy: (happening) => [desc(happening.date)],
    limit: 10,
  });

  const nextBedpresAfterBan = user.isBanned ? await getNextBedpresAfterBan(user) : null;

  return (
    <Container>
      <div className="justify-between sm:flex">
        <div>
          <Heading>{user.name}</Heading>

          {user.isBanned && (
            <div className="text-lg text-destructive">
              Brukeren er utestengt{" "}
              {nextBedpresAfterBan && (
                <>
                  til:{" "}
                  <Link className="hover:underline" href={`/bedpres/${nextBedpresAfterBan.slug}`}>
                    {nextBedpresAfterBan.title}
                  </Link>
                </>
              )}
            </div>
          )}

          <Text>
            <span>Gyldige prikker: {validStrikes.length}</span>
            <span>Totalt antall prikker: {strikes.length}</span>
          </Text>
        </div>
        <div className="flex flex-col gap-4">
          <AddStrikeButton
            happenings={prevBedpresses}
            user={{
              id: userId,
              name: user.name,
              email: user.email,
            }}
            currentAmount={validStrikes.length}
            variant="destructive"
            className="min-w-28"
          />
          {user.isBanned && (
            <RemoveBanButton userId={userId} variant="default" className="min-w-28" />
          )}
        </div>
      </div>

      {validStrikes.length === 0 && earlierStrikes.length === 0 && (
        <Text className="mt-5 font-semibold">Brukeren har ingen prikker</Text>
      )}

      {validStrikes.length > 0 && (
        <>
          <Heading className="mt-8" level={3}>
            Gyldige prikker
          </Heading>
          <Text size="sm">Prikker siden forrige gang brukeren ble utestengt.</Text>
          <StrikeTable strikes={validStrikes} userId={userId} />
        </>
      )}

      {earlierStrikes.length > 0 && (
        <>
          <Heading level={3} className="mt-8">
            Tidligere prikker
          </Heading>
          <Text size="sm">Disse prikkene regnes ikke med i neste utestengelse.</Text>
          <StrikeTable strikes={earlierStrikes} userId={userId} />
        </>
      )}
    </Container>
  );
}

const StrikeTable = ({
  strikes,
  userId,
}: {
  strikes: Awaited<ReturnType<typeof getAllUserStrikes>>;
  userId: string;
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Bedpres</TableHead>
          <TableHead scope="col">Årsak</TableHead>
          <TableHead scope="col">Dato gitt</TableHead>
          <TableHead scope="col">Gitt av</TableHead>
          <TableHead scope="col">{/** Actions */}</TableHead>
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
              <TableCell>
                {strike.strikeInfo.issuer.id === userId
                  ? "Automatisk"
                  : strike.strikeInfo.issuer.name}
              </TableCell>

              <TableCell>
                <RemoveStrikeButton strikeId={strike.id} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
