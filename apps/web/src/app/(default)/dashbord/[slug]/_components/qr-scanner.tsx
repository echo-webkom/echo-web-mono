"use client";

import { Html5Qrcode } from "html5-qrcode";
import { useEffect, useId, useRef, useState } from "react";

import { type FullHappening, type SpotRange } from "@/api/uno/client";

import { useUnoClient } from "../../../../../providers/uno";
import { RegistrationTable } from "../_components/registration-table";
import { type DashboardGroup, type RegistrationWithUser } from "../_lib/types";

type QrScannerProps = {
  happening: FullHappening;
  registrations: Array<RegistrationWithUser>;
  spotRanges: Array<SpotRange>;
  groups: Array<DashboardGroup>;
};

type ScannerState = "idle" | "starting" | "scanning" | "error";

export const QrScanner = ({ happening, registrations, spotRanges, groups }: QrScannerProps) => {
  const unoClient = useUnoClient();
  const [scannerState, setScannerState] = useState<ScannerState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedContent, setScannedContent] = useState<string | null>(null);
  const [tableRegistrations, setTableRegistrations] = useState(registrations);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef<string | null>(null);

  const readerId = useId().replace(/:/g, "");

  useEffect(() => {
    setTableRegistrations(registrations);
  }, [registrations]);

  const startScanner = async () => {
    setScannerState("starting");
    setErrorMessage(null);

    try {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();

      const backCamera = cameras.find((camera) => /back|rear|environment/i.test(camera.label));

      const cameraConstraint = backCamera ? backCamera.id : { facingMode: "environment" };

      await scanner.start(
        cameraConstraint,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        async (result) => {
          if (lastScanRef.current === result) return;
          lastScanRef.current = result;

          const scannedRegistration = tableRegistrations.find(
            (registration) => registration.userId === result,
          );

          if (!scannedRegistration || scannedRegistration.status !== "registered") {
            setScannedContent("Brukeren " + scannedRegistration?.user.name + " er ikke påmeldt");
            return;
          }

          const didUpdateAttendance = await unoClient.happenings.setAttendance(
            happening.id,
            result,
            true,
          );

          if (didUpdateAttendance) {
            setTableRegistrations((currentRegistrations) =>
              currentRegistrations.map((registration) =>
                registration.userId === result ? { ...registration, attended: true } : registration,
              ),
            );
          }

          setScannedContent(scannedRegistration.user.name + " er registrert møtt opp");

          window.setTimeout(() => {
            lastScanRef.current = null;
          }, 1500);
        },
        (err) => {
          if (String(err).includes("NotFoundException")) return;
          console.warn(err);
        },
      );

      setScannerState("scanning");
    } catch (err) {
      console.error(err);

      setScannerState("error");

      setErrorMessage(
        err instanceof Error && err.message.includes("Permission")
          ? "Kameratilgang ble nektet. Tillat tilgang til kameraet og prøv igjen."
          : "Kunne ikke starte kameraet. Kontroller at ingen andre apper bruker det.",
      );

      scannerRef.current = null;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }

    setScannerState("idle");
  };

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-md py-5">
        <div
          id={readerId}
          className={`w-full overflow-hidden rounded-xl transition-all ${
            scannerState === "scanning" ? "h-auto" : "invisible h-0"
          }`}
        />

        {scannerState !== "scanning" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 p-8 text-center">
            {scannerState === "error" ? (
              <>
                <p className="text-sm text-red-600">{errorMessage}</p>

                <button
                  onClick={startScanner}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Try again
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">
                  {scannerState === "starting" ? "Starting camera…" : "Ready to scan"}
                </p>

                <button
                  onClick={startScanner}
                  disabled={scannerState === "starting"}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {scannerState === "starting" ? "Starting…" : "Start scanner"}
                </button>
              </>
            )}
          </div>
        )}

        {scannerState === "scanning" && (
          <button
            onClick={stopScanner}
            className="mt-3 w-full rounded-lg border border-gray-300 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Stop scanner
          </button>
        )}

        {scannedContent && (
          <div className="mt-4 rounded-lg border border-gray-300 p-4">
            <p className="mb-1 text-sm font-medium">skannet QR-innhold</p>
            <p className="text-sm break-all text-gray-600">{scannedContent}</p>
          </div>
        )}
      </div>

      <RegistrationTable
        questions={happening.questions}
        registrations={tableRegistrations}
        studentGroups={groups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
        spotRanges={spotRanges}
        showAttendance={true}
      />
    </>
  );
};
