import { args, git, npm, question } from "./utils";

export default async function deploy(): Promise<void> {
  if (!(await git.isInsideRepository())) return;

  if (!(await git.isCurrentBranchSynced())) {
    console.error("Your branch must be in synced with remote");
    return;
  }

  const lastTagMerged = await git
    .getTags({ merged: true })
    .then((tags) => tags.at(-1));

  const typeOfNewVersion = await git
    .getCommits(lastTagMerged)
    .then((commits) => commits.reverse())
    .then(findTypeOfNewVersion);

  if (!typeOfNewVersion) return;

  try {
    await validatePositionOfTheTag(typeOfNewVersion, lastTagMerged);
  } catch (error: any) {
    console.error(error.message);
    return;
  }

  const newTag = await npm.getNewTag(typeOfNewVersion);
  if (!newTag) return;

  await git.createCommit("chore: bump package version");
  await git.createTag(`${newTag}-temp`);
  await npm.regenerate();
  await git.deleteTag(`${newTag}-temp`);
  await git.createCommit("chore: bump package version", { amend: true });
  await git.createTag(newTag);
  await checkoutTagAndDeleteCurrentBranch(newTag);
  await createNextRelease(typeOfNewVersion, newTag, lastTagMerged);
}

function findTypeOfNewVersion(
  commits: string[],
): "major" | "minor" | "patch" | undefined {
  if (!commits.length) return undefined;

  let bump: NonNullable<ReturnType<typeof findTypeOfNewVersion>> = "patch";

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

async function validatePositionOfTheTag(
  typeOfNewVersion: NonNullable<ReturnType<typeof findTypeOfNewVersion>>,
  lastTagMerged: string | undefined,
): Promise<void> {
  const allTags = await git.getTags().then((tags) => tags.map(git.getTagInfo));
  if (!allTags.length) return;

  const lastTagMergedInfo = !!lastTagMerged
    ? git.getTagInfo(lastTagMerged)
    : { major: 0, minor: 0, patch: 0 };

  if (typeOfNewVersion === "major") {
    const lastTag = allTags.at(-1);

    if (!lastTag) throw new Error("Unreachable scenario");

    if (lastTagMergedInfo.major !== lastTag.major)
      throw new Error(
        `The major release needs to be created from v${lastTag.major}.x.x`,
      );

    return;
  }

  if (typeOfNewVersion === "minor") {
    const lastTagOfMajor = allTags
      .filter((t) => t.major === lastTagMergedInfo.major)
      .at(-1);

    if (!lastTagOfMajor) throw new Error("Unreachable scenario");

    if (lastTagMergedInfo.minor !== lastTagOfMajor.minor)
      throw new Error(
        `The minor release needs to be created from v${lastTagOfMajor.major}.${lastTagOfMajor.minor}.x`,
      );

    return;
  }

  const lastTagOfMinor = allTags
    .filter(
      (t) =>
        t.major === lastTagMergedInfo.major &&
        t.minor === lastTagMergedInfo.minor,
    )
    .at(-1);

  if (!lastTagOfMinor) throw new Error("Unreachable scenario");

  if (lastTagMergedInfo.patch !== lastTagOfMinor.patch)
    throw new Error(
      `The patch release needs to be created from v${lastTagOfMinor.major}.${lastTagOfMinor.minor}.${lastTagOfMinor.patch}`,
    );
}

async function checkoutTagAndDeleteCurrentBranch(
  newTag: string,
): Promise<void> {
  const defaultBranch = await git.getDefaultBranch();
  const currentBranch = await git.getCurrentBranch();

  if (!!defaultBranch && currentBranch === defaultBranch) return;

  await git.checkout(newTag);
  if (!!currentBranch) await git.deleteBranch(currentBranch);
}

async function createNextRelease(
  typeOfNewVersion: NonNullable<ReturnType<typeof findTypeOfNewVersion>>,
  newTag: string,
  lastTagMerged: string | undefined,
): Promise<void> {
  if (!lastTagMerged) return;
  if (typeOfNewVersion === "major") return;

  const newTagInfo = git.getTagInfo(newTag);
  const allTags = await git.getTags().then((tags) => tags.map(git.getTagInfo));

  let nextTagInfo: ReturnType<typeof git.getTagInfo> | undefined;

  if (typeOfNewVersion === "minor") {
    const tagsGroupedByMajor = allTags.reduce<
      Record<number, ReturnType<typeof git.getTagInfo>[]>
    >((result, tag) => {
      result[tag.major] ||= [];
      result[tag.major].push(tag);
      return result;
    }, {});

    nextTagInfo = tagsGroupedByMajor[newTagInfo.major + 1]?.at(-1);
  } else {
    const tagsGroupedByMajorAndMinor = allTags.reduce<
      Record<number, Record<number, ReturnType<typeof git.getTagInfo>[]>>
    >((result, tag) => {
      result[tag.major] ||= {};
      result[tag.major][tag.minor] ||= [];
      result[tag.major][tag.minor].push(tag);
      return result;
    }, {});

    nextTagInfo =
      tagsGroupedByMajorAndMinor[newTagInfo.major][newTagInfo.minor + 1]?.at(
        -1,
      ) || tagsGroupedByMajorAndMinor[newTagInfo.major + 1]?.[0]?.at(-1);
  }

  if (!nextTagInfo) return;
  const nextTag = `v${nextTagInfo.major}.${nextTagInfo.minor}.${nextTagInfo.patch}`;
  const interactive = args.has("interactive");

  if (interactive) {
    const response = await question(`Merge changes into ${nextTag}? (Y/n)`);

    if (response === "n") {
      console.log("Deploy finished!");
      return;
    }
  }

  await git.checkout(nextTag);

  try {
    await git.cherryPick(lastTagMerged, `${newTag}~1`);
  } catch (error) {
    console.error(error);
    return;
  }

  if (interactive) {
    const response = await question(`Deploy changes into ${nextTag}? (Y/n)`);
    if (response === "n") {
      console.log(
        "Deploy stopped! You can add more commits to the current branch and then run npm run deploy again",
      );
      return;
    }
  }

  await deploy();
}

deploy();
