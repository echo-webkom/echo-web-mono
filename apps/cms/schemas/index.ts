import bedpres from "./bedpres";
import company from "./company";
import event from "./event";
import job from "./job-ad";
import location from "./location";
import meetingMinute from "./meeting-minute";
import contactProfile from "./objects/contact-profile";
import question from "./objects/question";
import registrationDates from "./objects/registration-dates";
import spotRange from "./objects/spot-range";
import post from "./post";
import profile from "./profile";
import staticInfo from "./static-info";
import studentgroup from "./student-group";

export const schemaTypes = [
  event,
  bedpres,
  post,
  company,
  job,
  profile,
  staticInfo,
  location,
  studentgroup,
  meetingMinute,
  spotRange,
  contactProfile,
  question,
  registrationDates,
];
