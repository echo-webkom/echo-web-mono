import { cache } from "react";

import { Container } from "@/components/container";
import { MerchPreview } from "@/components/merchPreview";
import { Heading } from "@/components/typography/heading";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { fetchAllMerch } from "@/sanity/merch";

export const metadata = {
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
        <Heading>Merch 💸</Heading>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 lg:grid-cols-2">
          {merch.map((item) => (
            <div key={item._id}>
              <MerchPreview item={item} />
            </div>
          ))}
        </div>
        {merch.length === 0 && <p>Det er ingen merch tilgjengelig for øyeblikket.</p>}
      </div>
    </Container>
  );
}
