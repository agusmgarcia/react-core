import isParentOf from "./isParentOf";

/**
 * Determines if a given node is a child of another node.
 *
 * This function checks whether the specified `child` node is a descendant
 * of the `parent` node by leveraging the `isParentOf` utility function.
 *
 * @param parent - The potential parent node to check against.
 * @param child - The node to check if it is a child of the `parent`.
 * @returns `true` if the `child` is a descendant of the `parent`, otherwise `false`.
 */
export default function isChildOf(
  parent: Node | null,
  child: Node | null,
): boolean {
  return isParentOf(child, parent);
}
