import isParentOf from "./isParentOf";

export default function isChildOf(
  parent: Node | null,
  child: Node | null,
): boolean {
  return isParentOf(child, parent);
}
