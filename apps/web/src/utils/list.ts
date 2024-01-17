export const makeListUnique = <T>(list: Array<T>): Array<T> => {
  return Array.from(new Set(list));
};
