import { EOL } from "os";

import execute from "./execute";

export default function getCommits(
  initialCommit: string,
  lastCommit: string,
  format = "%s",
): Promise<string[]> {
  return execute(
    `git log --pretty=format:"${format}" ${initialCommit}...${lastCommit}`,
    false,
  ).then((commits) => commits?.split(EOL) ?? []);
}
