import { type Metadata } from "next/types";
import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { cn } from "@/utils/cn";

export const metadata = {
  title: "Nyttige lenker",
} satisfies Metadata;

export default function NyttigeLenker() {
  return (
    <Container>
      <Heading>Nyttige lenker</Heading>
      <Link href={`https://www.youtube.com/watch?v=dQw4w9WgXcQ`}
            target="_blank"
      >
      <div
        className={cn(
          "group flex h-full flex-col gap-3 rounded-lg p-5 shadow-lg hover:bg-muted"
        )}
      >
        <h2 className="text-2xl font-bold">{"Viktig info for nye elever"}</h2>
      </div>
    </Link>
    </Container>
  );
}
