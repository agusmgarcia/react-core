type TupleToUnion<TArray> = TArray extends unknown[] ? TArray[number] : never;

export default TupleToUnion;
