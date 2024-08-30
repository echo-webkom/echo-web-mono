/**
 * Returns the intersection of two lists.
 *
 * @example
 * ```ts
 * intersection([1, 2, 3], [2, 3, 4]); // [2, 3]
 * ```
 *
 * @param a list a
 * @param b list b
 * @returns the elements that are in both lists
 */
export const intersection = <T>(a: Array<T>, b: Array<T>): Array<T> => {
  return a.filter((value) => b.includes(value));
};

/**
 * Checks if two lists have any elements in common.
 *
 * @param a list a
 * @param b list b
 * @returns true if the lists have any elements in common, false otherwise
 */
export const doesIntersect = <T>(a: Array<T>, b: Array<T>): boolean => {
  return intersection(a, b).length > 0;
};
