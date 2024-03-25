import React from "react";
import { RxChevronDown } from "react-icons/rx";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type DownloadCsvButtonProps = {
  id: string;
  columns: Array<string>;
  removeKey: (id: string) => void;
  addKey: (id: string) => void;
  selectedHeaders: Array<string>;
};

export function DownloadCsvButton({
  id,
  columns,
  removeKey,
  addKey,
  selectedHeaders,
}: DownloadCsvButtonProps) {
  const filteredColumns = columns.filter((header) => header && header.trim() !== "");

  return (
    <div>
      <div className="overflow-y-auto">
        <div className="flex flex-col md:flex-row">
          <div className="w-full py-2">
            <Button asChild>
              <a
                href={`/api/registrations?happeningId=${id}&selectedHeaders=${encodeURIComponent(selectedHeaders.join(","))}`}
                download
              >
                Last ned csv
              </a>
            </Button>
          </div>
          <div className="w-full">
            <DropdownMenu modal>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto flex gap-2">
                  Csv Kolonner
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
                      onCheckedChange={() => {
                        if (isChecked) {
                          removeKey(header);
                        } else {
                          addKey(header);
                        }
                      }}
                    >
                      {header}
                    </DropdownMenuCheckboxItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
