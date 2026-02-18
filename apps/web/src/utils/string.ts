import z from "zod";

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
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

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
export const stringify = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
};

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
export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

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
export const initials = (name: string): string => {
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
};

/**
 * Truncates a string to a maximum length and adds an ellipsis if it exceeds that length.
 * If the string is shorter than or equal to the maximum length, it is returned unchanged.
 *
 * @param str the string to truncate
 * @param maxLength the maximum length of the string
 * @returns the truncated string with an ellipsis if it exceeds the maximum length
 */
export const ellipsis = (str: string, maxLength: number) => {
  if (str.length <= maxLength) {
    return str;
  }

  return `${str.slice(0, maxLength)}...`;
};

/**
 * Checks if a string is a valid email address.
 *
 * @param email the string to check
 * @returns true if the string is a valid email address, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  return z.string().email().safeParse(email).success;
};
