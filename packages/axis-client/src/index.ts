import { createClient, type SanityClient } from "@sanity/client";
import {
  allMeetingMinuteQuery,
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
} from "@echo-webkom/cms/types";
import type { PageType } from "@echo-webkom/lib";
import ky, { type KyInstance } from "ky";

export type AxisClientOptions = {
  axisUrl: string;
  sanity: {
    projectId: string;
    dataset: string;
  };
  debug?: boolean;
};

export class AxisClient {
  #sanity: SanityClient;
  #axis: KyInstance;
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

    this.log("AxisClient initialized");
  }

  private log(message: string) {
    if (this.#debug) {
      console.log(message);
    }
  }

  sanity = () => {
    return this.#sanity;
  };

  /**
   * Fetches the shopping list items from the database.
   *
   * @returns
   */
  fetchShoppingListItems = async () => {
    return await this.#axis.get("shopping-list").json<
      Array<{
        id: string;
        name: string;
        userId: string;
        userName: string;
      }>
    >();
  };

  /**
   * Adds a shopping list item to the database.
   *
   * @param userId
   * @param name
   * @returns
   */
  addShoppingListItem = async (userId: string, name: string) => {
    return await this.#axis
      .post("shopping-list", {
        json: {
          name,
          userId,
        },
      })
      .json<{
        id: string;
      }>();
  };

  /**
   * Fetches the next upcoming events from sanity
   *
   * @returns
   */
  fetchUpcomingEvents = async () => {
    return await this.#sanity.fetch<HomeHappeningsQueryResult>(
      homeHappeningsQuery,
      {
        happeningTypes: ["event", "external"],
        n: 5,
      }
    );
  };

  /**
   * Fetches the next upcoming bedpres from sanity
   *
   * @returns
   */
  fetchUpcomingBedpres = async () => {
    return await this.#sanity.fetch<HomeHappeningsQueryResult>(
      homeHappeningsQuery,
      {
        happeningTypes: ["bedpres"],
        n: 5,
      }
    );
  };

  /**
   * Fetches a static page from sanity based on the page type and slug
   *
   * @param pageType
   * @param slug
   * @returns
   */
  fetchStaticPage = async (pageType: PageType, slug: string) => {
    const data =
      await this.#sanity.fetch<StaticInfoQueryResult>(staticInfoQuery);
    return data.find(
      (page) => page.pageType === pageType && page.slug === slug
    );
  };

  /**
   * Fetches the available job ads from sanity
   *
   * @returns
   */
  fetchJobs = async () => {
    return await this.#sanity.fetch<JobAdsQueryResult>(jobAdsQuery);
  };

  /**
   * Fetches all the posts from sanity
   *
   * @returns
   */
  fetchPosts = async () => {
    return await this.#sanity.fetch<AllPostsQueryResult>(allPostsQuery);
  };

  /**
   * Fetches all the groups based on the type from sanity
   *
   * @param type
   * @returns
   */
  fetchGroupsByType = async (type: string) => {
    return await this.#sanity
      .fetch<StudentGroupsByTypeQueryResult>(studentGroupsByTypeQuery, {
        type,
        n: -1,
      })
      .then((groups) => {
        return groups.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      });
  };

  /**
   * Fetches the group by slug from sanity
   *
   * @param slug
   * @returns
   */
  fetchGroupBySlug = async (slug: string) => {
    return await this.#sanity.fetch<StudentGroupBySlugQueryResult>(
      studentGroupBySlugQuery,
      {
        slug,
      }
    );
  };

  /**
   * Fetches all the meeting minutes from sanity
   *
   * @returns
   */
  fetchMinutes = async () => {
    return await this.#sanity.fetch<AllMeetingMinuteQueryResult>(
      allMeetingMinuteQuery
    );
  };
}
