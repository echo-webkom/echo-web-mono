import Link from "next/link";
import Marquee from "react-fast-marquee";

import { unoWithAdmin } from "@/api/server";
import type { UnoReturnType } from "@/api/uno/client";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { urlFor } from "@/lib/sanity";
import { ellipsis, initials } from "@/utils/string";

export const HSApplications = async () => {
  const applications = await unoWithAdmin.sanity.hsApplications.all();

  return (
    <div>
      <Heading level={3}>Årets søkere til Hovedstyret!</Heading>

      <Text className="text-muted-foreground mb-5">
        Trykk på en søker for å lese mer om dem. Eller se alle{" "}
        <Link className="underline" href="/sokere">
          søkere her
        </Link>
        .
      </Text>

      <Marquee gradient gradientColor="var(--background)">
        {applications.map((application) => {
          return <Application key={application.profile._id} application={application} />;
        })}
        {/* <ApplyNow /> */}
      </Marquee>
    </div>
  );
};

type ApplicationProps = {
  application: UnoReturnType["sanity"]["hsApplications"]["all"][number];
};

const Application = ({ application }: ApplicationProps) => {
  const imageUrl = application.profile.image?.asset._ref
    ? urlFor(application.profile.image).url()
    : "";

  const name = ellipsis(application.profile.name, 13);

  return (
    <div key={application.profile._id} className="w-36 overflow-hidden">
      <a
        className="group flex flex-col"
        href={application.poster ?? "/"}
        target="_blank"
        rel="noreferrer"
      >
        <Avatar size="lg" className="mx-auto shrink-0">
          <AvatarImage src={imageUrl} />
          <AvatarFallback className="bg-background text-foreground">
            {initials(application.profile.name)}
          </AvatarFallback>
        </Avatar>

        <Text size="sm" className="w-full text-center group-hover:underline">
          {name}
        </Text>
      </a>
    </div>
  );
};

// const ApplyNow = () => {
//   return (
//     <div>
//       <a
//         href="https://forms.gle/q2E24r5pjksaGNer7"
//         className="group flex items-center text-lg font-medium hover:underline"
//       >
//         ...kanskje deg? <LuArrowRight className="ml-2 transition-all group-hover:ml-3" />
//       </a>
//     </div>
//   );
// };
