import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="">
        <div className="px-16 pt-52">
          <h1 className="text-7xl font-extrabold text-echo-black">echo</h1>
          <h3 className="font-thin">linjeforeningen for informatikk</h3>
        </div>
        <div className="flex gap-4 py-8 px-12">
          <Link
            href={"/for-studenter/bedpres"}
            className="w-[12rem] rounded-full bg-echo-blue-dark px-10 py-2 text-center font-bold text-white 
                            transition-all duration-300 hover:bg-echo-blue-light"
          >
            Bedpresser
          </Link>
          <Link
            href={"/for-studenter/arrangementer"}
            className="w-[12rem] rounded-full border-2 border-echo-black bg-echo-yellow-dark px-10 
                            py-2 text-center font-bold text-echo-black transition-all duration-300 hover:bg-echo-yellow-light"
          >
            Arrangementer
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
