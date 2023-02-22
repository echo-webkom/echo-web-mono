import {type NextPage} from "next";
import {motion} from "framer-motion";
import Link from "next/link";
import {Layout} from "@/components";
import {signIn, signOut, useSession} from "next-auth/react";
import {api} from "@/utils/api";

const HomePage: NextPage = () => {
  return (
    <Layout>
      <AuthShowcase />
      <div className="px-16 pt-52">
        <div className="overflow-hidden">
          <motion.h1
            initial={{y: "120%"}}
            animate={{y: "0%"}}
            transition={{duration: 0.75}}
            className="text-echo-black text-7xl font-extrabold"
          >
            echo
          </motion.h1>
        </div>
        <motion.h3
          initial={{
            opacity: "0%",
          }}
          animate={{opacity: "100%"}}
          transition={{duration: 0.75}}
          className="font-thin"
        >
          linjeforeningen for informatikk
        </motion.h3>
      </div>
      <div className="flex flex-col items-center gap-4 overflow-hidden py-8 px-16">
        {" "}
        <Link
          href={"/for-studenter/bedriftspresentasjoner"}
          className="bg-echo-blue-dark hover:bg-echo-blue-light w-80 rounded-full px-10 py-2 text-center font-bold
                            text-white transition-all duration-300"
        >
          Bedriftspresentasjoner
        </Link>
        <Link
          href={"/for-studenter/arrangementer"}
          className="border-echo-black bg-echo-yellow-dark text-echo-black hover:bg-echo-yellow-light w-80 rounded-full
                            border-2 px-10 py-2 text-center font-bold transition-all duration-300"
        >
          Arrangementer
        </Link>
      </div>
    </Layout>
  );
};

export default HomePage;

const AuthShowcase: React.FC = () => {
  const {data: sessionData} = useSession();

  const {data: secretMessage} = api.auth.getSecretMessage.useQuery(
    undefined, // no input
    {enabled: sessionData?.user !== undefined},
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
