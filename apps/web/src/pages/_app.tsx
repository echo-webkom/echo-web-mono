import {type AppType} from "next/app";
import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {Inter, IBM_Plex_Mono} from "next/font/google";

import {trpc} from "@/api/trpc";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
});
const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
});

const MyApp: AppType<{session: Session | null}> = ({
  Component,
  pageProps: {session, ...pageProps},
}) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
            --ibm-font: ${ibmPlexMono.style.fontFamily};
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
