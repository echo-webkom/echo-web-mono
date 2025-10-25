import { cache } from "react";
import type { Metadata } from "next";

import { Container } from "@/components/container";
import { MerchPreview } from "@/components/merchPreview";
import { Heading } from "@/components/typography/heading";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchAllMerch } from "@/sanity/merch";

export const metadata: Metadata = {
  title: "Merch",
};

const getData = cache(async () => {
  return await fetchAllMerch();
});

export default async function MerchOverviewPage() {
  const merch = await getData();

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div className="space-y-8">
        <Heading>Merch</Heading>

        {merch.length === 0 ? (
          <p className="text-muted-foreground">Det er ingen merch tilgjengelig for øyeblikket.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {merch.map((item) => (
              <MerchPreview key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
