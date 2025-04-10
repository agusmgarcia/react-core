export default function sortProperties<TElement extends Record<string, any>>(
  input: TElement,
  preferred: (keyof TElement)[] = [],
): TElement {
  const sortKeys = (key1: string, key2: string): number => {
    const indexOfKey1 = preferred.indexOf(key1 as keyof TElement);
    const indexOfKey2 = preferred.indexOf(key2 as keyof TElement);

    if (indexOfKey1 === -1 && indexOfKey2 === -1)
      return +(key1 > key2) || -(key2 > key1);

    if (indexOfKey1 === -1) return 1;
    if (indexOfKey2 === -1) return -1;

    return indexOfKey1 - indexOfKey2;
  };

  return Object.keys(input)
    .sort(sortKeys)
    .reduce((result, key) => {
      (result as any)[key] = input[key];
      return result;
    }, {} as TElement);
}
