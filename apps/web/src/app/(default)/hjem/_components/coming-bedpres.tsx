import { fetchHomeHappenings, type HappeningType } from "@/sanity/happening";
import { BentoBox } from "./bento-box";
import { HappeningPreview } from "./happening-preview";

type ComingHappeningsProps = {
  title: string;
  href: string;
  types: Array<HappeningType>;
  n: number;
  className?: string;
};

export async function ComingHappenings({
  title,
  href,
  types,
  n,
  className,
}: ComingHappeningsProps) {
  const happenings = await fetchHomeHappenings(types, n);

  return (
    <BentoBox title={title} href={href} className={className}>
      <ul className="grid grid-cols-1 gap-x-3 gap-y-5 py-4">
        {happenings.map((happening) => (
          <li key={happening._id}>
            <HappeningPreview happening={happening} />
          </li>
        ))}
      </ul>
    </BentoBox>
  );
}
