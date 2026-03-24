const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseDateParts(date: string): [number, number, number] {
  const match = date.match(DATE_ONLY_PATTERN);

  if (!match) {
    throw new TypeError(`Invalid editorial date: ${date}`);
  }

  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function normalizeEditorialDate(value: string | Date): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError('Invalid Date object');
    }

    return value.toISOString().slice(0, 10);
  }

  const normalized = value.trim();

  if (DATE_ONLY_PATTERN.test(normalized)) {
    return normalized;
  }

  const parsed = new Date(normalized);

  if (Number.isNaN(parsed.getTime())) {
    throw new TypeError(`Invalid date string: ${value}`);
  }

  return parsed.toISOString().slice(0, 10);
}

export function compareEditorialDatesDesc(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? 1 : -1;
}

export function formatEditorialDate(date: string, locale = 'en-US'): string {
  const [year, month, day] = parseDateParts(normalizeEditorialDate(date));

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function toRssPublicationDate(date: string): Date {
  const [year, month, day] = parseDateParts(normalizeEditorialDate(date));
  return new Date(Date.UTC(year, month - 1, day, 12));
}
