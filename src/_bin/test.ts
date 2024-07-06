import run from "./_run";
import { execute } from "./utilities";

export default async function test(): Promise<void> {
  await run(
    false,
    () => execute("jest --passWithNoTests", true),
    () => execute("del .swc", true),
  );
}

test();
