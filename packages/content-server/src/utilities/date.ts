// Allow a range of integers
type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T;

// The getDay() returns the weekday index as sunday is the 0, so we convert it.
// Monday has to be on index 0.
export function isoDayIndex(date: Date = new Date()) {
  return (date.getDay() + 6) % 7;
}

export function getMonday(weeksBack: number, timezoneOffset: number) {
  const now = new Date();
  const lastMondayDate = now.getDate() - isoDayIndex(now) - weeksBack * 7;
  const lastMonday = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), lastMondayDate, 0, timezoneOffset),
  );

  return lastMonday;
}

export function getDaysAgo(days: number) {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * days);
}

/**
 * Get offset(s) of timezones in which it's currently the given hour
 * @param {number} hour - The hour number in 24 hour format
 */
export function getTimezoneOffsetWhereHour(hour: Range<0, 23> = 0) {
  const utcOffset = -new Date().getUTCHours(); // inverted, range [-23,0]
  const midnightOffsets: number[] = [];

  if (utcOffset >= -12) {
    midnightOffsets.push(-utcOffset * 60);
  }

  const nextMidnight = utcOffset + 24;
  if (nextMidnight <= 14) {
    midnightOffsets.push(-nextMidnight * 60);
  }

  return midnightOffsets
    .map((offset) => offset - hour * 60)
    .filter((offset) => offset >= -840 && offset <= 720);
}

export function createTimestamp() {
  const now = new Date();
  const date = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
  const time = `${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

  return `${date}t${time}`;
}
