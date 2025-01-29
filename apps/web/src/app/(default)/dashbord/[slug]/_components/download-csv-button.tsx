"use client";

import React, { useMemo, useState } from "react";
import { RxChevronDown } from "react-icons/rx";

import { type Question } from "@echo-webkom/db/schemas";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toRelative } from "@/utils/url";
import { getColumns } from "../_lib/get-columns";

type DownloadCsvButtonProps = {
  slug: string;
  questions: Array<Question>;
};

export const DownloadCsvButton = ({ slug, questions }: DownloadCsvButtonProps) => {
  const headers = useMemo(() => getColumns(questions), [questions]);
  const [selectedHeaders, setSelectedHeaders] = useState<Array<string>>([]);

  const handleCheckedChange = (header: string) => {
    if (selectedHeaders.includes(header)) {
      setSelectedHeaders((prev) => prev.filter((key) => key !== header));
    } else {
      setSelectedHeaders((prev) => [...prev, header]);
    }
  };

  const url = useMemo(() => {
    const url = new URL("https://echo.uib.no");
    url.pathname = "/api/registrations";
    url.searchParams.set("slug", slug);
    for (const header of selectedHeaders) {
      url.searchParams.append("header", header);
    }

    return url;
  }, [slug, selectedHeaders]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex gap-2">
          Last ned
          <RxChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {headers.map((header) => {
          const isChecked = selectedHeaders.includes(header);
          return (
            <DropdownMenuCheckboxItem
              onSelect={(e) => e.preventDefault()}
              key={header + "checkbox"}
              checked={isChecked}
              onCheckedChange={() => handleCheckedChange(header)}
            >
              {header}
            </DropdownMenuCheckboxItem>
          );
        })}
        <div>
          <Button asChild variant="outline" className="mx-2 mb-2 mt-4">
            <a href={toRelative(url)} download>
              Last ned csv
            </a>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
