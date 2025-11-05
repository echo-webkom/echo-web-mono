import React, { useEffect, useState } from "react";

export type BookingFormValues = {
  title: string;
  start: string;
  end: string;
};

export default function BookingModal({
  open,
  day,
  initial = { title: "", start: "09:00", end: "10:00" },
  onClose,
  onSubmit,
}: {
  open: boolean;
  day: Date | null;
  initial?: BookingFormValues;
  onClose: () => void;
  onSubmit: (values: BookingFormValues) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial.title);
      setStart(initial.start);
      setEnd(initial.end);
    }
  }, [initial.end, initial.start, initial.title, open]);

  if (!open || !day) return null;

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title || !start || !end) return;
    setSaving(true);
    try {
      await onSubmit({ title, start, end });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <form onSubmit={submit} className="relative z-10 w-full max-w-md rounded bg-white p-4 shadow">
        <h3 className="mb-2 text-lg font-medium">Ny booking — {day.toDateString()}</h3>

        <label className="mb-2 block">
          <span className="text-sm">Tittel</span>
          <input
            className="mt-1 w-full rounded border px-2 py-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <div className="mb-4 flex gap-2">
          <label className="flex-1">
            <span className="text-sm">Start</span>
            <input
              type="time"
              className="mt-1 w-full rounded border px-2 py-1"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </label>

          <label className="flex-1">
            <span className="text-sm">Slutt</span>
            <input
              type="time"
              className="mt-1 w-full rounded border px-2 py-1"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-3 py-1"
            disabled={saving}
          >
            Avbryt
          </button>
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1 text-white"
            disabled={saving}
          >
            {saving ? "Lagrer..." : "Lagre"}
          </button>
        </div>
      </form>
    </div>
  );
}
