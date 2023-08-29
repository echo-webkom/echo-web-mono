"use client";

import { Container } from "@/components/container";
import { ErrorBox } from "@/components/error-box";
import { Heading } from "@/components/ui/heading";

export default function BedpresErrorPage({ error }: { error: Error }) {
  return (
    <Container className="mx-auto max-w-4xl">
      <Heading>404</Heading>
      <p className="text-center">Finner ikke bedriftspresentasjonen du ser etter.</p>

      <div className="my-5" />

      <ErrorBox error={error} />
    </Container>
  );
}
