"use client";

import { Printer } from "lucide-react";
import QRCode from "react-qr-code";

type HappeningQrCodeProps = {
  value: string;
};

export const HappeningQrCode = ({ value }: HappeningQrCodeProps) => (
  <>
    <div className="w-fit max-w-full rounded-3xl border border-[#dce3dd] bg-white p-6 shadow-[0_8px_40px_-16px_rgba(30,55,42,0.18)] sm:p-8 print:rounded-none print:border-0 print:p-4 print:shadow-none">
      <QRCode
        size={500}
        className="block h-auto w-[250px] max-w-full sm:w-[320px] lg:w-[400px] print:w-[95mm]"
        bgColor="white"
        fgColor="black"
        value={value}
        title="QR-kode for arrangementet"
      />
    </div>

    <p className="mt-6 text-sm font-medium tracking-wide text-[#52665c] print:mt-4 print:text-black">
      Skann QR-koden
    </p>

    <button
      type="button"
      onClick={() => window.print()}
      className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ccd7cf] bg-white/70 px-5 py-2.5 text-sm font-medium text-[#3d554a] transition-colors hover:border-[#809b8b] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#527166] print:hidden"
    >
      <Printer className="size-4" aria-hidden="true" />
      Skriv ut / lagre PDF
    </button>
  </>
);
