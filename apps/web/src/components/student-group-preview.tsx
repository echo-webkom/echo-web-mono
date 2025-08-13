import Link from "next/link";
import { InfoIcon } from "lucide-react";
import { RxArrowRight as ArrowRight } from "react-icons/rx";
import removeMd from "remove-markdown";

import { type StudentGroupsByTypeQueryResult } from "@echo-webkom/cms/types";

type StudentGroupPreviewProps = {
  group: StudentGroupsByTypeQueryResult[number];
};

export const StudentGroupPreview = ({ group }: StudentGroupPreviewProps) => {
  return (
    <Link href={`/for-studenter/gruppe/${group.slug}`}>
      <div className="group flex h-full flex-col gap-3 rounded-lg border-2 p-6 shadow-lg hover:bg-muted">
        <h2 className="text-2xl font-bold">{group.name}</h2>

        {group.description && (
          <p className="line-clamp-3 flex-1 text-slate-700 dark:text-foreground">
            {removeMd(group.description ?? "")}
          </p>
        )}
        <div className="relative flex justify-between">
          <p className="flex items-center gap-1 font-medium">
            Les mer
            <span className="transition-all duration-150 group-hover:pl-1">
              <ArrowRight />
            </span>
          </p>
          {!group.isActive && (
            <div className="absolute right-0 mt-8 rounded-full border-2 border-warning-dark bg-warning p-1 px-1.5">
              <h1 className="flex items-center gap-2 text-sm text-warning-foreground">
                Ikke aktiv
              </h1>
            </div>
          )}
        </div>
      </div>
      <div></div>
    </Link>
  );
};
