"use client";

import { useEffect, useState } from "react";

import { Happening } from "@echo-webkom/db/schemas";

import { createNotification } from "@/actions/create-notification";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NotificationFormProps = {
  userEvents: Happening[];
};

export default function NotificationForm({ userEvents }: NotificationFormProps) {
  const [selectedEvent, setSelectedEvent] = useState<Happening | null>(null);
  const [notificationName, setNotificationName] = useState("");

  const handleSelectEvent = (eventId: string) => {
    const event = userEvents.find((e) => e.id === eventId) || null;
    setSelectedEvent(event);
  };

  useEffect(() => {
    if (selectedEvent) {
      setNotificationName(`Husk du er påmeldt: ${selectedEvent.title}`);
    }
  }, [selectedEvent]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedEvent) {
      alert("Vennligst velg et event først.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const dateFrom = formData.get("dateFrom") as string;
    const dateTo = formData.get("dateTo") as string;
    const payload = {
      name: notificationName,
      dateFrom: new Date(dateFrom),
      dateTo: new Date(dateTo),
    };

    const result = await createNotification(payload);
    console.log(result);
  };

  return (
    <div className="space-x-6 space-y-6 px-10 py-10">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-2 block text-sm font-medium">Velg et event</Label>
            <Select onValueChange={handleSelectEvent} value={selectedEvent?.id || ""}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Velg et event" />
              </SelectTrigger>
              <SelectContent>
                {userEvents.map((happening) => (
                  <SelectItem key={happening.id} value={happening.id}>
                    {happening.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEvent && (
            <div>
              <Label className="mb-1 block text-sm font-medium">Valgt event</Label>
              <Card className="border p-3">
                <p className="text-sm">{selectedEvent.title}</p>
              </Card>
            </div>
          )}

          <div>
            <Label htmlFor="name" className="mb-1 block text-sm font-medium">
              Navnet på notifikasjonen
            </Label>
            <Input
              id="name"
              name="name"
              value={notificationName}
              onChange={(e) => setNotificationName(e.target.value)}
              placeholder="Navn på notifikasjonen"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="dateFrom" className="mb-1 block text-sm font-medium">
                Startdato
              </Label>
              <Input id="dateFrom" type="date" name="dateFrom" required />
            </div>
            <div>
              <Label htmlFor="dateTo" className="mb-1 block text-sm font-medium">
                Sluttdato
              </Label>
              <Input id="dateTo" type="date" name="dateTo" required />
            </div>
          </div>

          <Button type="submit">Send notifikasjon</Button>
        </form>
      </Card>
    </div>
  );
}
