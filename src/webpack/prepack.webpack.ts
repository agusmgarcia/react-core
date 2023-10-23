import { execute } from "../_utils";
import withContext from "./withContext.webpack";

const COMMAND = "webpack --mode=production";

export default function prepack(): Promise<void> {
  return withContext(() => execute(COMMAND, true));
}
