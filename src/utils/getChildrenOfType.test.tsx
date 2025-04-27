import getChildrenOfType from "./getChildrenOfType";

describe("getChildrenOfType", () => {
  it("should return children of the specified type", () => {
    const ChildA = () => <div>Child A</div>;
    const ChildB = () => <div>Child B</div>;

    const TestComponent = () => (
      <div>
        <ChildA />
        <ChildB />
        <ChildA />
      </div>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(2);
  });

  it("should return an empty array if no children of the specified type exist", () => {
    const ChildA = () => <div>Child A</div>;
    const ChildB = () => <div>Child B</div>;

    const TestComponent = () => (
      <div>
        <ChildB />
        <ChildB />
      </div>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(0);
  });

  it("should handle nested children of the specified type", () => {
    const ChildA = () => <div>Child A</div>;
    const ChildB = () => <div>Child B</div>;

    const TestComponent = () => (
      <div>
        <ChildB />
        <div>
          <ChildA />
        </div>
        <ChildA />
      </div>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(2);
  });

  it("should return an empty array if no children are passed", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = () => <div></div>;

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(0);
  });

  it("should return children of the specified type when multiple types are present", () => {
    const ChildA = () => <div>Child A</div>;
    const ChildB = () => <div>Child B</div>;
    const ChildC = () => <div>Child C</div>;

    const TestComponent = () => (
      <div>
        <ChildA />
        <ChildB />
        <ChildC />
        <ChildA />
      </div>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(2);
  });

  it("should handle deeply nested children of the specified type", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = () => (
      <div>
        <div>
          <div>
            <ChildA />
          </div>
        </div>
        <ChildA />
      </div>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(2);
  });

  it("should return children of the specified type when fragments are used", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = () => (
      <>
        <ChildA />
        <>
          <ChildA />
        </>
      </>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(2);
  });

  it("should ignore children that are not React elements", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = () => (
      <div>
        <ChildA />
        {null}
        {false}
        {"string"}
        {42}
      </div>
    );

    const children = getChildrenOfType(ChildA, <TestComponent />);

    expect(children).toHaveLength(1);
  });

  it("should return children of the specified type when passed as props", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    );

    const children = getChildrenOfType(
      ChildA,
      <TestComponent>
        <ChildA />
        <ChildA />
      </TestComponent>,
    );

    expect(children).toHaveLength(2);
  });

  it("should handle children of the specified type passed as props with mixed content", () => {
    const ChildA = () => <div>Child A</div>;
    const ChildB = () => <div>Child B</div>;

    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    );

    const children = getChildrenOfType(
      ChildA,
      <TestComponent>
        <ChildA />
        <ChildB />
        <ChildA />
      </TestComponent>,
    );

    expect(children).toHaveLength(2);
  });

  it("should return an empty array if no children of the specified type are passed as props", () => {
    const ChildA = () => <div>Child A</div>;
    const ChildB = () => <div>Child B</div>;

    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    );

    const children = getChildrenOfType(
      ChildA,
      <TestComponent>
        <ChildB />
        <ChildB />
      </TestComponent>,
    );

    expect(children).toHaveLength(0);
  });

  it("should handle deeply nested children of the specified type passed as props", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <div>
        {children}
        <div>
          <ChildA />
          <ChildA />
        </div>
      </div>
    );

    const children = getChildrenOfType(
      ChildA,
      <TestComponent>
        <div>
          <div>
            <ChildA />
          </div>
        </div>
        <ChildA />
      </TestComponent>,
    );

    expect(children).toHaveLength(4);
  });

  it("should handle fragments with children of the specified type passed as props", () => {
    const ChildA = () => <div>Child A</div>;

    const TestComponent = ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    );

    const children = getChildrenOfType(
      ChildA,
      <TestComponent>
        <>
          <ChildA />
          <>
            <ChildA />
          </>
        </>
      </TestComponent>,
    );

    expect(children).toHaveLength(2);
  });

  it("should return children of 'null' type", () => {
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

  it("should return children of 'string' type", () => {
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
