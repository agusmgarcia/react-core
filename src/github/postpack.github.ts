import { execute } from "../_utils";
import withContext from "./withContext.github";

const COMMAND = "del README.md CHANGELOG.md";

export default function postpack(): Promise<void> {
  return withContext(() => execute(COMMAND, true));
}
