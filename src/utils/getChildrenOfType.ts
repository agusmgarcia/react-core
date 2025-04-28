// TODO: delete this file.
import * as childrenModule from "./children";
import type Func from "./Func.types";

/**
 * @deprecated This method is going to be removed in the next major version.
 *              Use children.getOfType instead.
 */
export default function getChildrenOfType<
  TType extends Func<React.ReactElement, [props: any]>,
>(
  type: TType,
  children: React.ReactNode,
): React.ReactElement<Parameters<TType>[0], TType>[];

/**
 * @deprecated This method is going to be removed in the next major version.
 *              Use children.getOfType instead.
 */
export default function getChildrenOfType<TType extends "boolean">(
  type: TType,
  children: React.ReactNode,
): boolean[];

/**
 * @deprecated This method is going to be removed in the next major version.
 *              Use children.getOfType instead.
 */
export default function getChildrenOfType<TType extends "null">(
  type: TType,
  children: React.ReactNode,
): null[];

/**
 * @deprecated This method is going to be removed in the next major version.
 *              Use children.getOfType instead.
 */
export default function getChildrenOfType<TType extends "number">(
  type: TType,
  children: React.ReactNode,
): number[];

/**
 * @deprecated This method is going to be removed in the next major version.
 *              Use children.getOfType instead.
 */
export default function getChildrenOfType<TType extends "string">(
  type: TType,
  children: React.ReactNode,
): string[];

/**
 * @deprecated This method is going to be removed in the next major version.
 *              Use children.getOfType instead.
 */
export default function getChildrenOfType<TType extends "undefined">(
  type: TType,
  children: React.ReactNode,
): undefined[];

export default function getChildrenOfType(
  type: any,
  children: React.ReactNode,
): any[] {
  return childrenModule.getOfType(type, children);
}
