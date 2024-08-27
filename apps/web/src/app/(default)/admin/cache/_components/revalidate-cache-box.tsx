"use client";

import { useState } from "react";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { revalidateCacheAction } from "../_actions/revalidate-cache";

const commonTags = [
  "home-happenings",
  "happenings",
  "happening-params",
  "happening-$slug",
  "static-info",
  "job-ads",
  "minutes",
  "student-groups",
  "time",
];

export const RevalidateCacheInput = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");

  const onSubmit = async () => {
    const { success, message } = await revalidateCacheAction(text);

    toast({
      title: message,
      variant: success ? "success" : "destructive",
    });

    if (success) {
      setText("");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex max-w-[400px] items-center gap-2">
        <Input value={text} onChange={(e) => setText(e.currentTarget.value)} placeholder="Tag..." />
        <Button onClick={onSubmit} className="w-full max-w-[170px]">
          Revalidate cache
        </Button>
      </div>

      <Text>Vanlige tags:</Text>

      <div className="flex max-w-[600px] flex-wrap items-center gap-2">
        {commonTags.map((tag) => (
          <Button variant="outline" key={tag} onClick={() => setText(tag)} className="px-2">
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};
