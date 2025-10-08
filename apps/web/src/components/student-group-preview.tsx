import Link from "next/link";
import { RxArrowRight as ArrowRight } from "react-icons/rx";
import removeMd from "remove-markdown";

import { type StudentGroupsByTypeQueryResult } from "@echo-webkom/cms/types";

import { Chip } from "./typography/chip";

type StudentGroupPreviewProps = {
  group: StudentGroupsByTypeQueryResult[number];
};

export const StudentGroupPreview = ({ group }: StudentGroupPreviewProps) => {
  return (
    <Link href={`/for-studenter/gruppe/${group.slug}`}>
      <div className="group hover:bg-muted flex h-full flex-col gap-3 rounded-lg border-2 p-6 shadow-lg">
        <h2 className="text-2xl font-bold">{group.name}</h2>

        {group.description && (
          <p className="dark:text-foreground line-clamp-3 flex-1 text-slate-700">
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
            <Chip variant={"destructive"} className="absolute right-0 mt-9">
              Ikke aktiv
            </Chip>
          )}
        </div>
      </div>
      <div></div>
    </Link>
  );
};
