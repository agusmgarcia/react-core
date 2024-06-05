import { execute } from "../_utils";
import withContext from "./withContext.typescript";

const COMMAND = "tsc --pretty --noEmit";

export default function check(options: { skip: string[] }): Promise<void> {
  return withContext(() => execute(COMMAND, true), options);
}
