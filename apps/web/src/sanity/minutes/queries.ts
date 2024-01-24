import { groq } from "next-sanity";

export const meetingMinutePartial = groq`
_id,
isAllMeeting,
date,
title,
"document": document.asset->url
`;

export const allMeetingMinuteQuery = groq`
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] | order(date desc) {
  ${meetingMinutePartial}
}
`;
