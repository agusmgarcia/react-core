import { execute } from "../_utils";
import withContext from "./withContext.typescript";

const COMMAND = "tsc --pretty --noEmit";

export default function check(force: boolean): Promise<void> {
  return withContext(() => execute(COMMAND, true), force);
}
