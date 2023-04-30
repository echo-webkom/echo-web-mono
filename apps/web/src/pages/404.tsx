import Image from "next/image";

import Container from "@/components/container";
import {ButtonLink} from "@/components/ui/button";
import DefaultLayout from "@/layouts/default";

const FourOhFour = () => {
  return (
    <DefaultLayout>
      <Container className="w-full max-w-xl justify-center gap-9 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">404 Not Found</h1>
        <p className="font-mono text-xl">Beklager, finner ikke siden du ser etter.</p>
        <Image
          alt="Confused Jim Gif"
          src="/gif/awkward-jim.gif"
          height="300"
          width="600"
          className="mx-auto rounded-md"
        />
        <ButtonLink variant="secondary" fullWidth href="/">
          Ta meg til forsiden
        </ButtonLink>
      </Container>
    </DefaultLayout>
  );
};

export default FourOhFour;
