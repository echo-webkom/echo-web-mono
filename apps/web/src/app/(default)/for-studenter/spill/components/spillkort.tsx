import { type LucideIcon } from "lucide-react";
import Link from "next/link";

interface CardProps {
  name: string;
  description: string;
  path: string;
  icon: LucideIcon;
}

export default function SpillKort({ name, description, path, icon: Icon }: CardProps) {
  return (
    <Link
      href={path}
      className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/50 hover:shadow-md sm:gap-4 sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex min-w-0 flex-col">
        <h2 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-gray-100">{name}</h2>
        <p className="mt-1 line-clamp-2 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="shrink-0 rounded-xl bg-gray-100 p-2.5 text-gray-700 group-hover:bg-blue-50 sm:p-3 dark:bg-zinc-800 dark:text-gray-200">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8" />
      </div>
    </Link>
  );
}
