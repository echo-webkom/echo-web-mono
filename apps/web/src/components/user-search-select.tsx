"use client";

import { ChevronDown } from "lucide-react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";

import { useUnoClient } from "@/providers/uno";
import { cn } from "@/utils/cn";

export type UserSearchResult = {
  id: string;
  name: string;
};

// Hardcoded to 3 since that is what we use in the Uno API.
const MIN_SEARCH_LENGTH = 3;

type UserSearchSelectProps = {
  value: string;
  onInputChangeAction: (query: string) => void;
  onSelectAction: (user: UserSearchResult) => void;
  placeholder?: string;
  debounceMs?: number;
  minCharsText?: string;
  loadingText?: string;
  emptyText?: string;
  renderOptionAction?: (user: UserSearchResult, isHighlighted: boolean) => ReactNode;
};

export const UserSearchSelect = ({
  value,
  onInputChangeAction,
  onSelectAction,
  placeholder = "Søk etter bruker...",
  debounceMs = 250,
  minCharsText,
  loadingText = "Søker...",
  emptyText = "Ingen brukere funnet",
  renderOptionAction,
}: UserSearchSelectProps) => {
  const unoClient = useUnoClient();
  const ref = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [users, setUsers] = useState<Array<UserSearchResult>>([]);
  const [isSearching, startSearchTransition] = useTransition();

  const query = value.trim();

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < MIN_SEARCH_LENGTH) {
      setUsers([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      startSearchTransition(async () => {
        try {
          const searchedUsers = await unoClient.users.search(query);
          setUsers(searchedUsers);
        } catch (error) {
          console.error("Error searching users:", error);
          setUsers([]);
        }
      });
    }, debounceMs);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [debounceMs, query, unoClient]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [users.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      setIsOpen(true);
      return;
    }

    if (!isOpen || users.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((previous) => (previous + 1 >= users.length ? 0 : previous + 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((previous) => (previous - 1 < 0 ? users.length - 1 : previous - 1));
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const selectedUser = users[highlightedIndex];
      if (selectedUser) {
        onSelectAction(selectedUser);
        setIsOpen(false);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <div className="group border-border bg-input ring-offset-background focus-within:ring-ring relative flex h-10 w-full rounded-md border text-sm font-semibold focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-hidden disabled:cursor-not-allowed disabled:opacity-50">
        <input
          aria-label="user"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => {
            onInputChangeAction(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={onKeyDown}
          className="placeholder:text-muted-foreground h-full w-full border-0 bg-transparent px-3 py-2 ring-0 outline-0 placeholder:text-sm focus:ring-0 focus:outline-hidden"
        />
        <button
          aria-label="Vis brukere"
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          className="text-muted-foreground absolute inset-y-0 right-0 flex items-center px-2"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <ul className="border-border bg-input text-foreground absolute z-50 mt-1 flex max-h-96 w-full flex-col overflow-y-auto rounded-md border px-3 py-2">
          {query.length < MIN_SEARCH_LENGTH ? (
            <li className="text-muted-foreground px-2 py-2 text-sm">
              {minCharsText ?? `Skriv minst ${MIN_SEARCH_LENGTH} bokstaver for å søke`}
            </li>
          ) : isSearching ? (
            <li className="text-muted-foreground px-2 py-2 text-sm">{loadingText}</li>
          ) : users.length === 0 ? (
            <li className="text-muted-foreground px-2 py-2 text-sm">{emptyText}</li>
          ) : (
            users.map((user, index) => (
              <li key={user.id}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => {
                    onSelectAction(user);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "focus:border-border flex w-full cursor-default items-center gap-2 rounded border py-2 pr-4 pl-2 text-left outline-hidden select-none",
                    {
                      "border-border bg-muted": highlightedIndex === index,
                      "border-transparent": highlightedIndex !== index,
                    },
                  )}
                >
                  {renderOptionAction ? (
                    renderOptionAction(user, highlightedIndex === index)
                  ) : (
                    <span className="text-foreground text-sm font-semibold">{user.name}</span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
