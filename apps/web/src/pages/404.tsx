import Image from "next/image";
import {ButtonLink} from "@/components/button";
import Container from "@/components/container";
import Layout from "@/components/layout";

const FourOhFour = () => {
  return (
    <Layout>
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
        <ButtonLink fullWidth href="/">
          Ta meg til forsiden
        </ButtonLink>
      </Container>
    </Layout>
  );
};

export default FourOhFour;
