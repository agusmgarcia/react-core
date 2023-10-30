import { execute } from "../_utils";
import withContext from "./withContext.eslint";

const COMMAND =
  "next lint --cache --cache-location ./node_modules/.eslintcache --cache-strategy content --dir .";

export default function check(force: boolean): Promise<void> {
  return withContext(() => execute(COMMAND, true), force);
}
