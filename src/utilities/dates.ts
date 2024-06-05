export function addDays(date: string, days: number): string {
  const tmp = new Date(date);
  tmp.setUTCDate(tmp.getUTCDate() + days);
  return formatDate(tmp, "yyyy-MM-dd");
}

export function addMonths(date: string, months: number): string {
  const tmp = new Date(date);
  tmp.setUTCMonth(tmp.getUTCMonth() + months);
  return formatDate(tmp, "yyyy-MM-dd");
}

export function addYears(date: string, years: number): string {
  const tmp = new Date(date);
  tmp.setUTCFullYear(tmp.getUTCFullYear() + years);
  return formatDate(tmp, "yyyy-MM-dd");
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

export function getCurrentDate(timeZone?: string): string {
  const tmp = new Date(new Date().toLocaleString(undefined, { timeZone }));
  return formatDate(tmp, "yyyy-MM-dd");
}

export function getFirstDateOfMonth(date: string): string {
  const tmp = new Date(
    date.replace(
      /(\d\d\d\d)-(\d\d)-\d\d/g,
      (_: string, year: string, month: string) => `${year}-${month}-01`,
    ),
  );

  return formatDate(tmp, "yyyy-MM-dd");
}

export function getLastDateOfMonth(date: string): string {
  return addDays(addMonths(getFirstDateOfMonth(date), 1), -1);
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
