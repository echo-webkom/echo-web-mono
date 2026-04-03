"use client";

import { type BanInfo, type Dot } from "@echo-webkom/db/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

import { removeBanAction, removeStrikeAction } from "../_actions/remove-strike-ban";
import { ConfirmationModal } from "./confirmation-modal";

type StrikeRowProps = {
  userId: string;
  name: string;
  strikes: Array<Dot & { strikedByUser: { name: string | null } | null }>;
  banInfo: (BanInfo & { bannedByUser: { name: string | null } | null }) | null;
  strikeCount?: number;
};

export const StrikeRow = ({ userId, name, strikes, banInfo, strikeCount }: StrikeRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggle = () => setIsOpen((prev) => !prev);

  const dotsFromDetails = strikes.reduce((acc, { count }) => acc + count, 0);
  const dots = strikeCount ?? dotsFromDetails;

  return (
    <li className="py-3">
      <div className="bg-card flex items-center justify-between gap-4 rounded-lg border px-4 py-3">
        <p className="line-clamp-1 w-full text-lg font-medium text-nowrap text-ellipsis">{name}</p>

        <div className="flex w-fit shrink-0 items-center gap-4">
          {banInfo !== null ? (
            <p className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-sm font-semibold">
              Bannet
            </p>
          ) : (
            <p className="text-muted-foreground text-sm font-medium">
              {dots} prikk{dots !== 1 && "er"}
            </p>
          )}

          <button
            className="hover:bg-muted shrink-0 rounded-md p-1 transition-colors"
            onClick={toggle}
          >
            <BiChevronDown
              className={cn("text-muted-foreground h-6 w-6 transition-all", {
                "rotate-180": isOpen,
              })}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-card mt-3 rounded-lg border p-4">
          <div className="space-y-4">
            {banInfo !== null && (
              <div className="bg-destructive/5 border-destructive/20 flex flex-col rounded-lg border p-4">
                <p>
                  <span className="text-lg font-medium">Bannet </span>
                  <span className="text-muted-foreground">
                    av {banInfo.bannedByUser?.name ?? "[Slettet bruker]"}
                  </span>
                </p>

                <p className="text-muted-foreground mb-3 text-xs">
                  {new Date(banInfo.createdAt).toLocaleDateString()} -{" "}
                  {new Date(banInfo.expiresAt).toLocaleDateString()}
                </p>

                <p className="text-sm">{banInfo.reason}</p>
              </div>
            )}

            {banInfo !== null && (
              <ConfirmationModal
                title="Fjern ban"
                description="Er du sikker på at du vil fjerne denne bannet?"
                confirmVariant="destructive"
                onConfirmAction={async () => {
                  await removeBanAction(userId);
                  router.refresh();
                }}
              >
                <Button variant="destructive" size="sm" className="w-fit">
                  Fjern ban
                </Button>
              </ConfirmationModal>
            )}

            {strikes.length > 0 && (
              <div className="pt-2">
                <p className="mb-3 text-lg font-medium">Prikker</p>

                <ul className="flex flex-col gap-3">
                  {strikes.map(
                    ({ id, count, strikedByUser, strikedBy, createdAt, expiresAt, reason }) => (
                      <li key={id} className="bg-muted/30 flex flex-col rounded-lg border p-4">
                        <p>
                          <span className="text-lg font-medium">
                            {count} prikk{count !== 1 && "er"}{" "}
                          </span>
                          <span className="text-muted-foreground">
                            av {strikedByUser?.name ?? strikedBy}
                          </span>
                        </p>

                        <p className="text-muted-foreground mb-3 text-xs">
                          {new Date(createdAt).toLocaleDateString()} -{" "}
                          {new Date(expiresAt).toLocaleDateString()}
                        </p>

                        <p className="text-sm">{reason}</p>

                        <ConfirmationModal
                          title="Fjern prikk"
                          description="Er du sikker på at du vil fjerne denne prikken?"
                          confirmVariant="destructive"
                          onConfirmAction={async () => {
                            await removeStrikeAction(userId, id);
                            router.refresh();
                          }}
                        >
                          <Button variant="destructive" size="sm" className="mt-4 w-fit">
                            Fjern prikk
                          </Button>
                        </ConfirmationModal>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {strikes.length === 0 && dots > 0 && (
              <p className="text-muted-foreground py-2 text-sm">
                Detaljer for aktive prikker er ikke tilgjengelig i denne oversikten.
              </p>
            )}
          </div>
        </div>
      )}
    </li>
  );
};
