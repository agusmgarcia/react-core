import type Func from "./Func.types";

export default function getChildrenOfType<
  TType extends Func<JSX.Element, [props: any]>,
>(
  type: TType,
  children: React.ReactNode,
): React.ReactElement<Parameters<TType>[0], TType>[];

export default function getChildrenOfType<TType extends "boolean">(
  type: TType,
  children: React.ReactNode,
): boolean[];

export default function getChildrenOfType<TType extends "null">(
  type: TType,
  children: React.ReactNode,
): null[];

export default function getChildrenOfType<TType extends "number">(
  type: TType,
  children: React.ReactNode,
): number[];

export default function getChildrenOfType<TType extends "string">(
  type: TType,
  children: React.ReactNode,
): string[];

export default function getChildrenOfType<TType extends "undefined">(
  type: TType,
  children: React.ReactNode,
): undefined[];

export default function getChildrenOfType<
  TType extends
    | Func<JSX.Element, [props: any]>
    | "boolean"
    | "null"
    | "number"
    | "string"
    | "undefined",
>(type: TType, children: React.ReactNode): any {
  if (!Array.isArray(children)) {
    if (type === "null") {
      if (children === null) return [];
      return [children];
    }

    if (typeof type === "function") {
      if (typeof children !== "object") return [];
      if (children === null) return [];
      if (!("type" in children)) return [];
      if (children.type !== type) return [];
      return [children];
    }

    if (typeof children !== type) return [];
    return [children];
  }

  return children.flatMap((child) => getChildrenOfType(type as any, child));
}
