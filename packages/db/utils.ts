export async function runWithRetries<T>(fn: () => Promise<T> | T, retries: number): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      return runWithRetries(fn, retries - 1);
    }
    throw error;
  }
}
