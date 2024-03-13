const baseURL =
  process.env.NODE_ENV === "production" ? "https://echo.uib.no" : "http://localhost:3000";

export const INCLUDE_PAST_PARAM = "includePast";
export const HAPPENING_TYPE_PARAM = "happeningType";
export const INCLUDE_MOVIES_PARAM = "includeMovies";

export class CalendarUrlBuilder {
  includePast = false;
  happeningType: Array<string> = [];
  includeMovies = false;

  setIncludePast(includePast: boolean) {
    this.includePast = includePast;
    return this;
  }

  setHappeningType(happeningType: Array<string>) {
    this.happeningType = happeningType;
    return this;
  }

  setIncludeMovies(includeMovies: boolean) {
    this.includeMovies = includeMovies;
    return this;
  }

  build() {
    const url = new URL(baseURL);
    url.pathname = "/api/calendar";

    if (this.includePast) {
      url.searchParams.set(INCLUDE_PAST_PARAM, "true");
    } else {
      url.searchParams.delete(INCLUDE_PAST_PARAM);
    }

    for (const type of this.happeningType) {
      url.searchParams.append(HAPPENING_TYPE_PARAM, type);
    }

    if (this.includeMovies) {
      url.searchParams.set(INCLUDE_MOVIES_PARAM, "true");
    } else {
      url.searchParams.delete(INCLUDE_MOVIES_PARAM);
    }

    return url.toString();
  }
}
