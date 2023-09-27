export type Result<T> =
  | {
      data: T;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: string;
    };
