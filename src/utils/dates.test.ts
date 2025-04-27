import * as dates from "./dates";

describe("dates", () => {
  test("addDays", () => {
    expect(dates.addDays("2023-10-01", 5)).toBe("2023-10-06");
    expect(dates.addDays("2023-10-01", -1)).toBe("2023-09-30");
  });

  test("addMonths", () => {
    expect(dates.addMonths("2023-10-01", 2)).toBe("2023-12-01");
    expect(dates.addMonths("2023-10-01", -1)).toBe("2023-09-01");
  });

  test("addYears", () => {
    expect(dates.addYears("2023-10-01", 1)).toBe("2024-10-01");
    expect(dates.addYears("2023-10-01", -2)).toBe("2021-10-01");
  });

  test("clamp", () => {
    expect(dates.clamp("2023-10-01", "2023-09-01", "2023-11-01")).toBe(
      "2023-10-01",
    );
    expect(dates.clamp("2023-08-01", "2023-09-01", "2023-11-01")).toBe(
      "2023-09-01",
    );
    expect(dates.clamp("2023-12-01", "2023-09-01", "2023-11-01")).toBe(
      "2023-11-01",
    );
  });

  test("differenceInDays", () => {
    expect(dates.differenceInDays("2023-10-10", "2023-10-01")).toBe(9);
    expect(dates.differenceInDays("2023-10-01", "2023-10-10")).toBe(-9);
  });

  test("getCurrentDate", () => {
    const currentDate = dates.getCurrentDate();
    expect(dates.validate(currentDate)).toBe(true);
  });

  test("getDate", () => {
    expect(dates.getDate("2023-10-01")).toBe(1);
  });

  test("getDayOfTheWeek", () => {
    expect(dates.getDayOfTheWeek("2023-10-01")).toBe(0); // Sunday
    expect(dates.getDayOfTheWeek("2023-10-02")).toBe(1); // Monday
  });

  test("getFirstDateOfMonth", () => {
    expect(dates.getFirstDateOfMonth("2023-10-15")).toBe("2023-10-01");
  });

  test("getLastDateOfMonth", () => {
    expect(dates.getLastDateOfMonth("2023-10-15")).toBe("2023-10-31");
    expect(dates.getLastDateOfMonth("2024-02-15")).toBe("2024-02-29"); // Leap year
  });

  test("getMonth", () => {
    expect(dates.getMonth("2023-10-01")).toBe(10);
  });

  test("getYear", () => {
    expect(dates.getYear("2023-10-01")).toBe(2023);
  });

  test("max", () => {
    expect(dates.max("2023-10-01", "2023-11-01", "2023-09-01")).toBe(
      "2023-11-01",
    );
  });

  test("min", () => {
    expect(dates.min("2023-10-01", "2023-11-01", "2023-09-01")).toBe(
      "2023-09-01",
    );
  });

  test("toDateString", () => {
    expect(dates.toDateString("2023-10-01", "en-US")).toBe("10/1/2023");
  });

  test("toString", () => {
    expect(dates.toString(new Date("2023-10-01"))).toBe("2023-10-01");
    expect(dates.toString(Date.UTC(2023, 9, 1))).toBe("2023-10-01");
  });

  test("validate", () => {
    expect(dates.validate("2023-10-01")).toBe(true);
    expect(dates.validate("2023-02-29")).toBe(false);
    expect(dates.validate("2024-02-29")).toBe(true); // Leap year
    expect(dates.validate("2023-13-01")).toBe(false);
    expect(dates.validate("2023-00-01")).toBe(false);
  });
});
