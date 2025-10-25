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
    <Link href={`/for-studenter/merch/${item.slug}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={urlFor(item.image).width(800).height(450).fit("crop").url()}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-muted-foreground text-sm font-medium">{item.price} kr</p>
          </div>

          {item.body && (
            <p className="text-muted-foreground line-clamp-2 flex-1 text-sm">
              {removeMd(item.body ?? "")}
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
