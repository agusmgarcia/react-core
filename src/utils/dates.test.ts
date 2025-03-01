import * as dates from "./dates";

describe("dates", () => {
  it("add days to the specified date", () => {
    expect(dates.addDays("1995-06-17", 1)).toStrictEqual("1995-06-18");
  });

  it("add months to the specified date", () => {
    expect(dates.addMonths("1995-06-17", 1)).toStrictEqual("1995-07-17");
  });

  it("add years to the specified date", () => {
    expect(dates.addYears("1995-06-17", 1)).toStrictEqual("1996-06-17");
  });

  it("clamps the value providing min and max values", () => {
    expect(dates.clamp("1995-06-17", "1995-06-12", "1995-06-18")).toStrictEqual(
      "1995-06-17",
    );
  });

  it("calculates the difference in days between two dates", () => {
    expect(dates.differenceInDays("1995-06-17", "1995-05-30")).toStrictEqual(
      18,
    );
  });

  it("gets the current date", () => {
    expect(dates.getCurrentDate("UTC")).toStrictEqual(
      dates.toString(new Date()),
    );
  });

  it("gets the date of the specified date", () => {
    expect(dates.getDate("1995-06-17")).toStrictEqual(17);
  });

  it("gets the day of the week of the specified date", () => {
    expect(dates.getDayOfTheWeek("1995-06-17")).toStrictEqual(6);
  });

  it("gets the first date of the month of the specified date", () => {
    expect(dates.getFirstDateOfMonth("1995-06-17")).toStrictEqual("1995-06-01");
  });

  it("gets the lasts date of the month of the specified date", () => {
    expect(dates.getLastDateOfMonth("1995-06-17")).toStrictEqual("1995-06-30");
  });

  it("gets the month of the specified date", () => {
    expect(dates.getMonth("1995-06-17")).toStrictEqual(6);
  });

  it("gets the year of the specified date", () => {
    expect(dates.getYear("1995-06-17")).toStrictEqual(1995);
  });

  it("gets the max value of a list of dates", () => {
    expect(dates.max("1995-06-17", "1995-06-18", "1995-06-12")).toStrictEqual(
      "1995-06-18",
    );
  });

  it("gets the min value of a list of dates", () => {
    expect(dates.min("1995-06-17", "1995-06-18", "1995-06-12")).toStrictEqual(
      "1995-06-12",
    );
  });

  it("executes toDateString method", () => {
    expect(
      dates.toDateString("1995-06-17", "en-US", { day: "2-digit" }),
    ).toStrictEqual("17");
  });

  it("transforms the Date object into dates string", () => {
    expect(dates.toString(new Date(1995, 5, 17))).toStrictEqual("1995-06-17");
  });

  it("validates the specified date", () => {
    expect(dates.validate("1995-06-17")).toStrictEqual(true);
  });
});
