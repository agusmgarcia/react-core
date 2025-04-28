import React from "react";

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
export function getOfType<TType extends Func<React.ReactElement, [props: any]>>(
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
export function getOfType<TType extends "boolean">(
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
export function getOfType<TType extends "null">(
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
export function getOfType<TType extends "number">(
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
export function getOfType<TType extends "string">(
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
export function getOfType<TType extends "undefined">(
  type: TType,
  children: React.ReactNode,
): undefined[];

export function getOfType(type: any, children: React.ReactNode): any[] {
  const result = new Array();
  getOfTypeRecursive(type, children, result);
  return result;
}

function getOfTypeRecursive(
  type: any,
  children: React.ReactNode,
  result: any[],
): void {
  if (typeof children !== "object") {
    if (typeof children === type) result.push(children);
    return;
  }

  if (!children) {
    if (type === "null") result.push(children);
    return;
  }

  if (Array.isArray(children)) {
    children.forEach((c) => getOfTypeRecursive(type, c, result));
    return;
  }

  if (!("type" in children)) return;

  if (children.type === type) result.push(children);

  getOfTypeRecursive(
    type,
    typeof children.type === "function"
      ? (children.type as Function)(children.props).props.children
      : (children.props as any).children,
    result,
  );
}

/**
 * Maps over children of a specific type in a React node tree and applies a transformation.
 *
 * @template TType - The type of children to map over. This is a React component type
 *                   (a function that returns a React element).
 * @param type - The type of children to map over. This is a React component type
 *                   (a function that returns a React element).
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @param transform - A function to apply to each child of the specified type.
 * @param stopIf - An optional function that, if provided, will stop the mapping process for
 *                 the current child if it returns true.
 * @returns A new React node tree with the transformation applied to the matching children.
 */
export function mapOfType<TType extends Func<React.ReactElement, [props: any]>>(
  type: TType,
  children: React.ReactNode,
  transform: Func<
    React.ReactNode,
    [child: React.ReactElement<Parameters<TType>[0], TType>]
  >,
  stopIf?: Func<boolean, [child: React.ReactNode]>,
): React.ReactNode;

/**
 * Maps over children of a specific type in a React node tree and applies a transformation.
 *
 * @template TType - The type of children to map over. This is a "boolean" type.
 * @param type - The type of children to map over. This is a "boolean" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @param transform - A function to apply to each child of the specified type.
 * @param stopIf - An optional function that, if provided, will stop the mapping process for
 *                 the current child if it returns true.
 * @returns A new React node tree with the transformation applied to the matching children.
 */
export function mapOfType<TType extends "boolean">(
  type: TType,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: boolean]>,
  stopIf?: Func<boolean, [child: React.ReactNode]>,
): React.ReactNode;

/**
 * Maps over children of a specific type in a React node tree and applies a transformation.
 *
 * @template TType - The type of children to map over. This is a "null" type.
 * @param type - The type of children to map over. This is a "null" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @param transform - A function to apply to each child of the specified type.
 * @param stopIf - An optional function that, if provided, will stop the mapping process for
 *                 the current child if it returns true.
 * @returns A new React node tree with the transformation applied to the matching children.
 */
export function mapOfType<TType extends "null">(
  type: TType,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: null]>,
  stopIf?: Func<boolean, [child: React.ReactNode]>,
): React.ReactNode;

/**
 * Maps over children of a specific type in a React node tree and applies a transformation.
 *
 * @template TType - The type of children to map over. This is a "number" type.
 * @param type - The type of children to map over. This is a "number" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @param transform - A function to apply to each child of the specified type.
 * @param stopIf - An optional function that, if provided, will stop the mapping process for
 *                 the current child if it returns true.
 * @returns A new React node tree with the transformation applied to the matching children.
 */
export function mapOfType<TType extends "number">(
  type: TType,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: number]>,
  stopIf?: Func<boolean, [child: React.ReactNode]>,
): React.ReactNode;

/**
 * Maps over children of a specific type in a React node tree and applies a transformation.
 *
 * @template TType - The type of children to map over. This is a "string" type.
 * @param type - The type of children to map over. This is a "string" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @param transform - A function to apply to each child of the specified type.
 * @param stopIf - An optional function that, if provided, will stop the mapping process for
 *                 the current child if it returns true.
 * @returns A new React node tree with the transformation applied to the matching children.
 */
export function mapOfType<TType extends "string">(
  type: TType,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: string]>,
  stopIf?: Func<boolean, [child: React.ReactNode]>,
): React.ReactNode;

/**
 * Maps over children of a specific type in a React node tree and applies a transformation.
 *
 * @template TType - The type of children to map over. This is a "undefined" type.
 * @param type - The type of children to map over. This is a "undefined" type.
 * @param children - The React node tree to search within. This can be a single React node,
 *                   an array of nodes, or any other valid ReactNode.
 * @param transform - A function to apply to each child of the specified type.
 * @param stopIf - An optional function that, if provided, will stop the mapping process for
 *                 the current child if it returns true.
 * @returns A new React node tree with the transformation applied to the matching children.
 */
export function mapOfType<TType extends "undefined">(
  type: TType,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: undefined]>,
  stopIf?: Func<boolean, [child: React.ReactNode]>,
): React.ReactNode;

export function mapOfType(
  type: any,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: any]>,
  stopIf?: Func<boolean, [child: any]>,
): React.ReactNode {
  return mapOfTypeRecursive(type, children, transform, stopIf);
}

function mapOfTypeRecursive(
  type: any,
  children: React.ReactNode,
  transform: Func<React.ReactNode, [child: any]>,
  stopIf: Func<boolean, [child: React.ReactNode]> | undefined,
): React.ReactNode {
  if (!!stopIf && stopIf(children)) return children;

  if (typeof children !== "object") {
    if (typeof children === type) return transform(children);
    return children;
  }

  if (!children) {
    if (type === "null") return transform(children);
    return children;
  }

  if (Array.isArray(children)) {
    return children.map((c, i) =>
      assignKeyIfNeeded(mapOfTypeRecursive(type, c, transform, stopIf), i),
    );
  }

  if (!("type" in children)) return children;

  if (children.type === type) return transform(children);

  if (typeof children.type === "function")
    return mapOfTypeRecursive(
      type,
      (children.type as Function)(children.props),
      transform,
      stopIf,
    );

  return React.cloneElement(
    children,
    undefined,
    mapOfTypeRecursive(
      type,
      (children.props as any).children,
      transform,
      stopIf,
    ),
  );
}

function assignKeyIfNeeded(
  children: React.ReactNode,
  key: number | undefined,
): React.ReactNode {
  if (typeof key !== "number") return children;
  if (typeof children !== "object") return children;
  if (!children) return children;
  if (!("type" in children)) return children;
  if (!!children.key) return children;
  return React.cloneElement(children, { key: `${key}` });
}
