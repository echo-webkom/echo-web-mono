"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { IntgroupRequest } from "@/api/uno/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUnoClient } from "@/providers/uno";

type IntgroupRequestListProps = {
  requests: Array<IntgroupRequest>;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

export function IntgroupRequestList({ requests: initialRequests }: IntgroupRequestListProps) {
  const unoClient = useUnoClient();
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<IntgroupRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<IntgroupRequest | null>(null);
  const [isPending, startTransition] = useTransition();

  const deleteRequest = () => {
    if (!requestToDelete) return;

    startTransition(async () => {
      try {
        const deleted = await unoClient.groups.deleteIntgroupRequest(requestToDelete.id);
        if (!deleted) {
          toast.error("Kunne ikke slette forespørselen.");
          return;
        }

        setRequests((current) => current.filter((request) => request.id !== requestToDelete.id));
        setRequestToDelete(null);
        setSelectedRequest(null);
        toast.success("Forespørselen er slettet.");
        router.refresh();
      } catch {
        toast.error("Kunne ikke slette forespørselen.");
      }
    });
  };

  if (requests.length === 0) {
    return <p>Ingen interessegruppeforespørsler.</p>;
  }

  return (
    <>
      <ul className="divide-y rounded-md border">
        {requests.map((request) => (
          <li key={request.id} className="hover:bg-accent flex items-center gap-2 rounded-md p-4">
            <button
              type="button"
              className="min-w-0 flex-1 text-left"
              onClick={() => setSelectedRequest(request)}
            >
              <span className="block truncate font-semibold">{request.groupName}</span>
              <span className="text-muted-foreground block truncate text-sm">
                {request.contactEmail} · {formatDate(request.createdAt)}
              </span>
            </button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Slett forespørsel om ${request.groupName}`}
              onClick={() => setRequestToDelete(request)}
            >
              <Trash2 className="text-destructive" />
            </Button>
          </li>
        ))}
      </ul>

      <Dialog
        open={selectedRequest !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRequest?.groupName}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <DialogBody className="space-y-4">
              <RequestDetail label="Beskrivelse" value={selectedRequest.description} />
              <RequestDetail
                label="Interesserte personer"
                value={selectedRequest.interestedPeople}
              />
              <RequestDetail label="Formål og målgruppe" value={selectedRequest.purpose} />
              <RequestDetail
                label="Behov fra Hovedstyre"
                value={selectedRequest.needsFromHovedstyre || "Ikke oppgitt"}
              />
              <RequestDetail label="Kontakt-e-post" value={selectedRequest.contactEmail} />
              <RequestDetail label="Sendt inn" value={formatDate(selectedRequest.createdAt)} />
            </DialogBody>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={requestToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setRequestToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett forespørsel?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            Er du sikker på at du vil slette forespørselen om{" "}
            <strong>{requestToDelete?.groupName}</strong>?
          </DialogBody>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setRequestToDelete(null)}
              disabled={isPending}
            >
              Avbryt
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteRequest}
              disabled={isPending}
            >
              {isPending ? "Sletter..." : "Slett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function RequestDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <p className="whitespace-pre-wrap">{value}</p>
    </div>
  );
}
