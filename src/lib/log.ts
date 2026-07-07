// Minimal logger so components don't call `console.*` directly
// (sonarqube-compliance rule 5). In production this is where a real
// logging/telemetry sink would be wired in.
export const logger = {
  error(message: string, ...meta: unknown[]): void {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(message, ...meta);
    }
    // production: forward to telemetry (e.g. Sentry) — intentionally omitted here.
  },
};
