import * as merges from "./merges";

describe("merges", () => {
  it("shallow", () => {
    expect(merges.shallow("3", 3)).toStrictEqual(3);

    expect(merges.shallow({ name: "John" }, { surname: "Doe" })).toStrictEqual({
      name: "John",
      surname: "Doe",
    });

    expect(
      merges.shallow(
        {
          address: { street: "Foo1" },
          deep: { myFunction: functionA },
          name: "John",
          places: ["Rome", "Las Vegas", { name: "California" }],
        },
        {
          address: { number: 281 },
          deep2: { myFunction: functionB },
          places: ["London", { name: "Manchester" }, { country: "USA" }],
          surname: "Doe",
        },
      ),
    ).toStrictEqual({
      address: { number: 281 },
      deep: { myFunction: functionA },
      deep2: { myFunction: functionB },
      name: "John",
      places: ["London", { name: "Manchester" }, { country: "USA" }],
      surname: "Doe",
    });

    expect(
      merges.shallow(
        {
          address: { street: "Foo1" },
          deep: { myFunction: functionA },
          name: "John",
          places: ["Rome", "Las Vegas", { name: "California" }],
        },
        {
          address: { number: 281 },
          deep2: { myFunction: functionB },
          places: ["London", { name: "Manchester" }, { country: "USA" }],
          surname: "Doe",
        },
        { arrayConcat: true },
      ),
    ).toStrictEqual({
      address: { number: 281 },
      deep: { myFunction: functionA },
      deep2: { myFunction: functionB },
      name: "John",
      places: ["London", { name: "Manchester" }, { country: "USA" }],
      surname: "Doe",
    });

    expect(
      merges.shallow(
        {
          person1: {
            name: "John",
            pets: [{ name: "Jackson", setName: functionA }],
            surname: "Doe",
          },
          person2: {
            name: "Foo",
            setName: functionB,
            surname: "Bar",
          },
        },
        {
          person2: {
            name: "Foo2",
            surname: "Bar2",
          },
        },
      ),
    ).toStrictEqual({
      person1: {
        name: "John",
        pets: [{ name: "Jackson", setName: functionA }],
        surname: "Doe",
      },
      person2: {
        name: "Foo2",
        surname: "Bar2",
      },
    });
  });

  it("deep", () => {
    expect(merges.deep("3", 3)).toStrictEqual(3);

    expect(merges.deep({ name: "John" }, { surname: "Doe" })).toStrictEqual({
      name: "John",
      surname: "Doe",
    });

    expect(
      merges.deep(
        {
          address: { street: "Foo1" },
          deep: { myFunction: functionA },
          name: "John",
          places: ["Rome", "Las Vegas", { name: "California" }],
        },
        {
          address: { number: 281 },
          deep2: { myFunction: functionB },
          places: ["London", { name: "Manchester" }, { country: "USA" }],
          surname: "Doe",
        },
      ),
    ).toStrictEqual({
      address: { number: 281, street: "Foo1" },
      deep: { myFunction: functionA },
      deep2: { myFunction: functionB },
      name: "John",
      places: [
        "London",
        { name: "Manchester" },
        { country: "USA", name: "California" },
      ],
      surname: "Doe",
    });

    expect(
      merges.deep(
        {
          address: { street: "Foo1" },
          deep: { myFunction: functionA },
          name: "John",
          places: ["Rome", "Las Vegas", { name: "California" }],
        },
        {
          address: { number: 281 },
          deep2: { myFunction: functionB },
          places: ["London", { name: "Manchester" }, { country: "USA" }],
          surname: "Doe",
        },
        { arrayConcat: true },
      ),
    ).toStrictEqual({
      address: { number: 281, street: "Foo1" },
      deep: { myFunction: functionA },
      deep2: { myFunction: functionB },
      name: "John",
      places: [
        "Rome",
        "Las Vegas",
        { name: "California" },
        "London",
        { name: "Manchester" },
        { country: "USA" },
      ],
      surname: "Doe",
    });

    expect(
      merges.deep(
        {
          person1: {
            name: "John",
            pets: [{ name: "Jackson", setName: functionA }],
            surname: "Doe",
          },
          person2: {
            name: "Foo",
            setName: functionB,
            surname: "Bar",
          },
        },
        {
          person2: {
            name: "Foo2",
            surname: "Bar2",
          },
        },
      ),
    ).toStrictEqual({
      person1: {
        name: "John",
        pets: [{ name: "Jackson", setName: functionA }],
        surname: "Doe",
      },
      person2: {
        name: "Foo2",
        setName: functionB,
        surname: "Bar2",
      },
    });
  });
});

function functionA() {}
function functionB() {}
