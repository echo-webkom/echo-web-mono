"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";

import { removeAllRegistrations } from "@/actions/remove-all-registrations";
import { Button } from "@/components/ui/button";

type RemoveAllRegistrationsButtonProps = {
  slug: string;
};

export const RemoveAllRegistrationsButton = ({ slug }: RemoveAllRegistrationsButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const closeDialog = () => {
    setIsOpen(false);
  };
  const openDialog = () => {
    setIsOpen(true);
  };

  const handleRemoveAllRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/remove-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.message);
      } else {
        setIsOpen(false);
      }
    } catch (err) {
      setError("An error occurred while removing registrations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={openDialog}> Fjern alle påmeldinger </Button>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <Button onClick={removeAllRegistrations}>Ja, fjern alle</Button>
            <Button onClick={handleRemoveAllRegistrations} disabled={loading}>
              {loading ? "Removing..." : "Ja, fjern alle"}
            </Button>
            <Button onClick={closeDialog}>Close</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
