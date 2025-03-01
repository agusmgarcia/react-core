import React from "react";

import getChildrenOfType from "./getChildrenOfType";

describe("getChildrenOfType", () => {
  it("counts the number of the specified children the component has", () => {
    const Component = () => <div>My component</div>;

    expect(getChildrenOfType(Component, <Component />).length).toStrictEqual(1);
    expect(getChildrenOfType(Component, <div />).length).toStrictEqual(0);
    expect(
      getChildrenOfType(
        Component,
        <>
          <Component />
          <Component />
          {undefined}
          <div>
            <Component />
          </div>
        </>,
      ).length,
    ).toStrictEqual(3);
  });

  it("counts the number of null the component has", () => {
    expect(getChildrenOfType("null", null).length).toStrictEqual(1);
    expect(getChildrenOfType("null", <div />).length).toStrictEqual(0);
    expect(
      getChildrenOfType(
        "null",
        <>
          {null}
          {null}
          {undefined}
          <div>{null}</div>
        </>,
      ).length,
    ).toStrictEqual(3);
  });

  it("counts the number of string the component has", () => {
    expect(getChildrenOfType("string", "John Doe").length).toStrictEqual(1);
    expect(getChildrenOfType("string", <div />).length).toStrictEqual(0);
    expect(
      getChildrenOfType(
        "string",
        <>
          {"John"}
          {"Doe"}
          {undefined}
          <div>{"Foo"}</div>
        </>,
      ).length,
    ).toStrictEqual(3);
  });
});
