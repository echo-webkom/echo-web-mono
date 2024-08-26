"use client";

import React, { useMemo, useState } from "react";
import { RxChevronDown } from "react-icons/rx";

import { selectUserSchema, type Question } from "@echo-webkom/db/schemas";

import { zodKeys } from "@/lib/zod-keys";
import { toRelative } from "@/utils/url";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type HeaderType = "name" | "email" | "alternativeEmail" | "degreeId" | "year" | "status";

const formatHeaders: Record<HeaderType, string> = {
  name: "Navn",
  email: "Epost",
  alternativeEmail: "Alternativ Epost",
  year: "År",
  degreeId: "Studieretning",
  status: "Status",
};

const getColumns = (questions: Array<Question>) => {
  const columns = [...zodKeys(selectUserSchema)]
    .filter((key) => key in formatHeaders)
    .map((key) => formatHeaders[key as HeaderType]);

  columns.push(...questions.map((question) => question.title));
  columns.push("Status");

  return columns;
};

type DownloadCsvButtonProps = {
  slug: string;
  questions: Array<Question>;
};

export const DownloadCsvButton = ({ slug, questions }: DownloadCsvButtonProps) => {
  const columns = useMemo(() => getColumns(questions), [questions]);
  const [selectedHeaders, setSelectedHeaders] = useState(columns);

  const filteredColumns = columns
    .filter((header) => header !== undefined)
    .filter((header) => header.trim() !== "");

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
    <div>
      <div className="overflow-y-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-full">
            <DropdownMenu modal>
              <DropdownMenuTrigger asChild>
                <Button className="ml-auto flex gap-2">
                  Last ned
                  <RxChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filteredColumns.map((header) => {
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
          </div>
        </div>
      </div>
    </div>
  );
};
