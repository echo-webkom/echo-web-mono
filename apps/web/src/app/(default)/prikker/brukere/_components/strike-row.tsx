"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiChevronDown } from "react-icons/bi";

import { type BanInfo, type Dot } from "@echo-webkom/db/schemas";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { removeBanAction, removeStrikeAction } from "../_actions/remove-strike-ban";
import { ConfirmationModal } from "./confirmation-modal";

type StrikeRowProps = {
  userId: string;
  name: string;
  strikes: Array<Dot & { strikedByUser: { name: string | null } | null }>;
  banInfo: (BanInfo & { bannedByUser: { name: string | null } | null }) | null;
};

export const StrikeRow = ({ userId, name, strikes, banInfo }: StrikeRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggle = () => setIsOpen((prev) => !prev);

  const dots = strikes.reduce((acc, { count }) => acc + count, 0);

  return (
    <li className="py-4">
      <div className="flex items-center justify-between py-2">
        <p className="line-clamp-1 w-full text-ellipsis text-nowrap text-lg font-medium">{name}</p>

        <div className="flex w-fit flex-shrink-0 items-center gap-4">
          {banInfo !== null ? (
            <p className="text-lg font-medium text-red-500">Bannet</p>
          ) : (
            <p className="text-lg font-medium">
              {dots} prikk{dots !== 1 && "er"}
            </p>
          )}

          <button className="flex-shrink-0" onClick={toggle}>
            <BiChevronDown
              className={cn("h-7 w-7 transition-all", {
                "rotate-180": isOpen,
              })}
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="rounded-lg border p-2">
          <hr />

          <div className="py-8">
            {banInfo !== null && (
              <div className="flex flex-col rounded-lg border p-4">
                <p>
                  <span className="text-lg font-medium">Bannet </span>
                  <span className="text-gray-500">
                    av {banInfo.bannedByUser?.name ?? "[Slettet bruker]"}
                  </span>
                </p>

                <p className="mb-3 text-xs text-gray-500">
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
                <Button variant="destructive" className="mt-4 w-fit">
                  Fjern ban
                </Button>
              </ConfirmationModal>
            )}

            {strikes.length > 0 && (
              <div className="py-4">
                <p className="mb-4 text-lg font-medium">Prikker</p>

                <ul className="flex flex-col gap-2">
                  {strikes.map(
                    ({ id, count, strikedByUser, strikedBy, createdAt, expiresAt, reason }) => (
                      <li key={id} className="flex flex-col rounded-lg border p-4">
                        <p>
                          <span className="text-lg font-medium">
                            {count} prikk{count !== 1 && "er"}{" "}
                          </span>
                          <span className="text-gray-500">
                            av {strikedByUser?.name ?? strikedBy}
                          </span>
                        </p>

                        <p className="mb-3 text-xs text-gray-500">
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
                          <Button variant="destructive" className="mt-4 w-fit">
                            Fjern prikk
                          </Button>
                        </ConfirmationModal>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
};
