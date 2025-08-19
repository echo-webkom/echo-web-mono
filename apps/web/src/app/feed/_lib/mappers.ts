import {
  type AllHappeningsQueryResult,
  type AllMeetingMinuteQueryResult,
  type AllPostsQueryResult,
} from "@echo-webkom/cms/types";

import { type RSSItem } from "@/lib/rss";

type Post = AllPostsQueryResult[number];
type Happening = AllHappeningsQueryResult[number];
type MeetingMinute = AllMeetingMinuteQueryResult[number];

const POST_DESCRIPTION_LENGTH = 300;
const HAPPENING_DESCRIPTION_LENGTH = 300;

export const postToRSSItem = (post: Post): RSSItem => {
  const title = post.title;
  const link = `https://echo.uib.no/for-studenter/innlegg/${post.slug}`;
  const creator = post.authors ? post.authors?.map((author) => author.name).join(", ") : "echo";
  const pubDate = new Date(post._createdAt).toUTCString();
  const description =
    post.body && post.body.length > POST_DESCRIPTION_LENGTH
      ? post.body.slice(0, POST_DESCRIPTION_LENGTH) + "..."
      : post.body;
  const content = post.body;

  return {
    title,
    link,
    guid: post._id,
    creator,
    pubDate,
    description,
    content,
    category: "Innlegg",
  };
};

export const happeningToRSSItem = (happening: Happening): RSSItem => {
  const title = happening.title;
  const link =
    happening.happeningType === "bedpres"
      ? `https://echo.uib.no/bedpres/${happening.slug}`
      : `https://echo.uib.no/arrangement/${happening.slug}`;
  const creator =
    happening.organizers?.map((organizer) => organizer.name).join(", ") ?? "Ingen arrangør";
  const pubDate = new Date(happening._createdAt).toUTCString();
  const description =
    happening.body && happening.body.length > HAPPENING_DESCRIPTION_LENGTH
      ? happening.body.slice(0, HAPPENING_DESCRIPTION_LENGTH) + "..."
      : (happening.body ?? "");
  const content = happening.body ?? "";

  const category = happening.happeningType === "bedpres" ? "Bedriftspresentasjon" : "Arrangement";

  return { title, link, guid: happening._id, creator, pubDate, description, content, category };
};

export const meetingMinuteToRSSItem = (minute: MeetingMinute): RSSItem => {
  const title = minute.title;
  const link = `https://echo.uib.no/for-studenter/motereferat/${minute._id}`;
  const creator = "echo";
  const pubDate = new Date(minute.date).toUTCString();
  const description = minute.isAllMeeting ? "Allmøtereferat" : "Møtereferat";
  const content = `${description} fra ${new Date(minute.date).toLocaleDateString("nb-NO")}. Dokument: ${minute.document ?? "Ikke tilgjengelig"}`;

  const category = minute.isAllMeeting ? "Allmøtereferat" : "Møtereferat";

  return { title, link, guid: minute._id, creator, pubDate, description, content, category };
};
