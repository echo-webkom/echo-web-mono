"use client";

import { useState, useTransition } from "react";

import toggleHsApplications from "./toggle-hs-applications";

type Props = {
  initialValue: boolean;
};

export default function ToggleHsApplications({ initialValue }: Props) {
  const [value, setValue] = useState(initialValue);
  const [isPending, startTransition] = useTransition();

  function handleChange() {
    const nextValue = !value;
    setValue(nextValue);
    startTransition(async () => {
      try {
        await toggleHsApplications(nextValue);
      } catch (e) {
        console.error("Toggle failed", e);
      }
    });
  }

  return (
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        name="Hs deltakere"
        checked={value}
        onChange={handleChange}
        disabled={isPending}
      />
      HS deltakere
    </label>
  );
}
