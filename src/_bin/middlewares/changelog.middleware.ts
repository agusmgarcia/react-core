import { EOL } from "os";

import { git } from "../utils";
import createMiddleware from "./createMiddleware";

export default createMiddleware<string>({
  path: ".github/CHANGELOG.md",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

async function getTemplate(): Promise<string> {
  let fragments = "";

  if (await git.isInsideRepository()) {
    const [remoteURL, detailedTags, detailedCommits] = await Promise.all([
      git.getRemoteURL(),
      git.getDetailedTags({ merged: true }),
      git.getDetailedCommits(),
    ]);

    fragments = detailedTags
      .map((tag, index) => {
        const initialCommitIndex =
          detailedCommits.findIndex(
            (dc) => dc.sha === detailedTags[index - 1]?.sha,
          ) + 1;

        const lastCommitIndex = detailedCommits.findIndex(
          (dc) => dc.sha === tag.sha,
        );

        const commits = detailedCommits
          .slice(
            initialCommitIndex,
            detailedCommits[lastCommitIndex].commit ===
              "chore: bump package version"
              ? lastCommitIndex
              : lastCommitIndex + 1,
          )
          .map((c) => ({
            createdAt: c.createdAt,
            ...git.getCommitInfo(c.commit),
          }))
          .reverse();

        const breakingChangeCommits = commits
          .filter((c) => c.isBreakingChange)
          .map(transformCommit)
          .join(EOL);

        const featureCommits = commits
          .filter((c) => c.type === "feat" && !c.isBreakingChange)
          .map(transformCommit)
          .join(EOL);

        const fixCommits = commits
          .filter((c) => c.type !== "feat" && !c.isBreakingChange)
          .map(transformCommit)
          .join(EOL);

        const date = detailedCommits[
          lastCommitIndex
        ].createdAt.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          timeZone: "UTC",
          year: "numeric",
        });

        const tagValue = tag.tag.replace("-temp", "");

        return `## ${!!remoteURL ? `[${tagValue}](${remoteURL}/tree/${tagValue})` : tagValue}

> ${date}
${!breakingChangeCommits && !featureCommits && !fixCommits ? `${EOL}- No compatible changes to show${EOL}` : ""}
${!!breakingChangeCommits ? `### Breaking changes ❗️${EOL}${EOL}${breakingChangeCommits}${EOL}` : ""}
${!!featureCommits ? `### Features ✅${EOL}${EOL}${featureCommits}${EOL}` : ""}
${!!fixCommits ? `### Fixes 🎯${EOL}${EOL}${fixCommits}${EOL}` : ""}`;
      })
      .reverse()
      .join(EOL);
  }

  return `# Changelog

All notable changes to this project will be documented in this file.
${!fragments ? "" : `${EOL}${fragments}`}`;
}

function transformCommit({
  message,
  scope,
}: ReturnType<typeof git.getCommitInfo>): string {
  return `- ${!!scope ? `**${scope}**: ` : ""}${message}`;
}
