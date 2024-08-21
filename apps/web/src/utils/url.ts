/**
 * Given a URL, convert it to a relative path
 *
 * @example
 * ```ts
 * const url = new URL('https://example.com/path/to/resource?query=string#hash');
 * const relativePath = toRelative(url);
 * console.log(relativePath); // /path/to/resource?query=string#hash
 * ```
 *
 * @param url the url to convert to a relative path
 * @returns the relative path
 */
export const toRelative = (url: URL) => {
  return url.pathname + url.search + url.hash;
};
