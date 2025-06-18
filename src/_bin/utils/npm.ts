import { EOL } from "os";

import execute from "./execute";
import * as git from "./git";

export async function getNewTag(
  typeOfNewVersion: "major" | "minor" | "patch",
): Promise<string | undefined> {
  const tag = await execute(
    `npm version --no-git-tag-version ${typeOfNewVersion}`,
    false,
  ).then((tag) => tag.replace(EOL, ""));

  try {
    git.getTagInfo(tag);
    return tag;
  } catch {
    console.error(`There was an error creating the tag ${tag}`);
    return undefined;
  }
}

export async function getVersion(
  dependency: string,
): Promise<string | undefined> {
  return await execute(`npm view ${dependency} version`, false)
    .then((result) => result.split(EOL))
    .then((result) => result.at(-2))
    .then((result) => result?.replace(/^.+?\s'(.+?)'$/, "$1"))
    .catch(() => undefined);
}
