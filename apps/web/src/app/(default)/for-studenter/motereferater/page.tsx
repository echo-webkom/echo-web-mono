import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Container } from "@/components/container";
import { Heading } from "@/components/ui/heading";
import { fetchMinutes } from "@/sanity/minutes";
import { shortDateNoTime } from "@/utils/date";

export default async function MinuteOverview() {
  const minutes = await fetchMinutes();

  return (
    <Container>
      <Heading className="mb-4">Møtereferater</Heading>

      <ul className="divide-y border">
        {minutes.map((minute) => (
          <li key={minute._id}>
            <Link href={"/for-studenter/motereferat/" + minute._id}>
              <div className="group flex items-center justify-between px-5 py-5 transition-all hover:bg-gray-100 hover:py-10">
                <div className="flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Heading level={2}>
                      {minute.isAllMeeting ? "Generalforsamling" : "Møte"}
                    </Heading>
                  </div>

                  <div className="flex items-center gap-2">
                    <p>{shortDateNoTime(minute.date)}</p>
                    <ArrowRightIcon className="hidden h-8 w-8 rounded border p-2 sm:block" />
                  </div>
                </div>

                <div className="block sm:hidden">
                  <ArrowRightIcon className="h-10 w-10 rounded border p-2" />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
