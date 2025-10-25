import Image from "next/image";
import Link from "next/link";
import { RxArrowRight as ArrowRight } from "react-icons/rx";
import removeMd from "remove-markdown";

import { type StudentGroupsByTypeQueryResult } from "@echo-webkom/cms/types";
import { urlFor } from "@echo-webkom/sanity";

import { Chip } from "./typography/chip";

type StudentGroupPreviewProps = {
  group: StudentGroupsByTypeQueryResult[number];
};

export const StudentGroupPreview = ({ group }: StudentGroupPreviewProps) => {
  return (
    <Link href={`/for-studenter/gruppe/${group.slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
        {group.image && (
          <div className="relative h-32 w-full overflow-hidden">
            <Image
              src={urlFor(group.image).width(800).height(256).fit("crop").url()}
              alt={group.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xl font-semibold">{group.name}</h2>
            {!group.isActive && (
              <Chip variant="destructive" className="shrink-0">
                Ikke aktiv
              </Chip>
            )}
          </div>

          {group.description && (
            <p className="text-muted-foreground line-clamp-3 flex-1 text-sm">
              {removeMd(group.description ?? "")}
            </p>
          )}

          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            Les mer
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};
