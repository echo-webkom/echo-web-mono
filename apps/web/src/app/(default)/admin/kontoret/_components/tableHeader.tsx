export const TableHeader = ({ weekDays }: { weekDays: Array<Date> }) => {
  return (
    <div className="flex">
      <div className="w-16 border-b" />
      <div className="flex flex-1">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="sticky top-0 z-10 w-40 border-b text-center text-sm font-semibold"
          >
            {day.toLocaleDateString(undefined, {
              weekday: "short",
              day: "numeric",
              month: "numeric",
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
