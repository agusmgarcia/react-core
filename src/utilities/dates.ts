const dateRegexp = /(\d\d\d\d)-(\d\d)-(\d\d)/;

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

/**
 * @deprecated This method is going to be deleted in the next major version.
 * Use toDateString instead.
 */
// TODO: delete this method in the next major version.
export function formatDate(
  date: Date | string,
  format: "dd" | "ii" | "MM" | "yyyy" | "yyyy-MM-dd",
): string {
  date = typeof date === "string" ? new Date(date) : date;
  switch (format) {
    case "dd":
      return `${`${date.getUTCDate()}`.padStart(2, "0")}`;

    case "ii":
      return `${`${date.getUTCDay()}`.padStart(2, "0")}`;

    case "MM":
      return `${`${date.getUTCMonth() + 1}`.padStart(2, "0")}`;

    case "yyyy":
      return `${date.getUTCFullYear()}`;

    case "yyyy-MM-dd":
      return `${formatDate(date, "yyyy")}-${formatDate(
        date,
        "MM",
      )}-${formatDate(date, "dd")}`;
  }
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

function toString(date: Date): string {
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}
