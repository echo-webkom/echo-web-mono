"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

import { type FullHappening, type Group } from "@/api/uno/client";
import { RegistrationWithUser } from "../_lib/types";
import { attend } from "../../../../../actions/attend";
import { RegistrationList } from "./registration-list";

type QrScannerProps = {
  registrations: Array<RegistrationWithUser>;
  happening: FullHappening;
  studentGroups: Array<Group>;
};

export const QrScanner = ({ registrations, happening, studentGroups }: QrScannerProps) => {
  const [localRegistrations, setLocalRegistrations] = useState(registrations);

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastScanRef = useRef<string | null>(null);
  const readerId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    let scanner: Html5QrcodeScanner | null = null;

    const timeout = window.setTimeout(() => {
      if (cancelled) return;

      const container = document.getElementById(readerId);
      if (!container) return;

      container.innerHTML = "";

      scanner = new Html5QrcodeScanner(
        readerId,
        {
          qrbox: { width: 300, height: 300 },
          fps: 10,
        },
        false,
      );

      scannerRef.current = scanner;

      const success = async (result: string) => {
        if (lastScanRef.current === result) return;
        lastScanRef.current = result;

        const response = await attend(happening.id, result);

        if (response.success) {
          setLocalRegistrations((prev) =>
            prev.map((registration) =>
              registration.userId === result
                ? {
                    ...registration,
                    status: "attended",
                  }
                : registration,
            ),
          );
        }

        window.setTimeout(() => {
          lastScanRef.current = null;
        }, 1500);
      };

      const error = (err: unknown) => {
        const msg = String(err ?? "");
        if (msg.includes("NotFoundException")) return;
        console.warn(err);
      };

      scanner.render(success, error);
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);

      scanner?.clear().catch(() => {});
      scannerRef.current = null;

      const container = document.getElementById(readerId);
      if (container) container.innerHTML = "";
    };
  }, [happening.id, readerId]);

  return (
    <>
      <div className="mx-auto w-full max-w-md py-5">
        <div id={readerId} className="w-full overflow-hidden rounded-xl" />
      </div>

      <RegistrationList
        registrations={localRegistrations}
        studentGroups={studentGroups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
      />
    </>
  );
};
