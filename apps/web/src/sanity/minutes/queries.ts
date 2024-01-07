import { groq } from "next-sanity";

export const meetingMinuteIdsQuery = groq`
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] {
  "id": _id
}
`;

export const meetingMinutePartial = groq`
_id,
isAllMeeting,
date,
title,
"document": document.asset->url
`;

export const meetingMinuteByIdQuery = groq`
*[_type == "meetingMinute" && _id == $id && !(_id in path('drafts.**'))] {
  ${meetingMinutePartial}
}[0]
`;

export const allMeetingMinuteQuery = groq`
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] | order(date desc) {
  ${meetingMinutePartial}
}
`;
