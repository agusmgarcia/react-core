import { execute } from "../_utils";
import withContext from "./withContext.typescript";

const COMMAND = "tsc --pretty --noEmit";

export default function check(): Promise<void> {
  return withContext(() => execute(COMMAND, true));
}
