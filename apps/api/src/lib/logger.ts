const APP = "API";

export const Logger = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    console.info(
      JSON.stringify({ app: APP, ts: timestamp, severity: "INFO", message, ...metadata }),
    );
  },
  error: (message: string, metadata?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    console.error(
      JSON.stringify({ app: APP, ts: timestamp, severity: "ERROR", message, ...metadata }),
    );
  },
  warn: (message: string, metadata?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    console.warn(
      JSON.stringify({ app: APP, ts: timestamp, severity: "WARN", message, ...metadata }),
    );
  },
};
