import { EOL } from "os";

import run from "./_run";
import { execute, git } from "./utilities";

export default async function deploy(): Promise<void> {
  const typeOfNewVersion = await git
    .getTags({ merged: true })
    .then((tags) => tags.at(tags.length - 1))
    .then(git.getCommits)
    .then(findTypeOfNewVersion);

  let newTag = "";

  await run(
    false,
    () =>
      execute(
        `npm version --no-commit-hooks --no-git-tag-version ${typeOfNewVersion}`,
        false,
      ).then((tag) => {
        newTag = tag.replace(EOL, "");
      }),
    () => git.createCommit("chore: bump package version"),
    () => git.createTag(newTag),
    () => execute("npm run regenerate", true),
    () => git.createCommit("chore: bump package version", { amend: true }),
    () => git.deleteTag(newTag),
    () => git.createTag(newTag),
    () => git.pushTag(newTag),
    () => git.getCurrentBranch().then(git.pushBranch),
  );
}

function findTypeOfNewVersion(commits: string[]): "major" | "minor" | "patch" {
  let bump: ReturnType<typeof findTypeOfNewVersion> = "patch";

  for (let i = 0; i < commits.length; i++) {
    const commitInfo = git.getCommitInfo(commits[i]);
    if (commitInfo.isBreakingChange) {
      bump = "major";
      break;
    }

    if (commitInfo.type === "feat") {
      bump = "minor";
      continue;
    }
  }

  return bump;
}

deploy();
