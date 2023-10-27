import { execute } from "../_utils";
import withContext from "./withContext.core";

const COMMAND_1 = "del .next out";
const COMMAND_2 = "next build --no-lint";

export default function build(): Promise<void> {
  return withContext(() =>
    execute(COMMAND_1, true).then(() => execute(COMMAND_2, true)),
  );
}
