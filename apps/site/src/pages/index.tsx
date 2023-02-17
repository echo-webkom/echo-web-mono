import { type NextPage } from "next";
import Link from "next/link";
import Layout from "../components/Layout";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="">
        <div className="px-16 pt-52">
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "120%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.75 }}
              className="text-7xl font-extrabold text-echo-black"
            >
              echo
            </motion.h1>
          </div>
          <motion.h3
            initial={{
              opacity: "0%",
            }}
            animate={{ opacity: "100%" }}
            transition={{ duration: 0.75 }}
            className="font-thin"
          >
            linjeforeningen for informatikk
          </motion.h3>
        </div>
        <div className="flex flex-col items-center gap-4 overflow-hidden py-8 px-16">
          {" "}
          <Link
            href={"/for-studenter/bedriftspresentasjoner"}
            className="w-80 rounded-full bg-echo-blue-dark px-10 py-2 text-center font-bold text-white 
                            transition-all duration-300 hover:bg-echo-blue-light"
          >
            Bedriftspresentasjoner
          </Link>
          <Link
            href={"/for-studenter/arrangementer"}
            className="w-80 rounded-full border-2 border-echo-black bg-echo-yellow-dark px-10 
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
