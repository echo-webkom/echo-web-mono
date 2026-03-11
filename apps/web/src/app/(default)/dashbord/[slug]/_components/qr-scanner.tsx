"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { type FullHappening, type Group } from "@/api/uno/client";
import { filterRegistrations } from "../_lib/filter-registrations";
import { RegistrationWithUser } from "../_lib/types";
import { useRegistrationFilter } from "../_lib/use-registration-filter";
import { RegistrationList } from "./registration-list";

type QrScannerProps = {
  registrations: Array<RegistrationWithUser>;
  happening: FullHappening;
  studentGroups: Array<Group>;
};

export const QrScanner = ({ registrations, happening, studentGroups }: QrScannerProps) => {
  const [list, setList] = useState<string[]>(["hello", "hi", "lol"]);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const [showIndex, setShowIndex] = useState(false);
  const { filters, resetFilters, setSearchTerm, setYearFilter, setStatusFilter, setGroupFilter } =
    useRegistrationFilter();
  const filteredRegistrations = filterRegistrations(registrations, studentGroups, filters);

  useEffect(() => {
    if (scannerRef.current) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      { qrbox: { width: 1000, height: 1000 }, fps: 10 },
      false,
    );

    scannerRef.current = scanner;

    const success = (result: string) => {
      console.log("removing " + result);
      setList((prev) => prev.filter((item) => item !== result));
    };

    const error = (err: any) => {
      const msg = String(err ?? "");
      if (msg.includes("NotFoundException")) return;
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scannerRef.current?.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  return (
    <>
      <div id="reader" />
      <ul>
        {list.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      <RegistrationList
        registrations={registrations}
        studentGroups={studentGroups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
      />

      {/* <RegistrationTable
        questions={happening.questions}
        registrations={registrations}
        studentGroups={studentGroups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
      /> */}
    </>
  );
};
