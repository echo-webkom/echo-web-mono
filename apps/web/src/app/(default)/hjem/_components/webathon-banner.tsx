import Link from "next/link";

export const WebathonBanner = () => {
  return (
    <Link href="/arrangement/webathon-2026">
      <div className="group relative overflow-hidden bg-[#0f1923] py-6 transition-opacity hover:opacity-95">
        <div className="bg-primary absolute inset-x-0 top-0 h-0.5" />
        <div className="bg-secondary absolute inset-x-0 bottom-0 h-0.5" />

        <div className="relative flex flex-col items-center gap-1">
          <p className="flex items-center gap-0 text-2xl font-bold text-white transition transition-all group-hover:gap-2 sm:text-3xl">
            <span className="text-secondary font-mono opacity-70">{"<"}</span>
            Bli med på Webathon
            <span className="text-secondary font-mono opacity-70">{" />"}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};
