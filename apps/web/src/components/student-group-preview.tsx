import Link from "next/link";
import {ArrowRightIcon} from "@radix-ui/react-icons";
import removeMd from "remove-markdown";

import {type StudentGroup} from "@/sanity/student-group";

export default function StudentGroupPreview({group}: {group: StudentGroup}) {
  return (
    <Link href={`/for-students/group/${group.slug}`}>
      <div className="flex flex-col gap-3 rounded-lg p-5 hover:bg-muted">
        <h2 className="text-2xl font-bold">{group.name}</h2>
        <p className="line-clamp-3 text-slate-700">{removeMd(group.description ?? "")}</p>
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
