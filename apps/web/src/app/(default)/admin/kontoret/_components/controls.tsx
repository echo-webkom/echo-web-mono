export const CalendarControls = ({
  date,
  weekDays,
  setDate,
}: {
  date: Date;
  weekDays: Array<Date>;
  setDate: (date: Date) => void;
}) => {
  // Add week navigation handlers
  const prevWeek = () => {
    const d = new Date(date);
    d.setDate(d.getDate() - 7);
    setDate(d);
  };

  const nextWeek = () => {
    const d = new Date(date);
    d.setDate(d.getDate() + 7);
    setDate(d);
  };
  return (
    <div className="mb-4 flex items-center gap-6">
      <button onClick={prevWeek} className="rounded border px-2 py-1">
        ← Forrige uke
      </button>
      <span className="font-semibold">
        Uke {weekDays[0] ? weekDays[0].toLocaleDateString() : ""} -{" "}
        {weekDays[6] ? weekDays[6].toLocaleDateString() : ""}
      </span>
      <button onClick={nextWeek} className="rounded border px-2 py-1">
        Neste uke →
      </button>
      <div className="m-4 ml-auto flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-pink-500" />
          <span>Mine bookinger</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block h-4 w-4 rounded bg-blue-500" />
          <span>Andre brukeres bookinger</span>
        </div>
      </div>
    </div>
  );
};
