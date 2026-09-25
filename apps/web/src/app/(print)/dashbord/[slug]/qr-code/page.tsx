import Image from "next/image";
import { notFound } from "next/navigation";

import { unoWithAdmin } from "@/api/server";
import { auth } from "@/auth/session";
import { isHost } from "@/lib/memberships";

import { HappeningQrCode } from "./_components/happening-qr-code";

import styles from "./qr-code.module.css";

type QrProps = {
  params: Promise<{ slug: string }>;
};

export default async function QrCodePage({ params }: QrProps) {
  const { slug } = await params;
  const happening = await unoWithAdmin.happenings.full(slug);

  if (!happening) {
    return notFound();
  }

  const user = await auth();
  if (!user || !isHost(user, happening.groups)) {
    return notFound();
  }

  return (
    <main
      className={`${styles.page} min-h-svh bg-[#f6f5f1] px-5 py-10 text-[#172326] sm:px-8 sm:py-12 print:min-h-0 print:bg-white print:p-0 print:text-black`}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
        <div className="mb-8 flex items-center gap-2.5 print:mb-6">
          <Image src="/svg/echo-logo-black.svg" alt="" width={30} height={24} />
          <span className="text-xl font-semibold tracking-tight">echo</span>
          <span className="ml-2 border-l border-[#cbd5ce] pl-4 text-xs tracking-[0.16em] text-[#52665c] uppercase">
            Oppmøte
          </span>
        </div>

        <header className="mb-8 max-w-2xl text-center sm:mb-10 print:mb-6">
          <p className="mb-3 text-xs font-medium tracking-[0.2em] text-[#527166] uppercase">
            Velkommen til
          </p>
          <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl print:text-3xl">
            {happening.title}
          </h1>
        </header>

        <HappeningQrCode value={happening.slug} />
      </div>
    </main>
  );
}
