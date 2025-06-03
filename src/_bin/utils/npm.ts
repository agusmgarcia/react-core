import { EOL } from "os";

import execute from "./execute";
import * as git from "./git";

export async function format(): Promise<void> {
  await execute("npm run format", true);
}

export async function isDependencyInstalled(
  dependency: string,
  options?: { peer?: true },
): Promise<boolean> {
  return await execute(
    `npm list -p${!!options?.peer ? " --omit=dev --omit=optional" : ""} ${dependency}`,
    false,
  )
    .then((result) => result.replace(EOL, ""))
    .then((result) => !!result);
}

export async function install(
  dependency?: string,
  options?: { dev?: true },
): Promise<void> {
  await execute(
    `npm i${!!dependency ? ` ${dependency}` : ""}${!!options?.dev ? " --save-dev" : ""}`,
    true,
  );
}

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

export async function regenerate(): Promise<void> {
  await execute("npm run regenerate", true);
}

export async function uninstall(library: string): Promise<void> {
  await execute(`npm uninstall ${library}`, true);
}
