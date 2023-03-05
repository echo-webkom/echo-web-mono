import author from './author';
import post from './post';
import meetingMinute from './meetingMinute';
import profile from './profile';
import studentGroup from './studentGroup';
import additionalQuestion from './additionalQuestion';
import spotRange from './spotRange';
import happening from './happening';
import jobAdvert from './jobAdvert';
import banner from './banner';
import staticInfo from './staticInfo';
import { localeMarkdown, localeString } from './localeSchemas';

export const schemaTypes = [
    happening,
    post,
    additionalQuestion,
    spotRange,
    meetingMinute,
    author,
    profile,
    studentGroup,
    jobAdvert,
    banner,
    staticInfo,
    localeMarkdown,
    localeString,
];
