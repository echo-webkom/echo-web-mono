"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Blockquote } from "@/components/typography/blockquote";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUnoClient } from "@/providers/uno";

export function SubmitQuoteModal() {
  const unoClient = useUnoClient();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [text, setText] = useState("");
  const [person, setPerson] = useState("");
  const [context, setContext] = useState("");

  const hasPreview = text.trim() || person.trim();

  const handleSubmit = () => {
    startTransition(async () => {
      const { ok } = await unoClient.quotes.create({
        text: text.trim(),
        person: person.trim(),
        context: context.trim() || null,
      });
      if (ok) {
        toast.success("Sitat sendt inn!");
        setIsOpen(false);
        setText("");
        setPerson("");
        setContext("");
        router.refresh();
      } else {
        toast.error("Kunne ikke sende inn sitat");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Send inn sitat</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send inn sitat</DialogTitle>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quote-text">Sitat</Label>
            <Textarea
              id="quote-text"
              placeholder="Hva ble sagt?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-24 resize-y"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quote-person">Hvem sa det?</Label>
            <Input
              id="quote-person"
              placeholder="Navn"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quote-context">
              Kontekst <span className="text-muted-foreground font-normal">(valgfritt)</span>
            </Label>
            <Input
              id="quote-context"
              placeholder="F.eks. forelesning, fagkveld, ..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          {hasPreview && (
            <div className="bg-muted rounded-md p-4">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Forhåndsvisning
              </p>
              <Blockquote className="text-base">{text || "..."}</Blockquote>
              <p className="mt-3 text-sm font-semibold">
                — {person || "..."}
                {context.trim() && `, ${context.trim()}`}
              </p>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} type="button">
            Avbryt
          </Button>
          <Button onClick={handleSubmit} disabled={!text.trim() || !person.trim() || isPending}>
            {isPending ? "Sender..." : "Send inn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
