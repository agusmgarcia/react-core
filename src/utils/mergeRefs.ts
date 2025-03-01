export default function mergeRefs<TElement>(
  ...inputRefs: React.LegacyRef<TElement>[]
): React.LegacyRef<TElement> | undefined {
  if (inputRefs.length <= 1) return inputRefs.at(0);

  const refCallback: React.RefCallback<TElement> = (instance) => {
    for (const ref of inputRefs) {
      if (typeof ref === "string" || !ref) continue;
      if (typeof ref === "function") ref(instance);
      else (ref as any).current = instance;
    }
  };

  return refCallback;
}
