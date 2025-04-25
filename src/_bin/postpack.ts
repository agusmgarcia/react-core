import run from "./_run";
import { execute, getCore } from "./utils";

export default async function postpack(): Promise<void> {
  if ((await getCore()) !== "lib") return;
  await run("postpack", false, () =>
    execute(`del bin dist README.md CHANGELOG.md`, true),
  );
}

postpack();
