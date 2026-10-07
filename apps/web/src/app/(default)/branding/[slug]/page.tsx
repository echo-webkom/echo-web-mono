import { notFound } from "next/navigation";
import componentDocs from "@/data/component-docs.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return componentDocs.map((comp) => ({
    slug: comp.slug,
  }));
}

export default async function ComponentDocPage({ params }: Props) {
  const { slug } = await params;
  const comp = componentDocs.find((c) => c.slug === slug);

  if (!comp) notFound();

  const propEntries = Object.entries(comp.props);

  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs font-mono text-muted-foreground mb-1">{comp.filePath}</div>
        <h1 className="text-3xl font-bold tracking-tight">{comp.displayName}</h1>
        <p className="mt-2 text-muted-foreground text-base">
          {comp.description || "No description provided."}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Props API</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table className="w-full text-left text-sm">
            <TableHead className="bg-muted text-muted-foreground border-b border-border">
              <TableRow>
                <TableHeader className="p-3">Prop</TableHeader>
                <TableHeader className="p-3">Type</TableHeader>
                <TableHeader className="p-3">Default</TableHeader>
                <TableHeader className="p-3">Description</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody className="divide-y divide-border">
              {propEntries.length === 0 ? (
                <TableRow>
                  <td colSpan={4} className="p-4 text-center text-muted-foreground">
                    No custom props defined.
                  </td>
                </TableRow>
              ) : (
                propEntries.map(([name, prop]) => (
                  <TableRow key={name} className="hover:bg-muted/40">
                    <TableCell className="p-3 font-mono font-medium text-xs">
                      {name} {prop.required && <span className="text-red-500">*</span>}
                    </TableCell>
                    <TableCell className="p-3 font-mono text-xs text-blue-500 max-w-50 truncate" title={prop.type.name}>
                      {prop.type.name}
                    </TableCell>
                    <TableCell className="p-3 font-mono text-xs text-muted-foreground">
                      {prop.defaultValue?.value ?? "—"}
                    </TableCell>
                    <TableCell className="p-3 text-xs text-muted-foreground">
                      {prop.description || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}