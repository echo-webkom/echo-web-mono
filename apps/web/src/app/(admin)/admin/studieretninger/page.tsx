import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllDegrees } from "@/data/degrees/queries";
import { ensureWebkom } from "@/lib/ensure";

export const dynamic = "force-dynamic";

export default async function AdminDegreePage() {
  await ensureWebkom();
  const degrees = await getAllDegrees();

  return (
    <Container>
      <Heading>Studieretninger</Heading>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle studieretninger</p>

        <p>
          <i>(Ikke implementert enda)</i> Burde være mulig å legge til flere her.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>id</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {degrees.map((degree) => {
            return (
              <TableRow key={degree.id}>
                <TableCell>{degree.name}</TableCell>
                <TableCell>{degree.id}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
}
