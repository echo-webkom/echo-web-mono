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
import AddDegreeButton from "./_components/add-degree-button";

export const dynamic = "force-dynamic";

export default async function AdminDegreePage() {
  const degrees = await getAllDegrees();

  return (
    <Container>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <Heading>Studieretninger</Heading>
        <AddDegreeButton>Legg til</AddDegreeButton>
      </div>

      <div className="flex flex-col gap-2 py-4">
        <p className="font-semibold">Oversikt over alle studieretninger</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Navn</TableHead>
            <TableHead>id</TableHead>
            <TableHead>{/* Actions */}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {degrees.map((degree) => {
            return (
              <TableRow key={degree.id}>
                <TableCell>{degree.name}</TableCell>
                <TableCell>{degree.id}</TableCell>
                <TableCell>
                  <AddDegreeButton initialDegree={degree}>Endre</AddDegreeButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Container>
  );
}
