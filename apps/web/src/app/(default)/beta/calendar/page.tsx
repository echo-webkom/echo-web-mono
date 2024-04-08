"use client";

import { useState } from "react";

import { Container } from "@/components/container";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CalendarUrlBuilder,
  INCLUDE_BEDPRES_REGISTRATION_PARAM,
  INCLUDE_MOVIES_PARAM,
  INCLUDE_PAST_PARAM,
} from "@/lib/calendar-url-builder";
import { type HappeningType } from "@/sanity/happening";

const eventTypes: Array<{
  name: string;
  value: HappeningType;
}> = [
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
  const [types, setTypes] = useState<Array<HappeningType>>(["bedpres", "event"]);
  const [includePast, setIncludePast] = useState<boolean>(false);
  const [includeMovies, setIncludeMovies] = useState<boolean>(false);
  const [includeBedpresRegistration, setIncludeBedpresRegistration] = useState<boolean>(false);

  const addToTypes = (type: HappeningType) => {
    if (!types.includes(type)) {
      setTypes([...types, type]);
    }
  };

  const removeFromTypes = (type: string) => {
    setTypes(types.filter((t) => t !== type));
  };

  const calendarBuilder = new CalendarUrlBuilder();
  calendarBuilder.setIncludePast(includePast);
  calendarBuilder.setHappeningType(types);
  calendarBuilder.setIncludeMovies(includeMovies);
  calendarBuilder.setIncludeBedpresRegistration(includeBedpresRegistration);
  const calendarUrl = calendarBuilder.build();

  return (
    <Container className="max-w-screen-sm space-y-4 py-10">
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
          id={INCLUDE_PAST_PARAM}
          checked={includePast}
          onCheckedChange={(checked) =>
            setIncludePast(checked === "indeterminate" ? true : checked)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor={INCLUDE_PAST_PARAM}>Inkluder hendelser som allerede har skjedd</Label>
        </div>
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          id={INCLUDE_MOVIES_PARAM}
          checked={includeMovies}
          onCheckedChange={(checked) =>
            setIncludeMovies(checked === "indeterminate" ? true : checked)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor={INCLUDE_MOVIES_PARAM}>Inkluder filmer i kalenderen</Label>
        </div>
      </div>

      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox
          id={INCLUDE_BEDPRES_REGISTRATION_PARAM}
          checked={includeBedpresRegistration}
          onCheckedChange={(checked) =>
            setIncludeBedpresRegistration(checked === "indeterminate" ? true : checked)
          }
        />
        <div className="space-y-1 leading-none">
          <Label htmlFor={INCLUDE_BEDPRES_REGISTRATION_PARAM}>
            Inkluder registrering for bedriftspresentasjoner
          </Label>
        </div>
      </div>

      <Text>Kopier link eller last ned .ics-fil</Text>

      <Input type="text" value={calendarUrl} readOnly />

      <Button asChild>
        {/* eslint-disable-next-line react/jsx-no-target-blank */}
        <a href={calendarUrl} download target="_blank">
          Last ned .ics
        </a>
      </Button>
    </Container>
  );
}
