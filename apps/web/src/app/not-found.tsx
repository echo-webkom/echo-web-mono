import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto my-10 flex w-fit flex-grow flex-col gap-5 text-center">
        <Heading>404 - Not Found</Heading>
        <Image
          className="rounded-xl"
          src="/gif/awkward-jim.gif"
          alt="Awkward Jim"
          height={500}
          width={500}
        />
        <Button variant="secondary" asChild>
          <Link href="/">Til hovedsiden</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
