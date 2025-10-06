export const CalendarTableSidebar = ({
  startHour = 0,
  endHour = 23,
}: {
  startHour?: number;
  endHour?: number;
}) => {
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  return (
    <div className="h-full w-16 flex-shrink-0 text-xs">
      {hours.map((h, i) => (
        <div key={h} className={i !== hours.length - 1 ? "h-16 border-b" : "h-16"}>
          {`${String(h).padStart(2, "0")}:00`}
        </div>
      ))}
    </div>
  );
};
