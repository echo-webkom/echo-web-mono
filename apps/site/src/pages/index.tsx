import { type NextPage } from "next";
import Image from "next/image";
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
              transition={{ delay: 0.25, duration: 0.75 }}
              className="text-7xl font-extrabold text-echo-black"
            >
              echo
            </motion.h1>
          </div>
          <motion.h3
            initial={{
              opacity: "0%",
              fontSize: "12px",
              transformOrigin: "center",
            }}
            animate={{ opacity: "100%", fontSize: "16px" }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="font-thin"
          >
            linjeforeningen for informatikk
          </motion.h3>
        </div>
        <div className="flex gap-4 overflow-hidden py-8 px-12">
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
