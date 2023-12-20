export const arrayIntersection = <T>(a: Array<T>, b: Array<T>): Array<T> => {
  return a.filter((value) => b.includes(value));
};

export const doesArrayIntersect = <T>(a: Array<T>, b: Array<T>): boolean => {
  return arrayIntersection(a, b).length > 0;
};
