"use client";

import Container from "@/components/container";
import Heading from "@/components/ui/heading";

export default function EventErrorPage({error}: {error: Error}) {
  return (
    <Container className="mx-auto max-w-4xl">
      <Heading level={2} className="text-center">
        En feil har skjedd.
      </Heading>
      <p className="text-center">{error.message}</p>
    </Container>
  );
}
