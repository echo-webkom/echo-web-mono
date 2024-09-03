import * as React from "react";
import { LuX as X } from "react-icons/lu";

import { cn } from "@/utils/cn";

export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void;
};

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, className, value, ...props }, ref) => {
    const handleClear = () => {
      onClear?.();
    };

    return (
      <div className="relative flex h-10 w-full rounded-md bg-input">
        <input
          ref={ref}
          className={cn(
            "flex h-full w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          value={value}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-0 top-0 z-10 flex h-10 w-10 items-center justify-center text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
