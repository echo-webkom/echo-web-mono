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
      <div className="bg-input relative flex h-10 w-full rounded-md">
        <input
          ref={ref}
          className={cn(
            "border-border placeholder:text-muted-foreground focus-visible:ring-ring flex h-full w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          value={value}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-0 right-0 z-10 flex h-10 w-10 items-center justify-center text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
