import { EOL } from "os";

import regenerate from "./_regenerate";
import run from "./_run";
import { execute, git } from "./utils";

export default async function deploy(): Promise<void> {
  if (!(await git.isCurrentBranchSynced())) {
    console.error("Your branch must be in synced with remote");
    return;
  }

  const typeOfNewVersion = await git
    .getTags({ merged: true })
    .then((tags) => tags.at(tags.length - 1))
    .then(git.getCommits)
    .then(findTypeOfNewVersion);

  const newTag = await execute(`npm version ${typeOfNewVersion}`, false)
    .then((tag) => tag.replace(EOL, ""))
    .then(validateTag);

  if (!newTag) return;

  await regenerate();

  await run(
    false,
    () => git.deleteTag(newTag),
    () => git.createCommit("chore: bump package version", { amend: true }),
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

function validateTag(tag: string): string | undefined {
  try {
    git.getTagInfo(tag);
    return tag;
  } catch {
    console.error(
      `There was an error creating the tag ${tag}. It probably already exists`,
    );
    return undefined;
  }
}

deploy();
