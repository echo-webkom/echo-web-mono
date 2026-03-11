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

export interface Group {
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
