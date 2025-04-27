import type Func from "./Func.types";

/**
 * Extracts children of a specific type from a React node tree.
 *
 * @template TType - The type of children to extract. This is a React component type
 *                   (a function that returns a React element).
 * @param type - The type of children to extract. This is a React component type
 *                   (a function that returns a React element).
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @returns An array of children matching the specified type.
 */
export default function getChildrenOfType<
  TType extends Func<React.ReactElement, [props: any]>,
>(
  type: TType,
  children: React.ReactNode,
): React.ReactElement<Parameters<TType>[0], TType>[];

/**
 * Extracts children of a specific type from a React node tree.
 *
 * @template TType - The type of children to extract. This is a "boolean" type.
 * @param type - The type of children to extract. This is a "boolean" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @returns An array of children matching the specified type.
 */
export default function getChildrenOfType<TType extends "boolean">(
  type: TType,
  children: React.ReactNode,
): boolean[];

/**
 * Extracts children of a specific type from a React node tree.
 *
 * @template TType - The type of children to extract. This is a "null" type.
 * @param type - The type of children to extract. This is a "null" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @returns An array of children matching the specified type.
 */
export default function getChildrenOfType<TType extends "null">(
  type: TType,
  children: React.ReactNode,
): null[];

/**
 * Extracts children of a specific type from a React node tree.
 *
 * @template TType - The type of children to extract. This is a "number" type.
 * @param type - The type of children to extract. This is a "number" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @returns An array of children matching the specified type.
 */
export default function getChildrenOfType<TType extends "number">(
  type: TType,
  children: React.ReactNode,
): number[];

/**
 * Extracts children of a specific type from a React node tree.
 *
 * @template TType - The type of children to extract. This is a "string" type.
 * @param type - The type of children to extract. This is a "string" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @returns An array of children matching the specified type.
 */
export default function getChildrenOfType<TType extends "string">(
  type: TType,
  children: React.ReactNode,
): string[];

/**
 * Extracts children of a specific type from a React node tree.
 *
 * @template TType - The type of children to extract. This is a "undefined" type.
 * @param type - The type of children to extract. This is a "undefined" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @returns An array of children matching the specified type.
 */
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

  if (children.type === type) result.push(children);

  getChildrenOfTypeRecursive(
    type,
    typeof children.type === "function"
      ? (children.type as Function)(children.props).props.children
      : (children.props as any).children,
    result,
  );
}
