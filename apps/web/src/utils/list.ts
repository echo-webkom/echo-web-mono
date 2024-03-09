export const makeListUnique = <T>(list: Array<T>): Array<T> => {
  return Array.from(new Set(list));
};

export const intersection = <T>(a: Array<T>, b: Array<T>): Array<T> => {
  return a.filter((value) => b.includes(value));
};

export const doesIntersect = <T>(a: Array<T>, b: Array<T>): boolean => {
  return intersection(a, b).length > 0;
};

export const split = <T>(a: Array<T>, condition: (item: T) => boolean) => {
  const trueA = a.filter(condition);
  const falseA = a.filter((item) => !condition(item));
  return {
    trueA,
    falseA,
  };
};
