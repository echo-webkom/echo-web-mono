import Marquee from "react-fast-marquee";

import { type AllHsApplicationsResult } from "@echo-webkom/cms/types";
import { cdnClient, urlFor } from "@echo-webkom/sanity";
import { allHsApplications } from "@echo-webkom/sanity/queries";

import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ellipsis, initials } from "@/utils/string";

const fetchAllHsApplications = async () => {
  return await cdnClient.fetch<AllHsApplicationsResult>(allHsApplications);
};

export const HSApplications = async () => {
  const applications = await fetchAllHsApplications();

  return (
    <div>
      <Heading level={3}>Årets søkere til Hovedstyret!</Heading>

      <Text className="mb-5 text-muted-foreground">Trykk på en søker for å lese mer om dem.</Text>

      <Marquee gradient pauseOnHover gradientColor="var(--background)">
        {applications.map((application) => {
          return <Application key={application.profile._id} application={application} />;
        })}
      </Marquee>
    </div>
  );
};

type ApplicationProps = {
  application: AllHsApplicationsResult[number];
};

const Application = ({ application }: ApplicationProps) => {
  const imageUrl = application.profile.picture ? urlFor(application.profile.picture).url() : "";

  const name = ellipsis(application.profile.name, 13);

  return (
    <div key={application.profile._id} className="w-36 overflow-hidden">
      <a
        className="group flex flex-col"
        href={application.poster ?? "/"}
        target="_blank"
        rel="noreferrer"
      >
        <Avatar className="mx-auto size-16 flex-shrink-0">
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
