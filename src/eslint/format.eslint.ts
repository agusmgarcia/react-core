import { execute } from "../_utils";
import withContext from "./withContext.eslint";

const COMMAND =
  "next lint --cache --cache-location ./node_modules/.eslintcache --cache-strategy content --dir . --fix";

export default function format(options: { skip: string[] }): Promise<void> {
  return withContext(() => execute(COMMAND, true), options);
}
