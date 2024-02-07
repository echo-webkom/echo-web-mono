import { setFlagsFromString } from "v8";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Input } from "./ui/input";

export function jobAdSearch() {
  const params = useSearchParams();
  const [searchInput, setSearchInput] = useState(params.get("search") ?? "");

  return (
    <Input
      value={searchInput}
      maxLength={50}
      onChange={(e) => {
        setSearchInput(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      type="text"
      placeholder="Søk..."
      className="border-none bg-transparent pr-6"
    />
  );
}
