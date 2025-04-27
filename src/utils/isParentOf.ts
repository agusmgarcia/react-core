/**
 * Determines whether a given node (`child`) is a descendant of another node (`parent`).
 *
 * @param child - The node to check if it is a descendant of the `parent`. Can be `null`.
 * @param parent - The node to check against as the potential ancestor. Can be `null`.
 * @returns `true` if the `child` is a descendant of the `parent` and is not the same node;
 *          otherwise, `false`.
 *
 * @remarks
 * - If the `parent` is `null`, the function immediately returns `false`.
 * - The function traverses up the DOM tree from the `child` node, checking each ancestor
 *   until it either finds the `parent` node or reaches the root of the tree.
 * - The `index > 0` condition ensures that the `child` is not the same as the `parent`.
 */
export default function isParentOf(
  child: Node | null,
  parent: Node | null,
): boolean {
  if (!parent) return false;

  let aux = child;
  let index = 0;

  while (!!aux) {
    if (aux === parent) return index > 0;
    ++index;
    aux = aux.parentElement;
  }

  return false;
}
