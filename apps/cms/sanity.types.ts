// Query TypeMap
import "@sanity/client";

/**
 * ---------------------------------------------------------------------------------
 * This file has been generated by Sanity TypeGen.
 * Command: `sanity typegen generate`
 *
 * Any modifications made directly to this file will be overwritten the next time
 * the TypeScript definitions are generated. Please make changes to the Sanity
 * schema definitions and/or GROQ queries if you need to update these types.
 *
 * For more information on how to use Sanity TypeGen, visit the official documentation:
 * https://www.sanity.io/docs/sanity-typegen
 * ---------------------------------------------------------------------------------
 */

// Source: schema.json
export type SanityImagePaletteSwatch = {
  _type: "sanity.imagePaletteSwatch";
  background?: string;
  foreground?: string;
  population?: number;
  title?: string;
};

export type SanityImagePalette = {
  _type: "sanity.imagePalette";
  darkMuted?: SanityImagePaletteSwatch;
  lightVibrant?: SanityImagePaletteSwatch;
  darkVibrant?: SanityImagePaletteSwatch;
  vibrant?: SanityImagePaletteSwatch;
  dominant?: SanityImagePaletteSwatch;
  lightMuted?: SanityImagePaletteSwatch;
  muted?: SanityImagePaletteSwatch;
};

export type SanityImageDimensions = {
  _type: "sanity.imageDimensions";
  height?: number;
  width?: number;
  aspectRatio?: number;
};

export type Geopoint = {
  _type: "geopoint";
  lat?: number;
  lng?: number;
  alt?: number;
};

export type Movie = {
  _id: string;
  _type: "movie";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  date: string;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  link?: string;
};

export type Question = {
  _type: "question";
  id: string;
  title: string;
  required: boolean;
  type: "text" | "textarea" | "checkbox" | "radio";
  isSensitive?: boolean;
  options?: Array<string>;
};

export type ContactProfile = {
  _type: "contactProfile";
  profile: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "profile";
  };
  email: string;
};

export type SpotRange = {
  _type: "spotRange";
  minYear: number;
  maxYear: number;
  spots: number;
};

export type MeetingMinute = {
  _id: string;
  _type: "meetingMinute";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  date: string;
  isAllMeeting: boolean;
  document: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.fileAsset";
    };
    _type: "file";
  };
};

export type SanityFileAsset = {
  _id: string;
  _type: "sanity.fileAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  source?: SanityAssetSourceData;
};

export type StudentGroup = {
  _id: string;
  _type: "studentGroup";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  slug: Slug;
  groupType: "board" | "subgroup" | "suborg" | "intgroup" | "sport" | "hidden";
  socials?: {
    email?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  description?: string;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  members?: Array<{
    profile?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "profile";
    };
    role?: string;
    _type: "member";
    _key: string;
  }>;
};

export type StaticInfo = {
  _id: string;
  _type: "staticInfo";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: Slug;
  pageType: "for-students" | "for-companies" | "about";
  body: string;
};

export type Profile = {
  _id: string;
  _type: "profile";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  picture?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  socials?: {
    email?: string;
    linkedin?: string;
  };
};

export type Job = {
  _id: string;
  _type: "job";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: Slug;
  company: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "company";
  };
  expiresAt: string;
  weight: number;
  locations: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "location";
  }>;
  jobType: "fulltime" | "parttime" | "internship" | "summerjob" | "event" | "ad";
  link: string;
  deadline?: string;
  degreeYears?: {
    FIRST?: boolean;
    SECOND?: boolean;
    THIRD?: boolean;
    FOURTH?: boolean;
    FIFTH?: boolean;
    PHD?: boolean;
  };
  body: string;
};

export type Post = {
  _id: string;
  _type: "post";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: Slug;
  authors?: Array<
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "studentGroup";
      }
    | {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "profile";
      }
  >;
  image?: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
  body: string;
};

export type Happening = {
  _id: string;
  _type: "happening";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title: string;
  slug: Slug;
  isPinned: boolean;
  happeningType: "event" | "bedpres" | "external";
  organizers?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "studentGroup";
  }>;
  company?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "company";
  };
  location?: {
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    [internalGroqTypeReferenceTo]?: "location";
  };
  cost?: number;
  date: string;
  endDate?: string;
  registrationStartGroups?: string;
  registrationGroups?: Array<{
    _ref: string;
    _type: "reference";
    _weak?: boolean;
    _key: string;
    [internalGroqTypeReferenceTo]?: "studentGroup";
  }>;
  registrationStart?: string;
  registrationEnd?: string;
  contacts?: Array<
    {
      _key: string;
    } & ContactProfile
  >;
  spotRanges?: Array<
    {
      _key: string;
    } & SpotRange
  >;
  additionalQuestions?: Array<
    {
      _key: string;
    } & Question
  >;
  externalLink?: string;
  body?: string;
};

export type Location = {
  _id: string;
  _type: "location";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  link?: string;
};

export type Company = {
  _id: string;
  _type: "company";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name: string;
  website: string;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
};

export type SanityImageCrop = {
  _type: "sanity.imageCrop";
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

export type SanityImageHotspot = {
  _type: "sanity.imageHotspot";
  x?: number;
  y?: number;
  height?: number;
  width?: number;
};

export type SanityImageAsset = {
  _id: string;
  _type: "sanity.imageAsset";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  originalFilename?: string;
  label?: string;
  title?: string;
  description?: string;
  altText?: string;
  sha1hash?: string;
  extension?: string;
  mimeType?: string;
  size?: number;
  assetId?: string;
  uploadId?: string;
  path?: string;
  url?: string;
  metadata?: SanityImageMetadata;
  source?: SanityAssetSourceData;
};

export type SanityAssetSourceData = {
  _type: "sanity.assetSourceData";
  name?: string;
  id?: string;
  url?: string;
};

export type SanityImageMetadata = {
  _type: "sanity.imageMetadata";
  location?: Geopoint;
  dimensions?: SanityImageDimensions;
  palette?: SanityImagePalette;
  lqip?: string;
  blurHash?: string;
  hasAlpha?: boolean;
  isOpaque?: boolean;
};

export type Markdown = string;

export type MediaTag = {
  _id: string;
  _type: "media.tag";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: Slug;
};

export type Slug = {
  _type: "slug";
  current: string;
  source?: string;
};

export type AllSanitySchemaTypes =
  | SanityImagePaletteSwatch
  | SanityImagePalette
  | SanityImageDimensions
  | Geopoint
  | Movie
  | Question
  | ContactProfile
  | SpotRange
  | MeetingMinute
  | SanityFileAsset
  | StudentGroup
  | StaticInfo
  | Profile
  | Job
  | Post
  | Happening
  | Location
  | Company
  | SanityImageCrop
  | SanityImageHotspot
  | SanityImageAsset
  | SanityAssetSourceData
  | SanityImageMetadata
  | Markdown
  | MediaTag
  | Slug;
export declare const internalGroqTypeReferenceTo: unique symbol;
// Source: ../web/src/sanity/happening/queries.ts
// Variable: allHappeningsQuery
// Query: *[_type == "happening"  && !(_id in path('drafts.**'))]  | order(date asc) {    _id,  _createdAt,  _updatedAt,  title,  "slug": slug.current,  isPinned,  happeningType,  "company": company->{    _id,    name,    website,    image,  },  "organizers": organizers[]->{    _id,    name,    "slug": slug.current  },  "contacts": contacts[] {    email,    "profile": profile->{      _id,      name,    },  },  "date": date,  "endDate": endDate,  cost,  "registrationStartGroups": registrationStartGroups,  "registrationGroups": registrationGroups[]->slug.current,  "registrationStart": registrationStart,  "registrationEnd": registrationEnd,  "location": location->{    name,  },  "spotRanges": spotRanges[] {    spots,    minYear,    maxYear,  },  "additionalQuestions": additionalQuestions[] {    id,    title,    required,    type,    options,  },  externalLink,  body}
export type AllHappeningsQueryResult = Array<{
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: string;
  isPinned: boolean;
  happeningType: "bedpres" | "event" | "external";
  company: {
    _id: string;
    name: string;
    website: string;
    image: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
  } | null;
  organizers: Array<{
    _id: string;
    name: string;
    slug: string;
  }> | null;
  contacts: Array<{
    email: string;
    profile: {
      _id: string;
      name: string;
    };
  }> | null;
  date: string;
  endDate: string | null;
  cost: number | null;
  registrationStartGroups: string | null;
  registrationGroups: Array<string> | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  location: {
    name: string;
  } | null;
  spotRanges: Array<{
    spots: number;
    minYear: number;
    maxYear: number;
  }> | null;
  additionalQuestions: Array<{
    id: string;
    title: string;
    required: boolean;
    type: "checkbox" | "radio" | "text" | "textarea";
    options: Array<string> | null;
  }> | null;
  externalLink: string | null;
  body: string | null;
}>;
// Variable: happeningQuery
// Query: *[_type == "happening"  && !(_id in path('drafts.**'))  && slug.current == $slug][0] {  _id,  _createdAt,  _updatedAt,  title,  "slug": slug.current,  isPinned,  happeningType,  "company": company->{    _id,    name,    website,    image,  },  "organizers": organizers[]->{    _id,    name,    "slug": slug.current  },  "contacts": contacts[] {    email,    "profile": profile->{      _id,      name,    },  },  "date": date,  "endDate": endDate,  cost,  "registrationStartGroups": registrationStartGroups,  "registrationGroups": registrationGroups[]->slug.current,  "registrationStart": registrationStart,  "registrationEnd": registrationEnd,  "location": location->{    name,  },  "spotRanges": spotRanges[] {    spots,    minYear,    maxYear,  },  "additionalQuestions": additionalQuestions[] {    title,    required,    type,    options,  },  externalLink,  body}
export type HappeningQueryResult = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: string;
  isPinned: boolean;
  happeningType: "bedpres" | "event" | "external";
  company: {
    _id: string;
    name: string;
    website: string;
    image: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
  } | null;
  organizers: Array<{
    _id: string;
    name: string;
    slug: string;
  }> | null;
  contacts: Array<{
    email: string;
    profile: {
      _id: string;
      name: string;
    };
  }> | null;
  date: string;
  endDate: string | null;
  cost: number | null;
  registrationStartGroups: string | null;
  registrationGroups: Array<string> | null;
  registrationStart: string | null;
  registrationEnd: string | null;
  location: {
    name: string;
  } | null;
  spotRanges: Array<{
    spots: number;
    minYear: number;
    maxYear: number;
  }> | null;
  additionalQuestions: Array<{
    title: string;
    required: boolean;
    type: "checkbox" | "radio" | "text" | "textarea";
    options: Array<string> | null;
  }> | null;
  externalLink: string | null;
  body: string | null;
} | null;
// Variable: homeHappeningsQuery
// Query: *[_type == "happening"  && !(_id in path('drafts.**'))  && (isPinned || date >= now())  && happeningType in $happeningTypes]| order(isPinned desc, date asc) {  _id,  title,  isPinned,  happeningType,  date,  registrationStart,  "slug": slug.current,  "image": company->image,  "organizers": organizers[]->{    name  }.name}[0...$n]
export type HomeHappeningsQueryResult = Array<{
  _id: string;
  title: string;
  isPinned: boolean;
  happeningType: "bedpres" | "event" | "external";
  date: string;
  registrationStart: string | null;
  slug: string;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  } | null;
  organizers: Array<string> | null;
}>;
// Variable: happeningTypeQuery
// Query: *[_type == "happening"  && !(_id in path('drafts.**'))  && slug.current == $slug ] {  happeningType,}[0].happeningType
export type HappeningTypeQueryResult = "bedpres" | "event" | "external" | null;

// Source: ../web/src/sanity/job-ad/queries.ts
// Variable: jobAdsQuery
// Query: *[_type == "job"  && !(_id in path('drafts.**'))  && expiresAt > now()]  | order(weight desc, deadline desc) {  _id,  _createdAt,  _updatedAt,  weight,  title,  "slug": slug.current,  "company": company->{    _id,    name,    website,    image,  },  expiresAt,  "locations": locations[]->{    _id,    name,  },  jobType,  link,  deadline,  degreeYears,  body}
export type JobAdsQueryResult = Array<{
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  weight: number;
  title: string;
  slug: string;
  company: {
    _id: string;
    name: string;
    website: string;
    image: {
      asset?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
        [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
      };
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      _type: "image";
    };
  };
  expiresAt: string;
  locations: Array<{
    _id: string;
    name: string;
  }>;
  jobType: "ad" | "event" | "fulltime" | "internship" | "parttime" | "summerjob";
  link: string;
  deadline: string | null;
  degreeYears: {
    FIRST?: boolean;
    SECOND?: boolean;
    THIRD?: boolean;
    FOURTH?: boolean;
    FIFTH?: boolean;
    PHD?: boolean;
  } | null;
  body: string;
}>;

// Source: ../web/src/sanity/minutes/queries.ts
// Variable: allMeetingMinuteQuery
// Query: *[_type == "meetingMinute" && !(_id in path('drafts.**'))] | order(date desc) {  _id,  isAllMeeting,  date,  title,  "document": document.asset->url}
export type AllMeetingMinuteQueryResult = Array<{
  _id: string;
  isAllMeeting: boolean;
  date: string;
  title: string;
  document: string | null;
}>;

// Source: ../web/src/sanity/movies/queries.ts
// Variable: moviesQuery
// Query: *[_type == "movie"  && !(_id in path('drafts.**'))]  | order(_createdAt desc) {  _id,  title,  date,  link,  image,}
export type MoviesQueryResult = Array<{
  _id: string;
  title: string;
  date: string;
  link: string | null;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  };
}>;

// Source: ../web/src/sanity/posts/queries.ts
// Variable: allPostsQuery
// Query: *[_type == "post" && !(_id in path('drafts.**'))] | order(_createdAt desc) {  _id,  _createdAt,  _updatedAt,  title,  "slug": slug.current,  "authors": authors[]->{    _id,    name,    image,  },  image,  body}
export type AllPostsQueryResult = Array<{
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: string;
  authors: Array<
    | {
        _id: string;
        name: string;
        image: null;
      }
    | {
        _id: string;
        name: string;
        image: {
          asset?: {
            _ref: string;
            _type: "reference";
            _weak?: boolean;
            [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
          };
          hotspot?: SanityImageHotspot;
          crop?: SanityImageCrop;
          _type: "image";
        } | null;
      }
  > | null;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  } | null;
  body: string;
}>;

// Source: ../web/src/sanity/static-info/queries.ts
// Variable: staticInfoQuery
// Query: *[_type == "staticInfo" && !(_id in path('drafts.**'))] {  title,  "slug": slug.current,  pageType,  body}
export type StaticInfoQueryResult = Array<{
  title: string;
  slug: string;
  pageType: "about" | "for-companies" | "for-students";
  body: string;
}>;

// Source: ../web/src/sanity/student-group/queries.ts
// Variable: studentGroupsByTypeQuery
// Query: *[_type == "studentGroup"  && groupType == $type  && !(_id in path('drafts.**'))] | order(_createdAt asc) {  _id,  _createdAt,  _updatedAt,  name,  groupType,  "slug": slug.current,  description,  image,  "members": members[] {    role,    "profile": profile->{      _id,      name,      picture,      socials,    },  },  "socials": socials {    facebook,    instagram,    linkedin,    email,  }}[0..$n]
export type StudentGroupsByTypeQueryResult = Array<{
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  groupType: "board" | "hidden" | "intgroup" | "sport" | "subgroup" | "suborg";
  slug: string;
  description: string | null;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  } | null;
  members: Array<{
    role: string | null;
    profile: {
      _id: string;
      name: string;
      picture: {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
      } | null;
      socials: {
        email?: string;
        linkedin?: string;
      } | null;
    } | null;
  }> | null;
  socials: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    email: string | null;
  } | null;
}>;
// Variable: studentGroupBySlugQuery
// Query: *[_type == "studentGroup"  && slug.current == $slug  && !(_id in path('drafts.**'))] {  _id,  _createdAt,  _updatedAt,  name,  groupType,  "slug": slug.current,  description,  image,  "members": members[] {    role,    "profile": profile->{      _id,      name,      picture,      socials,    },  },  "socials": socials {    facebook,    instagram,    linkedin,    email,  }}[0]
export type StudentGroupBySlugQueryResult = {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  groupType: "board" | "hidden" | "intgroup" | "sport" | "subgroup" | "suborg";
  slug: string;
  description: string | null;
  image: {
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
  } | null;
  members: Array<{
    role: string | null;
    profile: {
      _id: string;
      name: string;
      picture: {
        asset?: {
          _ref: string;
          _type: "reference";
          _weak?: boolean;
          [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
        };
        hotspot?: SanityImageHotspot;
        crop?: SanityImageCrop;
        _type: "image";
      } | null;
      socials: {
        email?: string;
        linkedin?: string;
      } | null;
    } | null;
  }> | null;
  socials: {
    facebook: string | null;
    instagram: string | null;
    linkedin: string | null;
    email: string | null;
  } | null;
} | null;

// Source: ../web/src/sanity/utils/contacts.ts
// Variable: happeningContactsQuery
// Query: *[_type == "happening" && slug.current == $slug] {"contacts": contacts[] {email,"profile": profile->{  _id,  name,},},}[0].contacts
export type HappeningContactsQueryResult = Array<{
  email: string;
  profile: {
    _id: string;
    name: string;
  };
}> | null;

declare module "@sanity/client" {
  interface SanityQueries {
    '\n*[_type == "happening"\n  && !(_id in path(\'drafts.**\'))]\n  | order(date asc) {\n    _id,\n  _createdAt,\n  _updatedAt,\n  title,\n  "slug": slug.current,\n  isPinned,\n  happeningType,\n  "company": company->{\n    _id,\n    name,\n    website,\n    image,\n  },\n  "organizers": organizers[]->{\n    _id,\n    name,\n    "slug": slug.current\n  },\n  "contacts": contacts[] {\n    email,\n    "profile": profile->{\n      _id,\n      name,\n    },\n  },\n  "date": date,\n  "endDate": endDate,\n  cost,\n  "registrationStartGroups": registrationStartGroups,\n  "registrationGroups": registrationGroups[]->slug.current,\n  "registrationStart": registrationStart,\n  "registrationEnd": registrationEnd,\n  "location": location->{\n    name,\n  },\n  "spotRanges": spotRanges[] {\n    spots,\n    minYear,\n    maxYear,\n  },\n  "additionalQuestions": additionalQuestions[] {\n    id,\n    title,\n    required,\n    type,\n    options,\n  },\n  externalLink,\n  body\n}\n': AllHappeningsQueryResult;
    '\n*[_type == "happening"\n  && !(_id in path(\'drafts.**\'))\n  && slug.current == $slug\n][0] {\n  _id,\n  _createdAt,\n  _updatedAt,\n  title,\n  "slug": slug.current,\n  isPinned,\n  happeningType,\n  "company": company->{\n    _id,\n    name,\n    website,\n    image,\n  },\n  "organizers": organizers[]->{\n    _id,\n    name,\n    "slug": slug.current\n  },\n  "contacts": contacts[] {\n    email,\n    "profile": profile->{\n      _id,\n      name,\n    },\n  },\n  "date": date,\n  "endDate": endDate,\n  cost,\n  "registrationStartGroups": registrationStartGroups,\n  "registrationGroups": registrationGroups[]->slug.current,\n  "registrationStart": registrationStart,\n  "registrationEnd": registrationEnd,\n  "location": location->{\n    name,\n  },\n  "spotRanges": spotRanges[] {\n    spots,\n    minYear,\n    maxYear,\n  },\n  "additionalQuestions": additionalQuestions[] {\n    title,\n    required,\n    type,\n    options,\n  },\n  externalLink,\n  body\n}\n': HappeningQueryResult;
    '\n*[_type == "happening"\n  && !(_id in path(\'drafts.**\'))\n  && (isPinned || date >= now())\n  && happeningType in $happeningTypes\n]\n| order(isPinned desc, date asc) {\n  _id,\n  title,\n  isPinned,\n  happeningType,\n  date,\n  registrationStart,\n  "slug": slug.current,\n  "image": company->image,\n  "organizers": organizers[]->{\n    name\n  }.name\n}[0...$n]\n\n': HomeHappeningsQueryResult;
    "\n*[_type == \"happening\"\n  && !(_id in path('drafts.**'))\n  && slug.current == $slug\n ] {\n  happeningType,\n}[0].happeningType\n": HappeningTypeQueryResult;
    '\n*[_type == "job"\n  && !(_id in path(\'drafts.**\'))\n  && expiresAt > now()]\n  | order(weight desc, deadline desc) {\n  _id,\n  _createdAt,\n  _updatedAt,\n  weight,\n  title,\n  "slug": slug.current,\n  "company": company->{\n    _id,\n    name,\n    website,\n    image,\n  },\n  expiresAt,\n  "locations": locations[]->{\n    _id,\n    name,\n  },\n  jobType,\n  link,\n  deadline,\n  degreeYears,\n  body\n}\n': JobAdsQueryResult;
    '\n*[_type == "meetingMinute" && !(_id in path(\'drafts.**\'))] | order(date desc) {\n  _id,\n  isAllMeeting,\n  date,\n  title,\n  "document": document.asset->url\n}\n': AllMeetingMinuteQueryResult;
    "\n*[_type == \"movie\"\n  && !(_id in path('drafts.**'))]\n  | order(_createdAt desc) {\n  _id,\n  title,\n  date,\n  link,\n  image,\n}\n": MoviesQueryResult;
    '\n*[_type == "post" && !(_id in path(\'drafts.**\'))] | order(_createdAt desc) {\n  _id,\n  _createdAt,\n  _updatedAt,\n  title,\n  "slug": slug.current,\n  "authors": authors[]->{\n    _id,\n    name,\n    image,\n  },\n  image,\n  body\n}\n': AllPostsQueryResult;
    '\n*[_type == "staticInfo" && !(_id in path(\'drafts.**\'))] {\n  title,\n  "slug": slug.current,\n  pageType,\n  body\n}\n': StaticInfoQueryResult;
    '\n*[_type == "studentGroup"\n  && groupType == $type\n  && !(_id in path(\'drafts.**\'))] | order(_createdAt asc) {\n  _id,\n  _createdAt,\n  _updatedAt,\n  name,\n  groupType,\n  "slug": slug.current,\n  description,\n  image,\n  "members": members[] {\n    role,\n    "profile": profile->{\n      _id,\n      name,\n      picture,\n      socials,\n    },\n  },\n  "socials": socials {\n    facebook,\n    instagram,\n    linkedin,\n    email,\n  }\n}[0..$n]\n': StudentGroupsByTypeQueryResult;
    '\n*[_type == "studentGroup"\n  && slug.current == $slug\n  && !(_id in path(\'drafts.**\'))] {\n  _id,\n  _createdAt,\n  _updatedAt,\n  name,\n  groupType,\n  "slug": slug.current,\n  description,\n  image,\n  "members": members[] {\n    role,\n    "profile": profile->{\n      _id,\n      name,\n      picture,\n      socials,\n    },\n  },\n  "socials": socials {\n    facebook,\n    instagram,\n    linkedin,\n    email,\n  }\n}[0]\n': StudentGroupBySlugQueryResult;
    '\n*[_type == "happening" && slug.current == $slug] {\n"contacts": contacts[] {\nemail,\n"profile": profile->{\n  _id,\n  name,\n},\n},\n}[0].contacts\n': HappeningContactsQueryResult;
  }
}