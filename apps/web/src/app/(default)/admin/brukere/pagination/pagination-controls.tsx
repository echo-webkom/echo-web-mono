import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export const PaginationControls = ({
  page,
  setPage,
  totalPages,
  pageSize,
  setPageSize,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
}) => {
  return (
    <div className="mt-4 flex items-center justify-between border-t p-2">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex flex-row gap-x-6">
        <Select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="pr-8"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded p-2 disabled:opacity-50"
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="rounded p-2 disabled:opacity-50"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};
