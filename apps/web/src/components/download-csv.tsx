import React from "react";

type DownloadCsvProps = {
  csv: string;
  title?: string;
};

const DownloadCsv = ({ csv, title }: DownloadCsvProps) => {
  return (
    <a
      href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
      download={`${title?.replace(" ", "-") ?? "registration"}.csv`}
    >
      Last ned CSV
    </a>
  );
};

export default DownloadCsv;
