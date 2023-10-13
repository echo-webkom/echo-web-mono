import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import removeMd from "remove-markdown";

import { type StudentGroup } from "@/sanity/student-group";
import { cn } from "@/utils/cn";

type StudentGroupPreviewProps = {
  group: StudentGroup;
  withBorder?: boolean;
};

export function StudentGroupPreview({ group, withBorder = false }: StudentGroupPreviewProps) {
  return (
    <Link href={`/for-studenter/gruppe/${group.slug}`}>
      <div
        className={cn(
          "flex h-full flex-col gap-3 rounded-lg p-5 hover:bg-muted",
          withBorder && "border",
        )}
      >
        <h2 className="text-2xl font-bold">{group.name}</h2>
        <p className="line-clamp-3 flex-1 text-slate-700">{removeMd(group.description ?? "")}</p>
        <p className="flex items-center gap-1 group-hover:underline">
          Les mer
          <span className="transition-all duration-150 group-hover:pl-1">
            <ArrowRightIcon />
          </span>
        </p>
      </div>
    </Link>
  );
}
