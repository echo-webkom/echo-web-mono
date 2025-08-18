import { cache } from "react";
import Link from "next/dist/client/link";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Input } from "@/components/ui/input";
import { UtlanPreview } from "@/components/utlanPreview";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchAllUtlan } from "@/sanity/utlan";

export const metadata = {
  title: "Utlån",
};

const getData = cache(async () => {
  return await fetchAllUtlan();
});

export default async function UtlanOverviewPage() {
  const utlan = await getData();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div className="space-y-8">
        <Heading>Utlån </Heading>
        <p className="text-muted-foreground">
          Her finner du en oversikt over alle tilgjengelige utlån. Gjør deg kjent med reglene for
          utlån{" "}
          <Link href="/for-studenter/utlan/regler" className="hover:underline">
            her
          </Link>
          .
        </p>
        <div className="flex flex-row justify-between">
          <div>
            <Heading level={3}>Filtrer:</Heading>
          </div>
          <div className="flex flex-col gap-2">
            <Input placeholder="Søk..." />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
          {utlan.map((item) => (
            <div key={item._id}>
              <UtlanPreview item={item} />
            </div>
          ))}
        </div>
        {utlan.length === 0 && <p>Det er ingen ting tilgjengelig for utlån for øyeblikket.</p>}
      </div>
    </Container>
  );
}
