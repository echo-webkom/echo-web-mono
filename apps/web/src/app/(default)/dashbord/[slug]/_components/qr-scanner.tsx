"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { TableBody, TableHeader } from "react-aria-components";

import { filterRegistrations } from "../_lib/filter-registrations";
import { RegistrationWithUser } from "../_lib/types";
import { useRegistrationFilter } from "../_lib/use-registration-filter";
import { Table, TableHead, TableRow } from "../../../../../components/ui/table";
import { getFullHappening } from "../../../../../data/happenings/queries";
import { RegistrationRow } from "./registration-row";
import { RegistrationTable } from "./registration-table";

type QrScannerProps = {
  registrations: Array<RegistrationWithUser>;
  happening: Exclude<Awaited<ReturnType<typeof getFullHappening>>, undefined>;
  studentGroups: { id: string; name: string }[];
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

      <Table>
        <TableHeader>
          <TableRow>
            {showIndex && (
              <TableHead scope="col" className="w-12">
                #
              </TableHead>
            )}
            <TableHead scope="col" className="w-12">
              Info
            </TableHead>
            <TableHead scope="col">Navn</TableHead>
            <TableHead scope="col">Status</TableHead>
            <TableHead scope="col" className="w-16">
              Mer
            </TableHead>
            <TableHead scope="col" className="w-12">
              {/* Empty */}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRegistrations.length === 0 && (
            <TableRow>
              <td colSpan={showIndex ? 6 : 5}>
                <p className="text-muted-foreground py-6 text-center text-xl font-medium">
                  Ingen resultater
                </p>
              </td>
            </TableRow>
          )}
          {filteredRegistrations.map((registration, i) => (
            <RegistrationRow
              key={registration.user.id}
              index={i}
              registration={registration}
              showIndex={showIndex}
              isBedpres={happening.type === "bedpres"}
              happeningDate={happening.date}
            />
          ))}
        </TableBody>
      </Table>

      <RegistrationTable
        questions={happening.questions}
        registrations={registrations}
        studentGroups={studentGroups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
      />
    </>
  );
};
