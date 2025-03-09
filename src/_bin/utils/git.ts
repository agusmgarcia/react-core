import { EOL } from "os";

import execute from "./execute";

// <=============================== BRANCHES ===============================> //

export function getCurrentBranch(): Promise<string> {
  return execute("git branch --show-current", false).then((branch) =>
    branch.replace(EOL, ""),
  );
}

export function isCurrentBranchSynced(): Promise<boolean> {
  return execute("git diff @{upstream}", false).then((diffs) => !diffs);
}

export function pushBranch(branch: string): Promise<void> {
  return getRemote().then((remote) =>
    execute(`git push -u ${remote} ${branch} --no-verify`, true),
  );
}

// <=============================== COMMITS ===============================> //

const COMMIT_REGEXP = /^"(chore|feat|fix|refactor)(?:\((.*)\))?(!)?:\s(.*)"$/;

export function getCommits(
  initialCommit?: string,
  lastCommit = "HEAD",
  format = "%s",
): Promise<string[]> {
  return execute(
    !!initialCommit
      ? `git log --pretty=format:"${format}" ${initialCommit}...${lastCommit}`
      : `git log --pretty=format:"${format}" ${lastCommit}`,
    false,
  )
    .then((commits) => commits?.split(EOL) || [])
    .then((commits) => commits.filter(filterCommits));
}

function filterCommits(commit: string): boolean {
  return COMMIT_REGEXP.test(commit);
}

export function getCommitInfo(commit: string): {
  isBreakingChange: boolean;
  message: string;
  scope: string | undefined;
  type: "chore" | "feat" | "fix" | "refactor";
} {
  const commitInfo = COMMIT_REGEXP.exec(commit);
  if (!commitInfo) throw `Commit ${commit} doesn't match the pattern`;

  return {
    isBreakingChange: commitInfo[3] === "!",
    message: commitInfo[4],
    scope: commitInfo[2],
    type: commitInfo[1] as ReturnType<typeof getCommitInfo>["type"],
  };
}

export function createCommit(
  message: string,
  options?: Partial<{ amend: boolean }>,
): Promise<void> {
  message = `"${message}"`;

  if (!COMMIT_REGEXP.test(message))
    throw `Message ${message} doesn't match the pattern`;

  return execute("git add .", true).then(() =>
    execute(
      `git commit${!!options?.amend ? " --amend" : ""} -m ${message} -n`,
      true,
    ),
  );
}

export function getInitialCommit(): Promise<string | undefined> {
  return execute("git rev-list --max-parents=0 HEAD", false).then(
    (commit) => commit?.replace(EOL, "") || undefined,
  );
}

// <=============================== REMOTES ===============================> //

export function getRemote(): Promise<string> {
  return Promise.resolve("origin"); // TODO: get origin name.
}

// <================================= TAGS =================================> //

const TAG_REGEXP = /^v([0-9]+)\.([0-9]+)\.([0-9]+)$/;

export function getTags(
  options?: Partial<{ merged: boolean }>,
): Promise<string[]> {
  return execute(`git tag ${!!options?.merged ? " --merged" : ""}`, false)
    .then((tags) => tags?.split(EOL) || [])
    .then((tags) => tags.filter(filterTags))
    .then((tags) => tags.sort(sortTags));
}

function filterTags(tag: string): boolean {
  return TAG_REGEXP.test(tag);
}

function sortTags(tag1: string, tag2: string): number {
  const tagInfo1 = TAG_REGEXP.exec(tag1);
  const tagInfo2 = TAG_REGEXP.exec(tag2);

  if (!tagInfo1) throw `Tag ${tag1} doesn't match the pattern`;
  if (!tagInfo2) throw `Tag ${tag2} doesn't match the pattern`;

  for (let i = 1; i < 4; i++) {
    const result = +tagInfo2[i] - +tagInfo1[i];
    if (!result) continue;
    return -result;
  }

  return 0;
}

export function getTagInfo(tag: string): {
  major: number;
  minor: number;
  patch: number;
} {
  const tagInfo = TAG_REGEXP.exec(tag);
  if (!tagInfo) throw `Tag ${tag} doesn't match the pattern`;
  return { major: +tagInfo[1], minor: +tagInfo[2], patch: +tagInfo[3] };
}

export function createTag(tag: string): Promise<void> {
  if (!TAG_REGEXP.test(tag)) throw `Tag ${tag} doesn't match the pattern`;
  return execute(`git tag ${tag}`, true);
}

export function deleteTag(tag: string): Promise<void> {
  return execute(`git tag --delete ${tag}`, true);
}

export function pushTag(tag: string): Promise<void> {
  return getRemote().then((remote) =>
    execute(`git push ${remote} ${tag} --no-verify`, true),
  );
}

// <================================ UTILS ================================> //

export function isInsideRepository(): Promise<boolean> {
  return execute("git rev-parse --is-inside-work-tree", false)
    .then((result) => result === `true${EOL}`)
    .catch(() => false);
}

export function getCreationDate(tagOrCommit: string): Promise<Date> {
  return execute(`git show --no-patch --format=%ci ${tagOrCommit}`, false)
    .then((date) => date.split(EOL).at(-2) || "")
    .then((date) => new Date(date));
}
