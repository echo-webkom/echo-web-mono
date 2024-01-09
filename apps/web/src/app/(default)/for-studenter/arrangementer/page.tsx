import { Suspense } from "react";

import { Container } from "@/components/container";
import {
  EventDateFilterSidebar,
  EventFilterBar,
  EventSearchAndOrderBar,
} from "@/components/event-filter";
import EventsView from "@/components/events-view";

export type SearchParams = {
  type: string;
  order: string;
  search?: string;
  open?: string;
  past?: string;
  thisWeek?: string;
  nextWeek?: string;
  later?: string;
};

export default function Page({ searchParams }: { searchParams?: SearchParams }) {
  const params = searchParams ?? {
    type: "all",
    order: "DESC",
  };

  return (
    <Container>
      <section>
        <div>
          <EventFilterBar />
        </div>
        <div>
          <EventSearchAndOrderBar />
        </div>
        <div>
          <div>
            <EventDateFilterSidebar />
          </div>
          <div>
            <Suspense fallback={<p>Laster...</p>}>
              <EventsView params={params} />
            </Suspense>
          </div>
        </div>
      </section>
    </Container>
  );
}
