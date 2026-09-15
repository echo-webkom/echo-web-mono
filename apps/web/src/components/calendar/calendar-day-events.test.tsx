import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { type CalendarEvent } from "@/lib/calendar-event-helpers";

import { CalendarDayEvents } from "./calendar-day-events";
import { CalendarMultiDayEvents } from "./calendar-multi-day-events";
import { EventHoverPreview } from "./event-hover-prev";

const multiDay: CalendarEvent = {
  id: "trip",
  title: "Fjelltur",
  date: new Date("2026-10-07T18:00:00+02:00"),
  endDate: new Date("2026-10-09T02:00:00+02:00"),
  body: "En tur over flere dager",
  link: "/arrangement/fjelltur",
  type: "event",
};

describe("calendar day content", () => {
  it("keeps multi-day events out of the daily list and omits visible times", () => {
    const daily = {
      ...multiDay,
      id: "lunch",
      title: "Lunsj",
      date: new Date("2026-10-08T12:00:00+02:00"),
      endDate: undefined,
    };
    const trips = [0, 1, 2, 3].map((i) => ({
      ...multiDay,
      id: `trip-${i}`,
      title: `Fjelltur ${i}`,
    }));
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <CalendarDayEvents events={[...trips, daily]} day={new Date(2026, 9, 8)} />,
    );
    expect(container.querySelector("a")?.textContent).toContain("Lunsj");
    expect(container.textContent).not.toContain("Over flere dager");
    expect(container.textContent).not.toContain("12:00");
    expect(container.querySelectorAll("a")).toHaveLength(1);
  });

  it("connects days in the same row with a title only on the first day", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <CalendarMultiDayEvents
        events={[multiDay]}
        days={[new Date(2026, 9, 7), new Date(2026, 9, 8), new Date(2026, 9, 9)]}
      />,
    );
    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(3);
    expect(links[0]?.textContent).toBe("Fjelltur");
    expect(links[1]?.textContent).toBe("");
    expect(links[2]?.textContent).toBe("");
    expect(links[1]?.getAttribute("aria-label")).toContain("Fjelltur");
    expect(links[1]?.getAttribute("aria-label")).toContain("Fortsetter");
    expect(links[0]?.style.gridColumn).toBe("1");
    expect(links[2]?.style.gridColumn).toBe("3");
    expect(links[0]?.parentElement).toBe(links[2]?.parentElement);
  });

  it("keeps an event accessible when it started before the visible week", () => {
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <CalendarMultiDayEvents
        events={[multiDay]}
        days={[new Date(2026, 9, 8), new Date(2026, 9, 9), new Date(2026, 9, 10)]}
      />,
    );
    expect(container.querySelectorAll("a")).toHaveLength(2);
    expect(container.querySelector("a")?.getAttribute("aria-label")).toContain("Fjelltur");
    expect(container.querySelector("a")?.textContent).toBe("Fjelltur");
  });

  it("leaves week boundaries open and labels the continuation on Monday", () => {
    const event = {
      ...multiDay,
      date: new Date("2026-10-11T18:00:00+02:00"),
      endDate: new Date("2026-10-12T20:00:00+02:00"),
    };
    const container = document.createElement("div");
    container.innerHTML = renderToStaticMarkup(
      <CalendarMultiDayEvents events={[event]} days={[new Date(2026, 9, 11)]} />,
    );
    expect(container.querySelector("span[aria-hidden]")?.className).not.toContain("rounded-r-full");
    container.innerHTML = renderToStaticMarkup(
      <CalendarMultiDayEvents events={[event]} days={[new Date(2026, 9, 12)]} compact={false} />,
    );
    expect(container.querySelector("a")?.textContent).toBe("Fjelltur");
    expect(container.querySelector("span[aria-hidden]")?.className).not.toContain("rounded-l-full");
    expect(container.querySelector("a")?.style.height).toBe("32px");
  });

  it("shows the original full interval in the preview of a continuation", () => {
    const html = renderToStaticMarkup(
      <EventHoverPreview event={multiDay} day={new Date(2026, 9, 8)} />,
    );
    expect(html).toContain("Fortsettelse av samme arrangement");
    expect(html).toContain("Fra 7. okt. 2026, 18:00");
    expect(html).toContain("Til 9. okt. 2026, 02:00");
  });
});
