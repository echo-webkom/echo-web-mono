import banner from "./banner";
import company from "./company";
import happening from "./happening";
import hsApplication from "./hs-application";
import job from "./job-ad";
import location from "./location";
import meetingMinute from "./meeting-minute";
import merch from "./merch";
import movies from "./movies";
import notification from "./notification";
import contactProfile from "./objects/contact-profile";
import question from "./objects/question";
import spotRange from "./objects/spot-range";
import time from "./objects/time";
import post from "./post";
import profile from "./profile";
import repeatingHappening from "./repeating-happening";
import staticInfo from "./static-info";
import studentGroup from "./student-group";

export const schemaTypes = [
  happening,
  repeatingHappening,
  post,
  company,
  job,
  profile,
  staticInfo,
  location,
  studentGroup,
  meetingMinute,
  spotRange,
  contactProfile,
  question,
  movies,
  banner,
  time,
  hsApplication,
  merch,
];
