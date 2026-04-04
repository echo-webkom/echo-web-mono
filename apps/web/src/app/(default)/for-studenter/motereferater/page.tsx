import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { unoWithAdmin } from "@/api/server";
import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { StaticPageSidebar } from "@/lib/static-page-sidebar";
import { shortDateNoTime } from "@/utils/date";

export default async function MinuteOverview() {
  const minutes = await unoWithAdmin.sanity.minutes.all().catch(() => []);

  return (
    <Container className="flex flex-row py-10">
      <StaticPageSidebar />

      <div className="flex-1">
        <Heading className="mb-4">Møtereferater</Heading>
        <ul className="divide-y overflow-hidden rounded-lg border">
          {minutes.map((minute) => (
            <li key={minute._id}>
              <Link href={"/for-studenter/motereferat/" + minute._id}>
                <div className="group hover:bg-muted flex items-center justify-between px-5 py-5 transition-all hover:py-10">
                  <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Text size="lg">{minute.isAllMeeting ? "Generalforsamling" : "Møte"}</Text>

                    <div className="flex items-center gap-2">
                      <p>{shortDateNoTime(minute.date)}</p>
                      <ArrowRight className="hidden h-8 w-8 rounded border p-2 sm:block" />
                    </div>
                  </div>

                  <div className="block sm:hidden">
                    <ArrowRight className="h-10 w-10 rounded border p-2" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
