const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

export function formatNewsDate(value?: string): string {
  const match = value?.match(DATE_ONLY_PATTERN);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${month}/${day}/${year}`;
}

export function newsDateTime(value?: string): string | undefined {
  const match = value?.match(DATE_ONLY_PATTERN);
  if (!match) return undefined;
  const [, year, month, day] = match;
  return `${year}-${month}-${day}`;
}
