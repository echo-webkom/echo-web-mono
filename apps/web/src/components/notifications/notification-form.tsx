"use client";

import { createNotification } from "@/actions/create-notification";

export default function NotificationForm() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      dateFrom: new Date(formData.get("dateFrom") as string),
      dateTo: new Date(formData.get("dateTo") as string),
    };

    await createNotification(payload);
  };

  return (
    <div className="py-10">
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Navn på notifikasjonen" required />
        <input type="date" name="dateFrom" placeholder="Startdato" required />
        <input type="date" name="dateTo" placeholder="Sluttdato" required />
        <button type="submit">Opprett notifikasjon</button>
      </form>
    </div>
  );
}
