import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

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
import { getPastHappenings } from "@/data/happenings/queries";
import { getAllUserStrikes } from "@/data/strikes/queries";
import { split } from "@/utils/list";
import { AddStrikeButton, RemoveStrikeButton } from "./strike-button";

type Props = {
  params: {
    userId: string;
  };
};

export default async function AdminUserStrikesPage({ params }: Props) {
  const { userId } = params;

  const user = await db.query.users.findFirst({
    where: (user) => eq(user.id, userId),
    columns: { name: true, email: true, bannedFromStrike: true },
  });

  if (!user) {
    return notFound();
  }

  const strikes = await getAllUserStrikes(userId);

  const { trueA: validStrikes, falseA: earlierStrikes } = split(
    strikes,
    (strike) => strike.id > (user.bannedFromStrike ?? -1),
  );

  const prevBedpresses = await getPastHappenings(10, "bedpres");

  return (
    <Container>
      <div className="flex justify-between">
        <Heading>{user.name} sine prikker</Heading>
        <AddStrikeButton
          happenings={prevBedpresses}
          user={{
            id: userId,
            name: user.name,
            email: user.email,
          }}
          currentAmount={validStrikes.length}
          variant="destructive"
        />
      </div>
      <Text>
        <div>Gyldige prikker: {validStrikes.length}</div>
        <div> Totalt antall prikker: {strikes.length}</div>
      </Text>

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

function StrikeTable({
  strikes,
  userId,
}: {
  strikes: Awaited<ReturnType<typeof getAllUserStrikes>>;
  userId: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Bedpres</TableHead>
          <TableHead scope="col">Årsak</TableHead>
          <TableHead scope="col">Dato gitt</TableHead>
          <TableHead scope="col">Gitt av</TableHead>
          <TableHead scope="col">Handling</TableHead>
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
}
