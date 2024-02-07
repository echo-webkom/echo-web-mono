import Image from "next/image";
import Link from "next/link";

import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <Heading className="text-center">FINNER IKKE SIDEN ...</Heading>
      <div className="flex w-full flex-grow flex-col py-10 text-center">
        <Text size="lg">Siden du leter etter finnes ikke 😐 </Text>
      </div>
      <Image
        className=" grid place-self-center rounded-lg"
        src="/gif/empty-shelves-john-travolta.gif"
        alt="John Travolta"
        width={400}
        height={400}
      />
      <Link href="/" className="flex w-full flex-grow flex-col py-10 text-center hover:underline">
        Du kan komme til hovedsiden ved å trykke her
      </Link>
    </div>
  );
}
