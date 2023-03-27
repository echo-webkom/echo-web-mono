import {type AppType} from "next/app";
import {IBM_Plex_Mono, Inter} from "next/font/google";
import {api} from "@/utils/api";
import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";

import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
});
const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
});

const ibmPlexMonoDisplay = IBM_Plex_Mono({
  weight: "700",
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
            --inter-display-font: ${ibmPlexMonoDisplay.style.fontFamily};
          }

          body {
            overflow-x: hidden;
          }
        `}
      </style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
