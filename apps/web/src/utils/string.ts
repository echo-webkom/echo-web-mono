/**
 * Capitalizes the first letter of a string.
 *
 * @example
 * ```ts
 * capitalize("hello"); // "Hello"
 * ```
 *
 * @param str some string
 * @returns the string with the first letter capitalized
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a value to a string.
 *
 * If the value is `null` or `undefined`, an empty string is returned.
 *
 * @example
 * ```ts
 * stringify(null); // ""
 * stringify(42); // "42"
 * ```
 *
 * @param value some value
 * @returns the string representation of the value
 */
export function stringify(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value);
}

/**
 * Slugifies a string.
 *
 * @example
 * ```ts
 * slugify("Hello, World!"); // "hello-world"
 * ```
 *
 * @param str the string to slugify
 * @returns the slugified string
 */
export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Gets the initials of a string.
 *
 * If the string is empty, an empty string is returned.
 * If the string has one word, the first two characters are returned.
 * If the string has two words, the first character of each word is returned.
 * If the string has more than two words, the first character of the first two words is returned.
 *
 * @example
 * ```ts
 * initials("John Doe"); // "JD"
 * initials("John"); // "JO"
 * ```
 *
 * @param name the string to get the initials of
 * @returns the initials of the string
 */
export function initials(name: string): string {
  const words = name
    .split("")
    .filter((char) => char.charCodeAt(0) < 128)
    .join("")
    .split(" ")
    .filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    return words[0]!.slice(0, 2).toUpperCase();
  }

  const [first, second] = words;

  return `${first![0]}${second![0]}`.toUpperCase();
}
