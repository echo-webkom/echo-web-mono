import Link from "next/link";
import Image from "next/image";

import {Layout} from "@/components";

const FourOhFour = () => {
  return (
    <Layout>
      <div className="my-auto flex flex-col items-center justify-center gap-10 px-3 text-center">
        <h1 className="text-4xl font-bold md:text-6xl">404 Not Found</h1>
        <Image
          alt="Confused Jim Gif"
          src="/gif/awkward-jim.gif"
          height="300"
          width="600"
          className="rounded-md"
        />
        <p className="font-mono text-xl">
          Beklager, finner ikke siden du ser etter.
        </p>
        <Link
          href={"/"}
          className="text-center font-mono text-blue-500 underline hover:no-underline"
        >
          Ta meg til forsiden
        </Link>
      </div>
    </Layout>
  );
};

export default FourOhFour;
