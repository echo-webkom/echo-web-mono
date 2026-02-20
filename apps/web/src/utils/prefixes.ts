/**
 * Prefixes an email with the `mailto:` protocol for use in an anchor tag.
 *
 * @example
 * ```ts
 * mailTo('bo.salhus@echo.uib.no'); // 'mailto:bo.salhus@echo.uib.no'
 * ```
 *
 * @param email The email address to prefix.
 * @returns The email prefixed with the `mailto:` protocol.
 */
export const mailTo = (email: string) => {
  return `mailto:${email}`;
};
