import React from "react";

import * as childrenModule from "./children";

describe("children", () => {
  describe("getOfType", () => {
    it("should extract children of type string", () => {
      const children = ["hello", 123, true, "world"];
      const result = childrenModule.getOfType("string", children);
      expect(result).toEqual(["hello", "world"]);
    });

    it("should extract children of type number", () => {
      const children = ["hello", 123, true, 456];
      const result = childrenModule.getOfType("number", children);
      expect(result).toEqual([123, 456]);
    });

    it("should extract children of type boolean", () => {
      const children = ["hello", true, false, 123];
      const result = childrenModule.getOfType("boolean", children);
      expect(result).toEqual([true, false]);
    });

    it("should extract children of type null", () => {
      const children = ["hello", null, 123, null];
      const result = childrenModule.getOfType("null", children);
      expect(result).toEqual([null, null]);
    });

    it("should extract children of type undefined", () => {
      const children = ["hello", undefined, 123, undefined];
      const result = childrenModule.getOfType("undefined", children);
      expect(result).toEqual([undefined, undefined]);
    });

    it("should extract children of a specific React component type", () => {
      const MyComponent = () => <div />;
      const children = [
        <MyComponent key="1" />,
        <div key="2" />,
        <MyComponent key="3" />,
      ];
      const result = childrenModule.getOfType(MyComponent, children);
      expect(result).toHaveLength(2);
    });
  });

  describe("mapOfType", () => {
    it("should transform children of type string", () => {
      const children = ["hello", 123, true, "world"];
      const result = childrenModule.mapOfType("string", children, (child) =>
        child.toUpperCase(),
      );
      expect(result).toEqual(["HELLO", 123, true, "WORLD"]);
    });

    it("should transform children of type number", () => {
      const children = ["hello", 123, true, 456];
      const result = childrenModule.mapOfType(
        "number",
        children,
        (child) => child * 2,
      );
      expect(result).toEqual(["hello", 246, true, 912]);
    });

    it("should transform children of type boolean", () => {
      const children = ["hello", true, false, 123];
      const result = childrenModule.mapOfType(
        "boolean",
        children,
        (child) => !child,
      );
      expect(result).toEqual(["hello", false, true, 123]);
    });

    it("should transform children of type null", () => {
      const children = ["hello", null, 123, null];
      const result = childrenModule.mapOfType(
        "null",
        children,
        () => "transformed",
      );
      expect(result).toEqual(["hello", "transformed", 123, "transformed"]);
    });

    it("should transform children of type undefined", () => {
      const children = ["hello", undefined, 123, undefined];
      const result = childrenModule.mapOfType(
        "undefined",
        children,
        () => "transformed",
      );
      expect(result).toEqual(["hello", "transformed", 123, "transformed"]);
    });

    it("should transform children of a specific React component type", () => {
      const MyComponent = ({ text }: { text: string }) => <div>{text}</div>;
      const children = [
        <MyComponent key="1" text="hello" />,
        <div key="2" />,
        <MyComponent key="3" text="world" />,
      ];
      const result = childrenModule.mapOfType(MyComponent, children, (child) =>
        React.cloneElement(child, { text: child.props.text.toUpperCase() }),
      );
      expect(result).toHaveLength(3);
      expect((result as any)[0].props.text).toBe("HELLO");
      expect((result as any)[2].props.text).toBe("WORLD");
    });

    it("should transform children of type string into a React component", () => {
      const MyComponent = () => (
        <div>
          <p>Hello</p>
        </div>
      );
      const result = childrenModule.mapOfType(
        "string",
        <div>
          <MyComponent />
        </div>,
        (child) => <u>{`${child} John`}</u>,
      );
      expect((result as any).type).toBe("div");
      expect((result as any).props.children.type).toBe("div");
      expect((result as any).props.children.props.children.type).toBe("p");
      expect(
        (result as any).props.children.props.children.props.children.type,
      ).toBe("u");
      expect(
        (result as any).props.children.props.children.props.children.props
          .children,
      ).toBe("Hello John");
    });

    it("should stop transforming children of a specific React component type when stopIf condition is met", () => {
      const MyComponent = () => (
        <div>
          <p>Hello</p>
          <p>Hello</p>
          <div>
            <p>Hello</p>
            <p>Hello</p>
          </div>
        </div>
      );
      const result = childrenModule.mapOfType(
        "string",
        <div>
          <MyComponent />
          <p>Hello</p>
          <div>
            <p>Hello</p>
            <p>Hello</p>
          </div>
        </div>,
        (child) => <u>{`${child} John`}</u>,
        (child) =>
          typeof child === "object" &&
          !!child &&
          "type" in child &&
          child.type === MyComponent,
      );
      expect((result as any).type).toBe("div");
      expect((result as any).props.children).toHaveLength(3);
      expect((result as any).props.children[0].type).toBe(MyComponent);
      expect((result as any).props.children[1].type).toBe("p");
      expect((result as any).props.children[1].props.children.type).toBe("u");
      expect(
        (result as any).props.children[1].props.children.props.children,
      ).toBe("Hello John");
      expect((result as any).props.children[2].type).toBe("div");
      expect((result as any).props.children[2].props.children).toHaveLength(2);
      expect((result as any).props.children[2].props.children[0].type).toBe(
        "p",
      );
      expect(
        (result as any).props.children[2].props.children[0].props.children.type,
      ).toBe("u");
      expect(
        (result as any).props.children[2].props.children[0].props.children.props
          .children,
      ).toBe("Hello John");
      expect((result as any).props.children[2].props.children[1].type).toBe(
        "p",
      );
      expect(
        (result as any).props.children[2].props.children[1].props.children.type,
      ).toBe("u");
      expect(
        (result as any).props.children[2].props.children[1].props.children.props
          .children,
      ).toBe("Hello John");
    });
  });
});
