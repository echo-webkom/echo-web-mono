import React from "react";

import { Button } from "./ui/button";

type DownloadCsvButtonProps = {
  id: string;
};

export function DownloadCsvButton({ id }: DownloadCsvButtonProps) {
  return (
    <Button asChild>
      <a href={`/api/registrations?happeningId=${id}`} download>
        Last ned csv
      </a>
    </Button>
  );
}
