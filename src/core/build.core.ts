import { execute } from "../_utils";
import withContext from "./withContext.core";

const COMMAND = "del .next out && next build --no-lint";

export default function build(): Promise<void> {
  return withContext(() => execute(COMMAND, true));
}
