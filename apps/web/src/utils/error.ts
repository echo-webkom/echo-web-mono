// https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript

export type ErrorMessage = {
  message: string;
};

/**
 * Checks if the value is an error message.
 *
 * @note Asserts that the value is an object with a string message property.
 *
 * @param error the value to check
 * @returns true if the value is an error message, false otherwise
 */
export function isErrorMessage(error: unknown): error is ErrorMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}
