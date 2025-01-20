import groq from "groq";

export const allRepeatingHappeningsQuery = groq`
*[_type == "repeatingHappening"
  && !(_id in path('drafts.**'))] {
  _id,
  _type,
  title,
  "slug": slug.current,
  happeningType,
  "organizers": organizers[]->{
    _id,
    name,
    "slug": slug.current
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "location": location->{
    name,
  },
  dayOfWeek,
  startTime,
  endTime,
  startDate,
  endDate,
  interval,
  cost,
  ignoredDates,
  externalLink,
  body,
}`;
