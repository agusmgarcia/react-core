import { execute } from "../_utils";
import withContext from "./withContext.eslint";

const COMMAND =
  "next lint --cache-location ./node_modules/.eslintcache --cache-strategy content --dir .";

export default function check(options: { skip: string[] }): Promise<void> {
  return withContext(() => execute(COMMAND, true), options);
}
