import { formatNewsDate, newsDateTime } from "@/lib/date/newsDate";

describe("formatNewsDate", () => {
  it("formats a date-only value as MM/DD/YYYY", () => {
    expect(formatNewsDate("2025-09-02")).toBe("09/02/2025");
  });

  it("ignores any time component rather than shifting the day across time zones", () => {
    expect(formatNewsDate("2025-01-01T23:30:00.000Z")).toBe("01/01/2025");
  });

  it("returns an empty string for a missing or unparseable value", () => {
    expect(formatNewsDate(undefined)).toBe("");
    expect(formatNewsDate("not-a-date")).toBe("");
  });
});

describe("newsDateTime", () => {
  it("returns the machine-readable date for the <time> element", () => {
    expect(newsDateTime("2025-09-02")).toBe("2025-09-02");
  });

  it("returns undefined when there is nothing to encode", () => {
    expect(newsDateTime("nope")).toBeUndefined();
  });
});
