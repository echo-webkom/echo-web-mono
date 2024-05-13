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
export function mailTo(email: string) {
  return `mailto:${email}`;
}

/**
 * Prefixds a phone number with the `tel:` protocol for use in an anchor tag.
 *
 * @example
 * ```ts
 * telTo('12345678'); // 'tel:12345678'
 * ```
 *
 * @param phone The phone number to prefix.
 * @returns The phone number prefixed with the `tel:` protocol.
 */
export function telTo(phone: string) {
  return `tel:${phone}`;
}
