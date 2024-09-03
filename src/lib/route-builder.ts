type Route = {
  href: string;
  label: string;
  session?: boolean;
  isExternal?: boolean;
};

export class RouteGroup {
  private basePath: string;
  private options: { label: string };

  private links: Array<Route> = [];

  constructor(basePath: string | null, options: { label: string }) {
    this.basePath = basePath ?? "";
    this.options = options;
  }

  link(
    path: string,
    options: { label?: string; session?: boolean; isExternal?: boolean } = {},
  ): RouteGroup {
    const route: Route = {
      href: `${this.basePath}${path}`,
      label: options.label ?? "",
      session: options.session ?? false,
      isExternal: options.isExternal ?? false,
    };

    this.links.push(route);
    return this; // Return the instance to allow method chaining
  }

  build() {
    return {
      label: this.options.label,
      sublinks: this.links,
    };
  }
}
