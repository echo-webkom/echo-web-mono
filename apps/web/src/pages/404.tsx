import Image from "next/image";
import Link from "next/link";
import Container from "@/components/container";
import Layout from "@/components/layout";

const FourOhFour = () => {
  return (
    <Layout>
      <Container className="my-auto items-center justify-center gap-10 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">404 Not Found</h1>
        <Image
          alt="Confused Jim Gif"
          src="/gif/awkward-jim.gif"
          height="300"
          width="600"
          className="rounded-md"
        />
        <p className="font-mono text-xl">Beklager, finner ikke siden du ser etter.</p>
        <Link href="/" className="text-center font-mono text-blue-500 underline hover:no-underline">
          Ta meg til forsiden
        </Link>
      </Container>
    </Layout>
  );
};

export default FourOhFour;
