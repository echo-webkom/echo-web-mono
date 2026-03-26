import ky, { type KyInstance, type Options } from "ky";

const DEFAULT_BASE_URL = "https://uno.echo-webkom.no";

export type UnoClientOptions = {
  baseUrl?: string;
  adminToken?: string;
  token?: string;
};

const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

// Convert ISO date strings to Date objects
function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && isoDateRegex.test(value)) {
    return new Date(value);
  }
  return value;
}

export type UnoClientType = (typeof UnoClient)["prototype"];

export interface CMSAsset {
  _type: string;
  _ref: string;
}

export interface CMSImage {
  _type: string;
  asset: CMSAsset;
}

export interface CMSReference {
  _key: string;
  _ref: string;
  reference: string;
}

export interface CMSHsl {
  _type: string;
  a: number;
  h: number;
  l: number;
  s: number;
}

export interface CMSHsv {
  _type: string;
  a: number;
  h: number;
  s: number;
  v: number;
}

export interface CMSRgb {
  _type: string;
  a: number;
  r: number;
  g: number;
  b: number;
}

export interface CMSColor {
  _type: string;
  alpha: number;
  hex: string;
  hsl: CMSHsl;
  hsv: CMSHsv;
  rgb: CMSRgb;
}

export interface CMSLocation {
  name: string;
  link: string;
}

export interface CMSCompany {
  _id: string;
  name: string;
  website: string;
  image: CMSImage;
}

export interface CMSSpotRange {
  spots: number;
  minYear: number;
  maxYear: number;
}

export interface CMSAdditionalQuestion {
  id: string;
  title: string;
  required: boolean;
  type: string;
  options: Array<string>;
}

export interface CMSOrganizerRef {
  _id: string;
  name: string;
  slug: string;
}

export interface CMSContactProfile {
  _id: string;
  name: string;
}

export interface CMSContact {
  email: string;
  profile: CMSContactProfile;
}

export interface CMSHappening {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  _type: string;
  title: string;
  slug: string;
  isPinned: boolean | null;
  happeningType: string;
  hideRegistrations: boolean | null;
  company: CMSCompany | null;
  organizers: Array<CMSOrganizerRef>;
  contacts: Array<CMSContact>;
  date: string | null;
  endDate: string | null;
  cost: number | null;
  registrationStartGroups: Array<CMSReference>;
  registrationGroups: Array<string>;
  registrationStart: string | null;
  registrationEnd: string | null;
  location: CMSLocation | null;
  spotRanges: Array<CMSSpotRange>;
  additionalQuestions: Array<CMSAdditionalQuestion>;
  externalLink: string | null;
  body: string | null;
}

export interface CMSHomeHappening {
  _id: string;
  title: string;
  isPinned: boolean | null;
  happeningType: string;
  date: string | null;
  registrationStart: string | null;
  slug: string;
  image: CMSImage;
  organizers: Array<string>;
}

export interface CMSRepeatingHappening {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  happeningType: string;
  organizers: Array<CMSOrganizerRef>;
  contacts: Array<CMSContact>;
  location: CMSLocation | null;
  dayOfWeek: string | null;
  startTime: string | null;
  endTime: string | null;
  startDate: string | null;
  endDate: string | null;
  interval: number | null;
  cost: number | null;
  ignoredDates: Array<string>;
  externalLink: string | null;
  body: string | null;
}

export interface CMSAuthor {
  _id: string;
  name: string;
  image: CMSImage;
}

export interface CMSPost {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: string;
  authors: Array<CMSAuthor>;
  image: CMSImage;
  body: string | null;
}

export interface CMSProfileSocials {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  email: string | null;
}

export interface CMSMemberProfile {
  _id: string;
  name: string;
  picture: CMSImage;
  socials: CMSProfileSocials | null;
}

export interface CMSMember {
  role: string;
  profile: CMSMemberProfile;
}

export interface CMSStudentGroupSocials {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  email: string | null;
}

export interface CMSStudentGroup {
  _id: string;
  _createdAt: Date;
  _updatedAt: Date;
  name: string;
  isActive: boolean | null;
  groupType: string;
  slug: string;
  description: string | null;
  image: CMSImage;
  members: Array<CMSMember>;
  socials: CMSStudentGroupSocials | null;
}

export interface CMSJobLocation {
  _id: string;
  name: string;
}

export interface CMSJobAd {
  _id: string;
  _createdAt: Date;
  _updatedAt: Date;
  weight: number | null;
  title: string;
  slug: string;
  company: CMSCompany | null;
  expiresAt: Date;
  locations: Array<CMSJobLocation>;
  jobType: string | null;
  link: string | null;
  deadline: string | null;
  degreeYears: Array<number>;
  body: string | null;
}

export interface CMSBanner {
  backgroundColor: CMSColor | null;
  textColor: CMSColor | null;
  text: string | null;
  expiringDate: string | null;
  linkTo: string | null;
  isExternal: boolean | null;
}

export interface CMSStaticInfo {
  title: string;
  slug: string;
  pageType: string | null;
  body: string | null;
}

export interface CMSMerch {
  _id: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: string;
  price: number | null;
  image: CMSImage;
  body: string | null;
}

export interface CMSMeetingMinute {
  _id: string;
  isAllMeeting: boolean | null;
  date: string | null;
  title: string | null;
  document: string | null;
}

export interface CMSMovie {
  _id: string;
  title: string;
  date: string;
  link: string | null;
  image: CMSImage;
}

export interface CMSHSApplicationProfile {
  _id: string;
  name: string;
  picture: CMSImage | null;
}

export interface CMSHSApplication {
  profile: CMSHSApplicationProfile;
  poster: string;
}

class SanityHappeningsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSHappening>>("GET", "sanity/happenings");
  }

  async home(params?: { types?: Array<string>; n?: number }) {
    const query = new URLSearchParams();
    if (params?.types) {
      for (const t of params.types) {
        query.append("types[]", t);
      }
    }
    if (params?.n !== undefined) {
      query.set("n", String(params.n));
    }
    const qs = query.toString();
    return await this.client.requestJson<Array<CMSHomeHappening>>(
      "GET",
      `sanity/happenings/home${qs ? `?${qs}` : ""}`,
    );
  }

  async bySlug(slug: string) {
    return await this.client.requestJson<CMSHappening>("GET", `sanity/happenings/${slug}`);
  }

  async contacts(slug: string) {
    return await this.client.requestJson<Array<CMSContact>>(
      "GET",
      `sanity/happenings/${slug}/contacts`,
    );
  }

  async repeating() {
    return await this.client.requestJson<Array<CMSRepeatingHappening>>(
      "GET",
      "sanity/repeating-happenings",
    );
  }
}

class SanityPostsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSPost>>("GET", "sanity/posts");
  }
}

class SanityStudentGroupsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all(params?: { type?: string; n?: number }) {
    const query = new URLSearchParams();
    if (params?.type !== undefined) {
      query.set("type", params.type);
    }
    if (params?.n !== undefined) {
      query.set("n", String(params.n));
    }
    const qs = query.toString();
    return await this.client.requestJson<Array<CMSStudentGroup>>(
      "GET",
      `sanity/student-groups${qs ? `?${qs}` : ""}`,
    );
  }

  async bySlug(slug: string) {
    return await this.client.requestJson<CMSStudentGroup>("GET", `sanity/student-groups/${slug}`);
  }
}

class SanityJobAdsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSJobAd>>("GET", "sanity/job-ads");
  }
}

class SanityStaticInfoApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSStaticInfo>>("GET", "sanity/static-info");
  }
}

class SanityMerchApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSMerch>>("GET", "sanity/merch");
  }
}

class SanityMinutesApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSMeetingMinute>>("GET", "sanity/minutes");
  }
}

class SanityMoviesApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSMovie>>("GET", "sanity/movies");
  }
}

class SanityHSApplicationsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<CMSHSApplication>>("GET", "sanity/hs-applications");
  }
}

export class SanityApi {
  happenings: SanityHappeningsApi;
  posts: SanityPostsApi;
  studentGroups: SanityStudentGroupsApi;
  jobAds: SanityJobAdsApi;
  staticInfo: SanityStaticInfoApi;
  merch: SanityMerchApi;
  minutes: SanityMinutesApi;
  movies: SanityMoviesApi;
  hsApplications: SanityHSApplicationsApi;

  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
    this.happenings = new SanityHappeningsApi(client);
    this.posts = new SanityPostsApi(client);
    this.studentGroups = new SanityStudentGroupsApi(client);
    this.jobAds = new SanityJobAdsApi(client);
    this.staticInfo = new SanityStaticInfoApi(client);
    this.merch = new SanityMerchApi(client);
    this.minutes = new SanityMinutesApi(client);
    this.movies = new SanityMoviesApi(client);
    this.hsApplications = new SanityHSApplicationsApi(client);
  }

  async banner() {
    return await this.client.requestJson<CMSBanner | null>("GET", "sanity/banner");
  }
}

type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | (string & {});

export class UnoClient {
  private api: KyInstance;

  comments: CommentsApi;
  happenings: HappeningApi;
  accessRequests: AccessRequestApi;
  degrees: DegreesApi;
  shopping: ShoppingApi;
  siteFeedbacks: SiteFeedbackApi;
  whitelist: WhitelistApi;
  strikes: StrikesApi;
  adventOfCode: AdventOfCodeApi;
  groups: GroupsApi;
  reactions: ReactionsApi;
  users: UsersApi;
  files: FilesApi;
  quotes: QuotesApi;
  sanity: SanityApi;

  constructor(options: UnoClientOptions) {
    this.api = ky.create({
      prefixUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      credentials: "include",
      cache: "no-store",
      headers: {
        ...(options.adminToken ? { "X-Admin-Key": options.adminToken } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      parseJson: (text) => JSON.parse(text, dateReviver),
      throwHttpErrors: false,
    });

    this.comments = new CommentsApi(this);
    this.happenings = new HappeningApi(this);
    this.accessRequests = new AccessRequestApi(this);
    this.degrees = new DegreesApi(this);
    this.shopping = new ShoppingApi(this);
    this.siteFeedbacks = new SiteFeedbackApi(this);
    this.whitelist = new WhitelistApi(this);
    this.strikes = new StrikesApi(this);
    this.adventOfCode = new AdventOfCodeApi(this);
    this.groups = new GroupsApi(this);
    this.reactions = new ReactionsApi(this);
    this.users = new UsersApi(this);
    this.files = new FilesApi(this);
    this.quotes = new QuotesApi(this);
    this.sanity = new SanityApi(this);
  }

  normalizePath(path: string) {
    return path.startsWith("/") ? path.slice(1) : path;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestJson<T>(method: HttpMethod, path: string, body?: any): Promise<T> {
    return await this.api(this.normalizePath(path), {
      method,
      json: body,
    }).json<T>();
  }

  async requestFormData(method: HttpMethod, path: string, formData: FormData) {
    return await this.api(this.normalizePath(path), {
      method,
      body: formData,
    });
  }

  async request(method: HttpMethod, path: string, options?: Options) {
    return await this.api(this.normalizePath(path), {
      method,
      ...options,
    });
  }

  async health() {
    return await this.api("").json<{ status: string }>();
  }
}

export interface CommentAuthor {
  id: string;
  name: string;
  hasImage: boolean;
}

export interface CommentReaction {
  commentId: string;
  userId: string;
  type: "like";
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  parentCommentId: string | null;
  updatedAt: Date;
  createdAt: Date;
  userId: string | null;
  content: string;
}

export interface CommentWithReactions extends Comment {
  user: CommentAuthor;
  reactions: Array<CommentReaction>;
}

class CommentsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all(postId: string) {
    return await this.client.requestJson<Array<CommentWithReactions>>("GET", `/comments/${postId}`);
  }

  async comment(postId: string, userId: string, content: string) {
    await this.client.requestJson("POST", "/comments", {
      postId,
      userId,
      content,
    });
  }

  async reply(postId: string, userId: string, content: string, parentCommentId: string) {
    await this.client.requestJson("POST", "/comments", {
      postId,
      userId,
      content,
      parentCommentId,
    });
  }

  async like(commentId: string, userId: string) {
    await this.client.requestJson("POST", `/comments/${commentId}/reaction`, {
      commentId,
      userId,
    });
  }
}

export interface Answer {
  questionId: string;
  answer?: string | Array<string> | undefined;
}

export type QuestionType = "text" | "textarea" | "radio" | "checkbox";

export interface Option {
  id: string;
  value: string;
}

export interface Question {
  options: Array<Option> | null;
  id: string;
  title: string;
  required: boolean;
  type: QuestionType;
  isSensitive: boolean;
  happeningId: string;
}

export type RegistrationStatus = "registered" | "unregistered" | "removed" | "waiting" | "pending";

export interface Registration {
  userId: string;
  userName: string | null;
  userHasImage: boolean;
  happeningId: string;
  changedAt: Date | null;
  changedBy: string | null;
  createdAt: Date;
  prevStatus: string;
  status: RegistrationStatus;
  unregisterReason: string | null;
}

export interface RegistrationCount {
  happeningId: string;
  waiting: number;
  registered: number;
  max: number | null;
}

export interface SpotRange {
  id: string;
  happeningId: string;
  spots: number;
  minYear: number;
  maxYear: number;
}

class HappeningApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async register(happeningId: string, userId: string, questions: Array<Answer>) {
    return await this.client.requestJson<{ success: boolean; message: string }>(
      "POST",
      `happenings/${happeningId}/register`,
      {
        userId,
        questions,
      },
    );
  }

  async questions(happeningId: string) {
    return await this.client.requestJson<Array<Question>>(
      "GET",
      `happenings/${happeningId}/questions`,
    );
  }

  async registrations(happeningId: string) {
    return await this.client.requestJson<Array<Registration>>(
      "GET",
      `happenings/${happeningId}/registrations`,
    );
  }

  async registrationCount(happeningIds: Array<string>) {
    if (happeningIds.length === 0) {
      return [];
    }

    const query = happeningIds.map((id) => `id=${id}`).join("&");

    return await this.client.requestJson<Array<RegistrationCount>>(
      "GET",
      `happenings/registrations/count?${query}`,
    );
  }

  async spotRanges(happeningId: string) {
    return await this.client.requestJson<Array<SpotRange>>(
      "GET",
      `happenings/${happeningId}/spot-ranges`,
    );
  }

  async full(slug: string) {
    try {
      return await this.client.requestJson<FullHappening>("GET", `happenings/${slug}/full`);
    } catch {
      return null;
    }
  }
}

export interface AccessRequest {
  id: string;
  email: string;
  reason: string;
  createdAt: Date;
}

class AccessRequestApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<AccessRequest>>("GET", "/access-requests");
  }
}

export interface Degree {
  id: string;
  name: string;
}

export interface DegreeInsert {
  id?: string;
  name: string;
}

class DegreesApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<{ id: string; name: string }>>("GET", "/degrees");
  }

  async create(newDegree: DegreeInsert) {
    await this.client.requestJson("POST", "/degrees", newDegree);
  }

  async delete(id: string) {
    await this.client.requestJson("DELETE", `/degrees/${id}`);
  }

  async update(updatedDegree: Degree) {
    await this.client.requestJson("POST", `/degrees/${updatedDegree.id}`, updatedDegree);
  }
}

export interface ShoppingListItem {
  createdAt: Date;
  id: string;
  likes: Array<string>;
  name: string;
  userId: string;
  userName: string | null;
}

class ShoppingApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async items() {
    return await this.client.requestJson<Array<ShoppingListItem>>("GET", "shopping");
  }

  async createItem(item: { name: string; userId: string }) {
    await this.client.requestJson("POST", "shopping", item);
  }

  async toggleLike(data: { itemId: string; userId: string }) {
    await this.client.requestJson("POST", "shopping/like", data);
  }

  async removeItem(id: string) {
    await this.client.requestJson("DELETE", `shopping/${id}`);
  }
}

export type SiteFeedbackCategory = "bug" | "feature" | "login" | "other";

export interface SiteFeedback {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  category: SiteFeedbackCategory;
  isRead: boolean;
  createdAt: Date;
}

export interface SiteFeedbackInsert {
  name?: string | null;
  email?: string | null;
  message: string;
  category: SiteFeedbackCategory;
}

class SiteFeedbackApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<SiteFeedback>>("GET", "feedbacks");
  }

  async getById(id: string) {
    return await this.client.requestJson<SiteFeedback>("GET", `feedbacks/${id}`);
  }

  async create(feedback: SiteFeedbackInsert) {
    return await this.client.requestJson("POST", "feedbacks", feedback);
  }

  async markAsSeen(id: string) {
    return await this.client.requestJson("PUT", `feedbacks/${id}/seen`);
  }
}

export interface WhitelistEntry {
  email: string;
  expiresAt: Date;
  reason: string;
}

class WhitelistApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<WhitelistEntry>>("GET", "whitelist");
  }

  async getByEmail(email: string) {
    try {
      return await this.client.requestJson<WhitelistEntry | null>("GET", `whitelist/${email}`);
    } catch {
      return null;
    }
  }
}
class StrikesApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async listBanned() {
    return await this.client.requestJson<
      Array<{
        id: string;
        name: string | null;
        hasImage: boolean;
        banInfo: {
          id: number;
          reason: string;
          createdAt: Date;
          userId: string;
          bannedBy: string;
          expiresAt: Date;
          bannedByUser: {
            name: string | null;
          };
        };
        dots: Array<{
          id: number;
          reason: string;
          createdAt: Date;
          userId: string;
          expiresAt: Date;
          count: number;
          strikedBy: string;
          strikedByUser: {
            name: string;
          };
        }>;
      }>
    >("GET", "strikes/users/banned");
  }

  async listStriked() {
    return await this.client.requestJson<
      Array<{
        id: string;
        name: string;
        hasImage: boolean;
        isBanned: boolean;
        strikes: number;
      }>
    >("GET", "strikes/users");
  }
}

export interface AdventOfCodeDay {
  stars: 0 | 1 | 2;
  star1Ts?: number;
  star2Ts?: number;
}

export interface AdventOfCodeRow {
  id: number;
  name: string;
  localScore: number;
  days: Record<string, AdventOfCodeDay>;
}

class AdventOfCodeApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async leaderboard() {
    return await this.client.requestJson<Array<AdventOfCodeRow>>(
      "GET",
      `advent-of-code/leaderboard`,
    );
  }
}

interface Group {
  id: string;
  name: string;
}

interface GroupInsert {
  id: string | null;
  name: string;
}

interface GroupMember {
  id: string;
  name: string;
  isLeader: boolean;
}

class GroupsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async remove(id: string) {
    try {
      await this.client.requestJson("DELETE", `groups/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async create(group: GroupInsert) {
    return await this.client.requestJson<Group>("POST", "groups", group);
  }

  async update(group: Group) {
    return await this.client.requestJson<Group>("POST", `groups/${group.id}`, group);
  }

  async all() {
    return await this.client.requestJson<Array<Group>>("GET", "groups");
  }

  async members(groupId: string) {
    return await this.client.requestJson<Array<GroupMember>>("GET", `groups/${groupId}/members`);
  }
}

export interface Reaction {
  createdAt: Date;
  userId: string;
  reactToKey: string;
  emojiId: number;
}

export interface ReactionInsert {
  userId: string;
  emojiId: number;
}

class ReactionsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async byId(key: string) {
    return await this.client.requestJson<Array<Reaction>>("GET", `reactions/${key}`);
  }

  async toggle(key: string, reaction: ReactionInsert) {
    return await this.client.requestJson<Array<Reaction>>("POST", `reactions/${key}`, reaction);
  }
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  hasImage: boolean;
  alternativeEmail: string | null;
  degree: {
    id: string;
    name: string;
  } | null;
  year: number | null;
  type: string;
  lastSignInAt: Date | null;
  updatedAt: Date | null;
  createdAt: Date | null;
  hasReadTerms: boolean;
  birthday: Date | null;
  isPublic: boolean;
  groups: Array<{
    id: string;
    isLeader: boolean;
    name: string;
  }>;
}

export interface Happening {
  date: Date | null;
  id: string;
  type: "bedpres" | "event" | "external";
  slug: string;
  title: string;
  registrationGroups: Array<string> | null;
  registrationStartGroups: Date | null;
  registrationStart: Date | null;
  registrationEnd: Date | null;
}

export interface RegistrationAnswer {
  questionId: string;
  answer: string | Array<string> | null;
}

export interface FullHappeningRegistration extends Registration {
  userEmail: string | null;
  userYear: number | null;
  userDegreeId: string | null;
  answers: Array<RegistrationAnswer>;
}

export interface FullHappening extends Happening {
  registrations: Array<FullHappeningRegistration>;
  questions: Array<Question>;
  groups: Array<string>;
}

export interface UserRegistration {
  userId: string;
  happeningId: string;
  status: RegistrationStatus;
  createdAt: Date;
  happening: Happening;
}

class UsersApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async getById(id: string) {
    return await this.client.requestJson<User>("GET", `users/${id}`);
  }

  async all() {
    return await this.client.requestJson<Array<User>>("GET", "users");
  }

  async search(name: string) {
    if (name.length < 3) return [];
    const query = encodeURIComponent(name);
    return await this.client.requestJson<Array<{ id: string; name: string }>>(
      "GET",
      `users/search?q=${query}`,
    );
  }

  async registrationsByUserId(userId: string) {
    return await this.client.requestJson<Array<UserRegistration>>(
      "GET",
      `users/${userId}/registrations`,
    );
  }
}

class FilesApi {
  profilePictures: ProfilePicturesApi;

  constructor(client: UnoClient) {
    this.profilePictures = new ProfilePicturesApi(client);
  }
}

class ProfilePicturesApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async upload(userId: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await this.client.requestFormData("POST", `users/${userId}/image`, formData);
    const ok = response.status === 200;
    if (!ok) {
      const text = await response.text();
      return { ok: false as const, message: text };
    }
    return { ok: true as const };
  }

  async delete(userId: string) {
    const response = await this.client.request("DELETE", `users/${userId}/image`);
    return response.status === 200;
  }
}

export interface QuoteReaction {
  user_id: string;
  reaction_type: "like" | "dislike";
}

export interface Quote {
  id: string;
  text: string;
  person: string;
  context: string | null;
  reactions: Array<QuoteReaction>;
}

class QuotesApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async all() {
    return await this.client.requestJson<Array<Quote>>("GET", "quotes");
  }

  async create(quote: { text: string; person: string; context?: string | null }) {
    const response = await this.client.request("POST", "quotes", {
      body: JSON.stringify(quote),
    });
    return {
      ok: response.status === 200,
      quote: response.status === 200 ? await response.json<Quote>() : null,
    };
  }

  async delete(id: string) {
    const response = await this.client.request("DELETE", `quotes/${id}`);
    return response.status === 200;
  }

  async toggleLike(id: string) {
    const response = await this.client.request("POST", `quotes/${id}/like`);
    return response.status === 200;
  }

  async toggleDislike(id: string) {
    const response = await this.client.request("POST", `quotes/${id}/dislike`);
    return response.status === 200;
  }
}
