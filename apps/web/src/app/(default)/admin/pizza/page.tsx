"use client";

import { useState } from "react";

import { Container } from "@/components/container";
import { PizzaFormel } from "@/components/pizza-formel";
import { Heading } from "@/components/typography/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Pizza = () => {
  const [count, setCount] = useState(0);
  return (
    <Container className="flex w-fit flex-col items-center justify-center gap-4 p-4">
      <Heading className="mb-4">Pizza formel</Heading>
      <Label>Antall folk:</Label>
      <Input
        type="number"
        className="text-black"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        placeholder="Antall..."
      />
      <PizzaFormel count={count} />
    </Container>
  );
};

export default Pizza;
