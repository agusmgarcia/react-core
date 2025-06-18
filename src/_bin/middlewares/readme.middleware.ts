import { capitalize } from "#src/utils";

import { getPackageJSON, git } from "../utils";
import createMiddleware from "./createMiddleware";

export default createMiddleware<string>({
  path: ".github/README.md",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

async function getTemplate(): Promise<string> {
  let name = "";

  const insideRepository = await git.isInsideRepository();
  if (insideRepository)
    name = await git
      .getRepositoryDetails()
      .then((details) => details?.name || "");

  if (!name)
    name = await getPackageJSON().then((packageJSON) => packageJSON.name || "");

  return `# ${name
    .split("-")
    .map((i) => capitalize(i))
    .join(" ")}`;
}
