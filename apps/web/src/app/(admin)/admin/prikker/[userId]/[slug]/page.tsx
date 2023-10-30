import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { db } from "@echo-webkom/db";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";

type Props = {
  params: {
    userId: string;
    slug: string;
  };
};

export default async function AdminUserStrikesPage({ params }: Props) {
  const { userId, slug } = params;

  const strike = await db.query.strikes.findFirst({
    where: (strike) => and(eq(strike.userId, userId), eq(strike.happeningSlug, slug)),
    with: {
      user: true,
      happening: true,
    },
  });

  if (!strike) {
    return notFound();
  }

  return (
    <Container>
      <Heading>
        Viewing {userId} strike for {slug}
      </Heading>

      <p>{strike.reason}</p>
    </Container>
  );
}
