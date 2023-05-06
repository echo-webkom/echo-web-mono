"use client";

import Container from "@/components/container";
import ErrorBox from "@/components/error-box";
import Heading from "@/components/ui/heading";

export default function EventErrorPage({error}: {error: Error}) {
  return (
    <Container className="mx-auto max-w-4xl">
      <Heading className="text-center">404</Heading>
      <p className="text-center">Finner ikke arrangementet du ser etter.</p>

      <div className="my-5" />

      <ErrorBox error={error} />
    </Container>
  );
}
