import { createClient, type SanityClient } from "@sanity/client";
import {
  allMeetingMinuteQuery,
  allMerchQuery,
  allPostsQuery,
  homeHappeningsQuery,
  jobAdsQuery,
  staticInfoQuery,
  studentGroupBySlugQuery,
  studentGroupsByTypeQuery,
} from "@echo-webkom/sanity/queries";
import type {
  StudentGroupBySlugQueryResult,
  AllPostsQueryResult,
  HomeHappeningsQueryResult,
  JobAdsQueryResult,
  StaticInfoQueryResult,
  StudentGroupsByTypeQueryResult,
  AllMeetingMinuteQueryResult,
  AllMerchQueryResult,
} from "@echo-webkom/cms/types";
import type { PageType } from "@echo-webkom/lib";
import ky, { type KyInstance } from "ky";

export type AxisClientOptions = {
  axisUrl: string;
  sanity: {
    projectId: string;
    dataset: string;
  };
  apiToken?: string;
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

    this.#axis = ky.extend({
      prefixUrl: options.axisUrl,
    });

    this.#debug = options.debug ?? false;
    this.#apiToken = options.apiToken;
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

  // Use the sanity client directly for more complex queries
  readonly sanity = () => this.#sanity;
}
