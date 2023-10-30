import { execute } from "../_utils";
import withContext from "./withContext.prettier";

const COMMAND =
  "prettier . --cache --cache-location ./node_modules/.prettiercache --cache-strategy content --config ./.prettierrc --check";

export default function check(force: boolean): Promise<void> {
  return withContext(() => execute(COMMAND, true), force);
}
