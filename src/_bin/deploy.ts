import { EOL } from "os";

import run from "./_run";
import { execute, git } from "./utilities";

export default async function deploy(): Promise<void> {
  const typeOfNewVersion = await git
    .getTags()
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
    () => execute(`git commit -a -m "wip"`, true),
    () => execute(`git tag ${newTag}`, true),
    () => execute("npm run regenerate", true),
    () =>
      execute(`git commit -a --amend -m "chore: bump package version"`, true),
    () => execute(`git tag --delete ${newTag}`, true),
    () => execute(`git tag ${newTag}`, true),
    () => execute(`git push origin ${newTag}`, true), // TODO: get origin name.
    () =>
      execute("git branch --show-current", false).then(
        (branch) => execute(`git push origin ${branch}`, true), // TODO: get origin name.
      ),
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
