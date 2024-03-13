const base =
  process.env.NODE_ENV === "production" ? "https://echo.uib.no" : "http://localhost:3000";

export const INCLUDE_PAST_PARAM = "includePast";
export const HAPPENING_TYPE_PARAM = "happeningType";
export const INCLUDE_MOVIES_PARAM = "includeMovies";
export const INCLUDE_BEDPRES_REGISTRATION_PARAM = "includeBedpresRegistration";

export class CalendarUrlBuilder {
  baseURL = base;
  includePast = false;
  happeningType: Array<string> = [];
  includeMovies = false;
  includeBedpresRegistration = false;

  constructor(baseURL: string = base) {
    if (baseURL) {
      this.baseURL = baseURL;
    }
  }

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

  setIncludeBedpresRegistration(includeBedpresRegistration: boolean) {
    this.includeBedpresRegistration = includeBedpresRegistration;
    return this;
  }

  build() {
    const url = new URL(this.baseURL);
    url.pathname = "/api/calendar";

    for (const type of this.happeningType) {
      url.searchParams.append(HAPPENING_TYPE_PARAM, type);
    }

    this.toggleParam(url, INCLUDE_PAST_PARAM, this.includePast);
    this.toggleParam(url, INCLUDE_MOVIES_PARAM, this.includeMovies);
    this.toggleParam(url, INCLUDE_BEDPRES_REGISTRATION_PARAM, this.includeBedpresRegistration);

    return url.toString();
  }

  private toggleParam(url: URL, param: string, value: boolean) {
    if (value) {
      url.searchParams.set(param, "true");
    } else {
      url.searchParams.delete(param);
    }
  }
}
