import Image from "next/image";
import Link from "next/link";

import {Footer} from "@/components/footer";
import {Button} from "@/components/ui/button";
import {Heading} from "@/components/ui/heading";

/**
 * TODO:
 *
 * Add header. Could not use the header component because of
 * `useSession` hook used inside of the header component.
 */

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
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
