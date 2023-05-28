"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {TrashIcon} from "@radix-ui/react-icons";
import {AiOutlineLoading} from "react-icons/ai";

import {type Prisma} from "@echo-webkom/db/types";

import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";

type StudentGroupWithMembersAndLeaders = Prisma.StudentGroupGetPayload<{
  include: {
    members: true;
    leaders: true;
  };
}>;

type GroupPreviewProps = {
  studentGroup: StudentGroupWithMembersAndLeaders;
};

export function StudentGroupPreview({studentGroup}: GroupPreviewProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const {toast} = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const resp = await fetch(`/api/group/${studentGroup.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);

    if (resp.status === 200) {
      toast({
        title: "Gruppen ble slettet.",
        variant: "success",
      });
      router.refresh();
      return;
    }

    toast({
      title: "Noe gikk galt.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border p-5">
      <h2 className="text-xl font-bold">{studentGroup.name}</h2>
      <p>
        <span className="mr-2 font-semibold">ID:</span>
        {studentGroup.id}
      </p>
      <div>
        <span className="mr-2 font-semibold">Ledere:</span>
        {studentGroup.leaders.map((leader) => leader.email).join(", ")}
      </div>
      <div>
        <span className="mr-2 font-semibold">Medlemmer:</span>
        {studentGroup.members.map((member) => member.email).join(", ")}
      </div>
      <Button variant="destructive" disabled={isDeleting} onClick={handleDelete} className="w-fit">
        {isDeleting ? (
          <AiOutlineLoading className="h-5 w-5 animate-spin" />
        ) : (
          <TrashIcon className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}
