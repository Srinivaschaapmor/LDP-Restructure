export const logger = {
  error(message: string, ...meta: unknown[]): void {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(message, ...meta);
    }
     },
};
