import { execute } from "../_utils";
import withContext from "./withContext.github";

const COMMAND = "cpy README.md CHANGELOG.md ../.. --cwd=.github";

export default function prepack(options: { skip: string[] }): Promise<void> {
  return withContext(() => execute(COMMAND, true), options);
}
