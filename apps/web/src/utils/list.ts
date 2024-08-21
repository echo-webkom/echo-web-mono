/**
 * Returns a new list with only unique elements.
 *
 * @note Uses the Set data structure to make the list unique.
 * This can reorder the elements in the list.
 *
 * @example
 * ```ts
 * makeListUnique([1, 2, 3, 1, 2, 3]); // [1, 2, 3]
 * ```
 *
 * @param list the list to make unique
 * @returns a new list with only unique elements
 */
export const makeListUnique = <T>(list: Array<T>): Array<T> => {
  return Array.from(new Set(list));
};

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

/**
 * Splits a list into two lists based on a condition.
 *
 * @param a the list to split
 * @param condition the condition to split on
 * @returns a tuple with two lists, one with elements that satisfy the condition and one with elements that do not
 */
export const split = <T>(a: Array<T>, condition: (item: T) => boolean): [Array<T>, Array<T>] => {
  const trueArray = a.filter(condition);
  const falseArray = a.filter((item) => !condition(item));

  return [trueArray, falseArray];
};
