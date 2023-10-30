import { execute } from "../_utils";
import withContext from "./withContext.core";

const COMMAND = "next dev";

export default function start(force: boolean): Promise<void> {
  return withContext(() => execute(COMMAND, true), force);
}
