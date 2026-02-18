import ky, { type KyInstance } from "ky";

const DEFAULT_BASE_URL = "https://uno.echo-webkom.no";

export type UnoClientOptions = {
  baseUrl?: string;
  adminToken?: string;
  token?: string;
};

// Convert fields that end with "At" to Date
function dateReviver(key: string, value: unknown): unknown {
  if (key.endsWith("At") && typeof value === "string") {
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

  constructor(options: UnoClientOptions) {
    this.api = ky.create({
      prefixUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      credentials: "include",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async request<T>(method: HttpMethod, path: string, body?: any): Promise<T> {
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

    return await this.api(normalizedPath, {
      method,
      json: body,
    }).json<T>();
  }

  async health() {
    return await this.api("").json<{ status: string }>();
  }
}

export interface CommentAuthor {
  id: string;
  name: string;
  image: string;
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
    return await this.client.request<Array<CommentWithReactions>>("GET", `/comments/${postId}`);
  }

  async comment(postId: string, userId: string, content: string) {
    await this.client.request("POST", "/comments", {
      postId,
      userId,
      content,
    });
  }

  async reply(postId: string, userId: string, content: string, parentCommentId: string) {
    await this.client.request("POST", "/comments", {
      postId,
      userId,
      content,
      parentCommentId,
    });
  }

  async like(commentId: string, userId: string) {
    await this.client.request("POST", `/comments/${commentId}/reaction`, {
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
  userImage: string | null;
  happeningId: string;
  changedAt: Date;
  changedBy: Date;
  createdAt: Date;
  prevStatus: string;
  status: RegistrationStatus;
  unregisterReason: string;
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
    return await this.client.request<{ success: boolean; message: string }>(
      "POST",
      `happenings/${happeningId}/register`,
      {
        userId,
        questions,
      },
    );
  }

  async questions(happeningId: string) {
    return await this.client.request<Array<Question>>("GET", `happenings/${happeningId}/questions`);
  }

  async registrations(happeningId: string) {
    return await this.client.request<Array<Registration>>(
      "GET",
      `happenings/${happeningId}/registrations`,
    );
  }

  async registrationCount(happeningIds: Array<string>) {
    if (happeningIds.length === 0) {
      return [];
    }

    const query = happeningIds.map((id) => `id=${id}`).join("&");

    return await this.client.request<Array<RegistrationCount>>(
      "GET",
      `happenings/registrations/count?${query}`,
    );
  }

  async spotRanges(happeningId: string) {
    return await this.client.request<Array<SpotRange>>(
      "GET",
      `happenings/${happeningId}/spot-ranges`,
    );
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
    return await this.client.request<Array<AccessRequest>>("GET", "/access-requests");
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
    return await this.client.request<Array<{ id: string; name: string }>>("GET", "/degrees");
  }

  async create(newDegree: DegreeInsert) {
    await this.client.request("POST", "/degrees", newDegree);
  }

  async delete(id: string) {
    await this.client.request("DELETE", `/degrees/${id}`);
  }

  async update(updatedDegree: Degree) {
    await this.client.request("POST", `/degrees/${updatedDegree.id}`, updatedDegree);
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
    return await this.client.request<Array<ShoppingListItem>>("GET", "shopping");
  }

  async createItem(item: { name: string; userId: string }) {
    await this.client.request("POST", "shopping", item);
  }

  async toggleLike(data: { itemId: string; userId: string }) {
    await this.client.request("POST", "shopping/like", data);
  }

  async removeItem(id: string) {
    await this.client.request("DELETE", `shopping/${id}`);
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
    return await this.client.request<Array<SiteFeedback>>("GET", "feedbacks");
  }

  async getById(id: string) {
    return await this.client.request<SiteFeedback>("GET", `feedbacks/${id}`);
  }

  async create(feedback: SiteFeedbackInsert) {
    return await this.client.request("POST", "feedbacks", feedback);
  }

  async markAsSeen(id: string) {
    return await this.client.request("PUT", `feedbacks/${id}/seen`);
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
    return await this.client.request<Array<WhitelistEntry>>("GET", "whitelist");
  }

  async getByEmail(email: string) {
    try {
      return await this.client.request<WhitelistEntry | null>("GET", `whitelist/${email}`);
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
    return await this.client.request<
      Array<{
        id: string;
        name: string | null;
        image: string | null;
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
    return await this.client.request<
      Array<{
        id: string;
        name: string;
        imageUrl: string | null;
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
    return await this.client.request<Array<AdventOfCodeRow>>("GET", `advent-of-code/leaderboard`);
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

class GroupsApi {
  private client: UnoClient;

  constructor(client: UnoClient) {
    this.client = client;
  }

  async remove(id: string) {
    try {
      await this.client.request("DELETE", `groups/${id}`);
      return true;
    } catch {
      return false;
    }
  }

  async create(group: GroupInsert) {
    return await this.client.request<Group>("POST", "groups", group);
  }

  async update(group: Group) {
    return await this.client.request<Group>("POST", `groups/${group.id}`, group);
  }
}
