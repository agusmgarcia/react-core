import { EOL } from "os";

import execute from "./execute";

const COMMIT_REGEXP = /^"(chore|feat|fix|refactor)(?:\((.*)\))?(!)?:\s(.*)"$/;

export function getCommits(
  initialCommit?: string,
  lastCommit = "HEAD",
  format = "%s",
): Promise<string[]> {
  return execute(
    initialCommit !== undefined
      ? `git log --pretty=format:"${format}" ${initialCommit}...${lastCommit}`
      : `git log --pretty=format:"${format}" ${lastCommit}`,
    false,
  )
    .then((commits) => commits?.split(EOL) ?? [])
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
  return {
    isBreakingChange: commitInfo![3] === "!",
    message: commitInfo![4],
    scope: commitInfo![2],
    type: commitInfo![1] as ReturnType<typeof getCommitInfo>["type"],
  };
}

const TAG_REGEXP = /^v([0-9]+)\.([0-9]+)\.([0-9]+)$/;

export function getTags(): Promise<string[]> {
  return execute("git tag --merged", false)
    .then((tags) => tags?.split(EOL) ?? [])
    .then((tags) => tags.filter(filterTags))
    .then((tags) => tags.sort(sortTags));
}

function filterTags(tag: string): boolean {
  return TAG_REGEXP.test(tag);
}

function sortTags(tag1: string, tag2: string): number {
  const tagInfo1 = TAG_REGEXP.exec(tag1);
  const tagInfo2 = TAG_REGEXP.exec(tag2);

  for (let i = 1; i < 4; i++) {
    const result = +tagInfo2![i] - +tagInfo1![i];
    if (result === 0) continue;
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
  return { major: +tagInfo![1], minor: +tagInfo![2], patch: +tagInfo![3] };
}

export function isInsideRepository(): Promise<boolean> {
  return execute("git rev-parse --is-inside-work-tree", false)
    .then((result) => result === `true${EOL}`)
    .catch(() => false);
}
