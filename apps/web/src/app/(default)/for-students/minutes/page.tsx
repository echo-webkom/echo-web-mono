import Link from "next/link";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";
import {fetchMinutes} from "@/sanity/minutes";

export default async function MinuteOverview() {
  const minutes = await fetchMinutes();

  return (
    <Container>
      <Heading>Møtereferater</Heading>

      <ul>
        {minutes.map((minute) => (
          <li key={minute._id}>
            <Link href={"/for-students/minute/" + minute._id}>
              <h1>{minute.title}</h1>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
