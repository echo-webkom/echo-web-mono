import { createClient, type SanityClient } from "@sanity/client";
import {
  allHappeningsQuery,
  allMeetingMinuteQuery,
  allMerchQuery,
  allPostsQuery,
  happeningQuery,
  homeHappeningsQuery,
  jobAdsQuery,
  moviesQuery,
  staticInfoQuery,
  studentGroupBySlugQuery,
  studentGroupsByTypeQuery,
} from "@echo-webkom/sanity/queries";
import {
  type StudentGroupBySlugQueryResult,
  type AllPostsQueryResult,
  type HomeHappeningsQueryResult,
  type JobAdsQueryResult,
  type StaticInfoQueryResult,
  type StudentGroupsByTypeQueryResult,
  type AllMeetingMinuteQueryResult,
  type AllMerchQueryResult,
  AllHappeningsQueryResult,
  HappeningQueryResult,
  MoviesQueryResult,
} from "@echo-webkom/cms/types";
import type { PageType } from "@echo-webkom/lib";
import ky, { type KyInstance } from "ky";

export type AxisClientOptions = {
  axisUrl: string;
  sanity: {
    projectId: string;
    dataset: string;
  };
  apiToken: string;
  debug?: boolean;
};

export class AxisClient {
  #sanity: SanityClient;
  #axis: KyInstance;
  #apiToken: string | undefined;
  #debug: boolean = false;

  constructor(options: AxisClientOptions) {
    this.#sanity = createClient({
      ...options.sanity,
      apiVersion: "2023-10-01",
      useCdn: true,
    });
    this.#apiToken = options.apiToken;
    this.#axis = ky.extend({
      prefixUrl: options.axisUrl,
      headers: {
        Authorization: `Bearer ${this.#apiToken}`,
      },
    });

    this.#debug = options.debug ?? false;
    this.log("AxisClient initialized");
  }

  private log(message: string) {
    if (this.#debug) {
      console.log(message);
    }
  }

  readonly shoppingList = {
    list: async (): Promise<
      Array<{ id: string; name: string; userId: string; userName: string }>
    > => {
      return await this.#axis.get("shopping-list").json();
    },

    add: async (userId: string, name: string) => {
      return await this.#axis
        .post("shopping-list", { json: { name, userId } })
        .json<{ id: string }>();
    },
  };

  readonly content = {
    posts: {
      list: async (): Promise<AllPostsQueryResult> => {
        return await this.#sanity.fetch(allPostsQuery);
      },
    },

    jobs: {
      list: async (): Promise<JobAdsQueryResult> => {
        return await this.#sanity.fetch(jobAdsQuery);
      },
    },

    merch: {
      list: async (): Promise<AllMerchQueryResult> => {
        return await this.#sanity.fetch(allMerchQuery);
      },
    },

    movies: {
      list: async () => {
        return await this.#sanity.fetch<MoviesQueryResult>(moviesQuery);
      },
    },

    staticPage: async (pageType: PageType, slug: string) => {
      const data =
        await this.#sanity.fetch<StaticInfoQueryResult>(staticInfoQuery);
      return data.find(
        (page) => page.pageType === pageType && page.slug === slug
      );
    },

    minutes: {
      list: async (): Promise<AllMeetingMinuteQueryResult> => {
        return await this.#sanity.fetch(allMeetingMinuteQuery);
      },
    },
  };

  readonly events = {
    list: async () => {
      return await this.#sanity.fetch<AllHappeningsQueryResult>(
        allHappeningsQuery
      );
    },

    getBySlug: async (slug: string) => {
      return await this.#sanity.fetch<HappeningQueryResult>(happeningQuery, {
        slug,
      });
    },

    upcoming: async (types: Array<string>, n: number) => {
      return await this.#sanity.fetch<HomeHappeningsQueryResult>(
        homeHappeningsQuery,
        { happeningTypes: types, n }
      );
    },
  };

  readonly groups = {
    byType: async (type: string) => {
      const result = await this.#sanity.fetch<StudentGroupsByTypeQueryResult>(
        studentGroupsByTypeQuery,
        { type, n: -1 }
      );
      return result.sort((a, b) => a.name.localeCompare(b.name));
    },

    bySlug: async (slug: string) => {
      return await this.#sanity.fetch<StudentGroupBySlugQueryResult>(
        studentGroupBySlugQuery,
        { slug }
      );
    },
  };

  readonly feedback = {
    create: async ({
      name,
      email,
      message,
    }: {
      name?: string;
      email?: string;
      message: string;
    }) => {
      return await this.#axis
        .post("feedback", {
          json: {
            name: name ?? null,
            email: email ?? null,
            message,
          },
        })
        .then((response) => response.status === 201);
    },
  };

  readonly whitelist = {
    list: async () => {
      return await this.#axis.get("whitelist").json<{
        email: string;
        expiresAt: string;
        reason: string;
      }>();
    },

    getByEmail: async (email: string) => {
      const response = await this.#axis.get(`whitelist/${email}`);

      if (response.status === 404) {
        return null;
      }

      return await response.json<{
        email: string;
        expiresAt: string;
        reason: string;
      }>();
    },
  };

  // Use the sanity client directly for more complex queries
  readonly sanity = () => this.#sanity;
}
