"use client"

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  endDate?: Date;
  body: string;
  link: string;
}

type Props = {
  events: Array<CalendarEvent>;
};

export const Calendar = ({ events }: Props) => {

}
