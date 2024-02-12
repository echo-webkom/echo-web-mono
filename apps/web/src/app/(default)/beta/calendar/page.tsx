"use client";

import { useState } from "react";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const eventTypes = [
  {
    name: "Arrangement",
    value: "event",
  },
  {
    name: "Bedriftspresentasjon",
    value: "bedpres",
  },
];

export default function Calendar() {
  const [types, setTypes] = useState<Array<(typeof eventTypes)[number]["value"]>>([
    "bedpres",
    "events",
  ]);
  const [includePast, setIncludePast] = useState<boolean>(false);

  const addToTypes = (type: string) => {
    if (!types.includes(type)) {
      setTypes([...types, type]);
    }
  };

  const removeFromTypes = (type: string) => {
    setTypes(types.filter((t) => t !== type));
  };

  // Bad code
  const url = new URL(
    `${process.env.NODE_ENV === "production" ? "https://echo.uib.no" : "http://localhost:3000"}/api/calendar`,
  );

  if (includePast) {
    url.searchParams.set("includePast", "true");
  } else {
    url.searchParams.delete("includePast");
  }

  for (const type of types) {
    url.searchParams.append("happeningType", type);
  }

  return (
    <Container className="max-w-screen-sm space-y-4">
      <div>
        <Heading>Kalender</Heading>

        <Text>Legg til kommende hendelser i kalenderen din</Text>
      </div>

      <div className="space-y-2 rounded-md border p-4">
        <h2>Typer</h2>

        {eventTypes.map((type) => (
          <div key={type.value} className="flex flex-row items-start space-x-3 space-y-0">
            <Checkbox
              id={type.value}
              checked={types.includes(type.value)}
              onCheckedChange={(checked) =>
                checked === "indeterminate"
                  ? removeFromTypes(type.value)
                  : checked
                    ? addToTypes(type.value)
                    : removeFromTypes(type.value)
              }
            />
            <div className="space-y-1 leading-none">
              <Label htmlFor={type.value}>{type.name}</Label>
              <Text size="sm" className="text-muted-foreground">
                Få varsel om {type.name.toLowerCase()}
              </Text>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          id="includePast"
          checked={includePast}
          onCheckedChange={(checked) =>
            setIncludePast(checked === "indeterminate" ? true : checked)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor="includePast">Inkluder hendelser som allerede har skjedd</Label>
        </div>
      </div>

      <Text>Kopier link eller last ned .ics-fil</Text>

      <Input type="text" value={url.toString()} readOnly />

      <Button asChild>
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a href={url.toString()} download target="_blank">
          Last ned .ics
        </a>
      </Button>
    </Container>
  );
}
