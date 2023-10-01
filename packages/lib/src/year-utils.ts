import { type Year } from "@echo-webkom/storage";

export const yearToNumber = (year: Year | null): number => {
  switch (year) {
    case "first":
      return 1;
    case "second":
      return 2;
    case "third":
      return 3;
    case "fourth":
      return 4;
    case "fifth":
      return 5;
    default:
      return 0;
  }
};

export const numberToYear = (year: number): Year => {
  switch (year) {
    case 1:
      return "first";
    case 2:
      return "second";
    case 3:
      return "third";
    case 4:
      return "fourth";
    case 5:
      return "fifth";
    default:
      return "first";
  }
};

export const compareYears = (a: Year, b: Year) => {
  return yearToNumber(a) - yearToNumber(b);
};
