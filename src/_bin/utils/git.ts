import { EOL } from "os";

import execute from "./execute";

// <=============================== BRANCHES ===============================> //

export async function deleteBranch(branch: string): Promise<void> {
  await execute(`git branch -D ${branch}`, true);

  const remote = await getRemote();
  if (!remote) return;

  await execute(`git push --delete ${remote} ${branch} --no-verify`, true);
}

export async function getCurrentBranch(): Promise<string | undefined> {
  return await execute("git branch --show-current", false).then((branch) =>
    branch?.replace(EOL, ""),
  );
}

export async function getDefaultBranch(): Promise<string | undefined> {
  return await getRemote().then((remote) =>
    !!remote
      ? execute(`git remote show ${remote}`, false).then((branch) =>
          branch
            .split(EOL)
            .find((line) => line.startsWith("  HEAD branch: "))
            ?.replace("  HEAD branch: ", ""),
        )
      : undefined,
  );
}

export async function isCurrentBranchSynced(): Promise<boolean> {
  return await execute("git fetch -p -P", true)
    .then(() => execute("git diff @{upstream}", false))
    .then((diffs) => !diffs)
    .catch(() => true);
}

// <=============================== COMMITS ===============================> //

export async function cherryPick(
  initialCommit: string,
  lastCommit: string,
): Promise<void> {
  await execute(`git cherry-pick ${initialCommit}..${lastCommit}`, true);
}

const COMMIT_REGEXP = /^(chore|feat|fix|refactor)(?:\((.*)\))?(!)?:\s(.*)$/;

export async function getCommits(
  initialCommit?: string,
  lastCommit = "HEAD",
): Promise<string[]> {
  return await getDetailedCommits(initialCommit, lastCommit).then((commits) =>
    commits.map((c) => c.commit),
  );
}

export async function getDetailedCommits(
  initialCommit?: string,
  lastCommit = "HEAD",
): Promise<{ commit: string; sha: string }[]> {
  return await execute("git fetch -p -P", true)
    .then(() =>
      execute(
        !!initialCommit
          ? `git log --pretty=format:"%H-----%s" ${initialCommit}...${lastCommit}`
          : `git log --pretty=format:"%H-----%s" ${lastCommit}`,
        false,
      ),
    )
    .then((commits) => commits?.split(EOL) || [])
    .then((commits) =>
      commits.map((c) => {
        const [sha, commit] = c.replaceAll('"', "").split("-----");
        return { commit, sha };
      }),
    )
    .then((commits) => commits.reverse())
    .then((commits) => commits.filter(filterCommits));
}

function filterCommits({ commit }: { commit: string }): boolean {
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

export async function createCommit(
  message: string,
  options?: Partial<{ amend: boolean }>,
): Promise<void> {
  if (!COMMIT_REGEXP.test(message))
    throw `Message ${message} doesn't match the pattern`;

  await execute("git add .", true);
  await execute(
    `git commit${!!options?.amend ? " --amend" : ""} -m "${message}" -n`,
    true,
  );

  const remote = await getRemote();
  if (!remote) return;

  const branch = await getCurrentBranch();
  if (!branch) return;

  await execute(`git push -u ${remote} ${branch} --no-verify -f`, true);
}

export async function getInitialCommit(): Promise<string | undefined> {
  return await execute("git rev-list --max-parents=0 HEAD", false).then(
    (commit) => commit?.replace(EOL, "") || undefined,
  );
}

// <=============================== REMOTES ===============================> //

const REMOTE_URL_REGEXP =
  /^(.+?):\/\/(?:.+?:)?(?:.+?@)?(.+?)\/(.+?)\/(.+?).git$/;

export async function getRemote(): Promise<string | undefined> {
  return await execute("git remote", false)
    .then((remote) => remote.replace(EOL, ""))
    .catch(() => undefined);
}

export async function getRemoteURL(): Promise<string | undefined> {
  return await getRemote()
    .then((remote) =>
      !!remote ? execute(`git remote get-url ${remote}`, false) : undefined,
    )
    .then((remoteURL) => remoteURL?.replace(EOL, ""))
    .then((remoteURL) => {
      if (!remoteURL) return undefined;

      const matches = REMOTE_URL_REGEXP.exec(remoteURL);
      if (!matches || matches.length !== 5) return undefined;

      return `${matches[1]}://${matches[2]}/${matches[3]}/${matches[4]}`.toLowerCase();
    });
}

// <================================= TAGS =================================> //

const TAG_REGEXP = /^v(\d+)\.(\d+)\.(\d+)(-temp)?$/;

export async function getTags(
  options?: Partial<{ merged: boolean }>,
): Promise<string[]> {
  return await getDetailedTags(options).then((dts) => dts.map((dt) => dt.tag));
}

export async function getDetailedTags(
  options?: Partial<{ merged: boolean }>,
): Promise<{ sha: string; tag: string }[]> {
  const tags = await execute("git fetch -p -P", true)
    .then(() =>
      execute(`git tag ${!!options?.merged ? " --merged" : ""}`, false),
    )
    .then((tags) => tags?.split(EOL) || [])
    .then((tags) => tags.filter(filterTags))
    .then((tags) => tags.sort(sortTags));

  return await execute(`git rev-parse ${tags.join(" ")}`, false)
    .then((output) => output?.split(EOL) || [])
    .then((outputs) => outputs.filter((sha) => !!sha))
    .then((outputs) => outputs.map((sha, i) => ({ sha, tag: tags[i] })));
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

export async function createTag(tag: string): Promise<void> {
  if (!TAG_REGEXP.test(tag)) throw `Tag ${tag} doesn't match the pattern`;
  await execute(`git tag ${tag}`, true);

  const remote = await getRemote();
  if (!remote) return;

  await execute(`git push ${remote} ${tag} --no-verify`, true);
}

export async function deleteTag(tag: string): Promise<void> {
  await execute(`git tag --delete ${tag}`, true);

  const remote = await getRemote();
  if (!remote) return;

  await execute(`git push --delete ${remote} ${tag} --no-verify`, true);
}

// <================================ UTILS ================================> //

export async function checkout(sha: string): Promise<void> {
  await execute(`git checkout ${sha}`, true);
}

export async function getCreationDate(sha: string): Promise<Date> {
  return await execute(`git show --no-patch --format=%ci ${sha}`, false)
    .then((date) => date.split(EOL).at(-2) || "")
    .then((date) => new Date(date));
}

export async function isInsideRepository(): Promise<boolean> {
  return await execute("git rev-parse --is-inside-work-tree", false)
    .then((result) => result === `true${EOL}`)
    .catch(() => false);
}
