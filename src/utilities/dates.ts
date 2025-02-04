const dateRegexp = /(\d\d\d\d)-(\d\d)-(\d\d)/;

const maxDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function addDays(date: string, days: number): string {
  const tmp = new Date(date);
  tmp.setUTCDate(tmp.getUTCDate() + days);
  return toString(tmp);
}

export function addMonths(date: string, months: number): string {
  const tmp = new Date(date);
  tmp.setUTCMonth(tmp.getUTCMonth() + months);
  return toString(tmp);
}

export function addYears(date: string, years: number): string {
  const tmp = new Date(date);
  tmp.setUTCFullYear(tmp.getUTCFullYear() + years);
  return toString(tmp);
}

export function clamp(date: string, minDate: string, maxDate: string): string {
  return min(max(date, minDate), maxDate);
}

export function differenceInDays(endDate: string, startDate: string): number {
  const upper = new Date(endDate).getTime();
  const lower = new Date(startDate).getTime();
  const diffTime = upper - lower;
  return Math.ceil(diffTime / 86_400_000);
}

export function getCurrentDate(
  timeZone?: Intl.DateTimeFormatOptions["timeZone"],
  timeZoneName?: Intl.DateTimeFormatOptions["timeZoneName"],
): string {
  const [month, date, year] = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      timeZone,
      timeZoneName,
      year: "numeric",
    })
    .split("/");

  return `${year}-${month}-${date}`;
}

export function getDate(date: string): number {
  return +date.replace(
    dateRegexp,
    (_: string, _year: string, _month: string, date: string) => date,
  );
}

export function getDayOfTheWeek(date: string): number {
  return new Date(date).getUTCDay();
}

export function getFirstDateOfMonth(date: string): string {
  const tmp = new Date(
    date.replace(
      dateRegexp,
      (_: string, year: string, month: string) => `${year}-${month}-01`,
    ),
  );

  return toString(tmp);
}

export function getLastDateOfMonth(date: string): string {
  return addDays(addMonths(getFirstDateOfMonth(date), 1), -1);
}

export function getMonth(date: string): number {
  return +date.replace(
    dateRegexp,
    (_: string, _year: string, month: string, _date: string) => month,
  );
}

export function getYear(date: string): number {
  return +date.replace(
    dateRegexp,
    (_: string, year: string, _month: string, _date: string) => year,
  );
}

function isLeap(year: number): boolean {
  return !(year % 4 || (!(year % 100) && year % 400));
}

export function max(date: string, ...dates: string[]): string {
  let result = date;
  for (const aux of dates) if (aux > result) result = aux;
  return result;
}

export function min(date: string, ...dates: string[]): string {
  let result = date;
  for (const aux of dates) if (aux < result) result = aux;
  return result;
}

export function toDateString(
  date: string,
  locale?: string,
  options?: Omit<
    Intl.DateTimeFormatOptions,
    | "hour"
    | "hour12"
    | "hourCycle"
    | "minute"
    | "second"
    | "timeZone"
    | "timeZoneName"
  >,
): string {
  return new Date(date).toLocaleDateString(locale, {
    ...options,
    timeZone: "UTC",
  });
}

export function toString(date: number): string;

export function toString(date: Date): string;

export function toString(date: Date | number): string {
  date = typeof date === "number" ? new Date(date) : date;
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}

export function validate(date: string): boolean {
  const matches = dateRegexp.exec(date);
  if (matches === null) return false;

  const year = +matches[1];
  const month = +matches[2];
  const day = +matches[3];

  if (day <= 0) return false;
  if (month <= 0 || month > 12) return false;
  if (month === 2 && isLeap(year)) return day <= 29;
  return day <= maxDaysPerMonth[month - 1];
}
