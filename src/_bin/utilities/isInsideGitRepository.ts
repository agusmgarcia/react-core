import { EOL } from "os";

import execute from "./execute";

export default async function isInsideGitRepository(): Promise<boolean> {
  return execute("git rev-parse --is-inside-work-tree", false)
    .then((result) => result === `true${EOL}`)
    .catch(() => false);
}
