"use client";

import Container from "@/components/container";
import ErrorBox from "@/components/error-box";

export default function EventErrorPage({error}: {error: Error}) {
  return (
    <Container className="mx-auto max-w-4xl">
      <h1 className="text-center text-5xl font-bold">404</h1>
      <p className="text-center">Finner ikke arrangementet du ser etter.</p>

      <div className="my-5" />

      <ErrorBox error={error} />
    </Container>
  );
}
