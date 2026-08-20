"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Any } from "@sanity/client";

import { type FullHappening, type SpotRange } from "@/api/uno/client";

import { RegistrationTable } from "../_components/registration-table";
import { type RegistrationWithUser } from "../_lib/types";

type QrScannerProps = {
  happening: FullHappening;
  registrations: Array<RegistrationWithUser>;
  spotRanges: Array<SpotRange>;
  groups: Any;
};

type ScannerState = "idle" | "starting" | "scanning" | "error";

export const QrScanner = ({
  happening,
  registrations,
  spotRanges,
  groups,
}: QrScannerProps) => {
  const [scannerState, setScannerState] = useState<ScannerState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedContent, setScannedContent] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef<string | null>(null);

  const readerId = useId().replace(/:/g, "");

  const startScanner = async () => {
    setScannerState("starting");
    setErrorMessage(null);

    try {
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      const cameras = await Html5Qrcode.getCameras();

      const backCamera = cameras.find((camera) =>
        /back|rear|environment/i.test(camera.label),
      );

      const cameraConstraint = backCamera
        ? backCamera.id
        : { facingMode: "environment" };

      await scanner.start(
        cameraConstraint,
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (result) => {
          if (lastScanRef.current === result) return;

          lastScanRef.current = result;

          console.log("Scanned QR code:", result);
          setScannedContent(result);

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
          ? "Camera permission denied. Please allow camera access and try again."
          : "Could not start camera. Make sure no other app is using it.",
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
                  {scannerState === "starting"
                    ? "Starting camera…"
                    : "Ready to scan"}
                </p>

                <button
                  onClick={startScanner}
                  disabled={scannerState === "starting"}
                  className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                >
                  {scannerState === "starting"
                    ? "Starting…"
                    : "Start scanner"}
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
            <p className="mb-1 text-sm font-medium">Scanned content</p>
            <p className="break-all text-sm text-gray-600">
              {scannedContent}
            </p>
          </div>
        )}
      </div>

      <RegistrationTable
        questions={happening.questions}
        registrations={registrations}
        studentGroups={groups}
        slug={happening.slug}
        isBedpres={happening.type === "bedpres"}
        happeningDate={happening.date}
        spotRanges={spotRanges}
      />
    </>
  );
};