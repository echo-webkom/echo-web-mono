import type { ReactNode } from "react";
import componentDocs from "@/data/component-docs.json";
import { BrandingSidebar } from "./_components/branding-sidebar";

export default function BrandingLayout({ children }: { children: ReactNode }) {
  // Pass minimal metadata down to the sidebar client component
  const navItems = componentDocs
    .map((c) => ({
      displayName: c.displayName,
      slug: c.slug,
      propsCount: Object.keys(c.props).length,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  return (
    <div className="flex min-h-screen">
      <BrandingSidebar components={navItems} />
      <main className="flex-1 overflow-y-auto px-8 py-10">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}