export const logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    console.log("ℹ️ [INFO]", message, JSON.stringify(meta));
  },
  error: (message: string, meta?: Record<string, unknown>) => {
    console.error("❌ [ERROR]", message, JSON.stringify(meta));
  },
};
