import type Func from "./Func.types";

export default function getChildrenOfType<
  TType extends Func<React.ReactElement, [props: any]>,
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
    | Func<React.ReactElement, [props: any]>
    | "boolean"
    | "null"
    | "number"
    | "string"
    | "undefined",
>(type: TType, children: React.ReactNode): any[] {
  const result = new Array();
  getChildrenOfTypeRecursive(type, children, result);
  return result;
}

function getChildrenOfTypeRecursive<
  TType extends
    | Func<React.ReactElement, [props: any]>
    | "boolean"
    | "null"
    | "number"
    | "string"
    | "undefined",
>(type: TType, children: React.ReactNode, result: any[]): void {
  if (typeof children !== "object") {
    if (typeof children === type) result.push(children);
    return;
  }

  if (!children) {
    if (type === "null") result.push(children);
    return;
  }

  if (Array.isArray(children)) {
    children.forEach((c) => getChildrenOfTypeRecursive(type, c, result));
    return;
  }

  if (!("type" in children)) return;

  if (typeof type === "function" && children.type === type)
    result.push(children);

  getChildrenOfTypeRecursive(type, (children.props as any).children, result);
}
