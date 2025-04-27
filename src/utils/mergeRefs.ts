/**
 * Merges multiple React refs into a single ref callback.
 * This utility allows you to pass multiple refs to a single React element,
 * ensuring that all refs are updated with the same instance.
 *
 * @template TElement - The type of the element the refs point to.
 * @param {...React.Ref<TElement>[]} inputRefs - An array of refs to merge.
 * These can be callback refs, object refs, or null/undefined.
 * @returns {React.Ref<TElement> | undefined} A single ref callback that updates all provided refs,
 * or the first ref if only one is provided.
 *
 * @example
 * const ref1 = useRef<HTMLDivElement>(null);
 * const ref2 = useRef<HTMLDivElement>(null);
 *
 * return <div ref={mergeRefs(ref1, ref2)}>Hello</div>;
 */
export default function mergeRefs<TElement>(
  ...inputRefs: React.Ref<TElement>[]
): React.Ref<TElement> | undefined {
  if (inputRefs.length <= 1) return inputRefs.at(0);

  const refCallback: React.RefCallback<TElement> = (instance) => {
    for (const ref of inputRefs) {
      if (typeof ref === "string" || !ref) continue;
      if (typeof ref === "function") ref(instance);
      else ref.current = instance;
    }
  };

  return refCallback;
}
