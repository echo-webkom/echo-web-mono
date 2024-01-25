import React from "react";

import { Button } from "./ui/button";

type DownloadCsvProps = {
  csv: string;
  title?: string;
};

const DownloadCsv = ({ csv, title }: DownloadCsvProps) => {
  return (
    <Button asChild>
      <a
        href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
        download={`${title?.replace(" ", "-") ?? "registration"}.csv`}
      >
        Last ned CSV
      </a>
    </Button>
  );
};

export default DownloadCsv;
