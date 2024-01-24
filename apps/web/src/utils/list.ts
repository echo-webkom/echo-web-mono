export const makeListUnique = <T>(list: Array<T>): Array<T> => {
  return Array.from(new Set(list));
};

export const intersection = <T>(a: Array<T>, b: Array<T>): Array<T> => {
  return a.filter((value) => b.includes(value));
};

export const doesIntersect = <T>(a: Array<T>, b: Array<T>): boolean => {
  return intersection(a, b).length > 0;
};
