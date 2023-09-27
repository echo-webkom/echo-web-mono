import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import nb from "date-fns/locale/nb";

import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";
import { fetchMinutes } from "@/sanity/minutes";

export const dynamic = "force-static";

export default async function MinuteOverview() {
  const minutes = await fetchMinutes();

  return (
    <Container>
      <Heading>Møtereferater</Heading>

      <ul className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {minutes.map((minute) => (
          <li key={minute._id}>
            <Link href={"/for-studenter/motereferat/" + minute._id}>
              <div className="group rounded-lg p-5 hover:bg-muted">
                <Heading level={4}>{minute.isAllMeeting ? "Generalforsamling" : "Møte"}</Heading>

                <p>
                  <span className="font-semibold">Dato:</span>{" "}
                  {format(new Date(minute.date), "d. MMMM yyyy", { locale: nb })}
                </p>

                <p className="flex items-center gap-1 group-hover:underline">
                  Les mer
                  <span className="transition-all duration-150 group-hover:pl-1">
                    <ArrowRightIcon />
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
