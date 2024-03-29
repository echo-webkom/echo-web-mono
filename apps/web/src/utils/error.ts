export type ErrorMessage = {
  message: string;
};

// https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
export function isErrorMessage(error: unknown): error is ErrorMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}
