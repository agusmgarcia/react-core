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
