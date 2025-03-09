import Image from "next/image";
import Link from "next/link";
import { RxArrowRight as ArrowRight } from "react-icons/rx";
import removeMd from "remove-markdown";

import { type AllMerchQueryResult } from "@echo-webkom/cms/types";
import { urlFor } from "@echo-webkom/sanity";

type MerchPreviewProps = {
  item: AllMerchQueryResult[number];
};
export const MerchPreview = ({ item }: MerchPreviewProps) => {
  return (
    <Link href={`/for-studenter/merch/${item.slug}`}>
      <div className="group flex h-full justify-between gap-3 rounded-lg border-2 p-6 shadow-lg hover:bg-muted">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold">{item.title}</h2>

          {item.body && (
            <p className="line-clamp-3 flex-1 text-slate-700 dark:text-foreground">
              {removeMd(item.body ?? "")}
            </p>
          )}

          <p className="flex items-center gap-1 font-medium">
            Les mer
            <span className="transition-all duration-150 group-hover:pl-1">
              <ArrowRight />
            </span>
          </p>
        </div>
        <div>
          <Image
            src={urlFor(item.image).url()}
            alt={item.title}
            width={200}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>
    </Link>
  );
};
