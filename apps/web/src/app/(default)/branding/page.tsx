import Link from "next/link";
import componentDocs from "@/data/component-docs.json";
import { Component, ArrowRight, Layers, FileCode } from "lucide-react";

export default function BrandingWelcomePage() {
  const totalProps = componentDocs.reduce(
    (acc, curr) => acc + Object.keys(curr.props).length,
    0
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">Design System & Brand</h1>
        <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
          Welcome to the living component library. These UI building blocks are extracted directly
          from our codebase, syncing JSDoc descriptions and TypeScript types automatically.
        </p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Component className="h-4 w-4" />
            <span className="text-xs uppercase font-medium">Components</span>
          </div>
          <div className="text-2xl font-bold">{componentDocs.length}</div>
        </div>

        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Layers className="h-4 w-4" />
            <span className="text-xs uppercase font-medium">Documented Props</span>
          </div>
          <div className="text-2xl font-bold">{totalProps}</div>
        </div>

        <div className="rounded-lg border border-border p-4 bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileCode className="h-4 w-4" />
            <span className="text-xs uppercase font-medium">Extractor</span>
          </div>
          <div className="text-2xl font-bold">react-docgen</div>
        </div>
      </div>

      {/* Featured / Component Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Available Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {componentDocs.slice(0, 8).map((comp) => (
            <Link
              key={comp.slug}
              href={`/branding/${comp.slug}`}
              className="group p-4 rounded-lg border border-border hover:border-foreground/20 hover:bg-muted/20 transition-colors flex items-center justify-between"
            >
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">
                  {comp.displayName}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {comp.description || "No description provided."}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}