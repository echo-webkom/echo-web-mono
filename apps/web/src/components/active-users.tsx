"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useActiveUsers } from "@/lib/providers/active-users";

export const ActiveUsers = () => {
  const activeUsers = useActiveUsers();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{activeUsers}</span>
            <div className="h-3 w-3 animate-pulse rounded-full bg-green-400 shadow-green-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm font-medium">Brukere på siden nå</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
