import { EOL } from "os";

import { type AsyncFunc } from "#src/utils";

import { files, folders, getPackageJSON, git, isLibrary } from "../utils";

export default async function githubMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const [library] = await Promise.all([
    isLibrary(),
    folders.upsertFolder(".github"),
  ]);

  await Promise.all([
    files.upsertFile(
      ".gitignore",
      !library ? gitignore_app : gitignore_lib,
      regenerate && !ignore.includes(".gitignore"),
    ),
    files.upsertFile(".github/README.md", readme, {
      create: regenerate && !ignore.includes(".github/README.md"),
      update: false,
    }),
    files.upsertFile(
      ".github/CHANGELOG.md",
      await createChangelogFile(),
      regenerate && !ignore.includes(".github/CHANGELOG.md"),
    ),
    folders
      .upsertFolder(".github/workflows")
      .then(() => (!library ? "deploy-app.yml" : "publish-lib.yml"))
      .then((workflowName) => `.github/workflows/${workflowName}`)
      .then((fileName) =>
        files.upsertFile(
          fileName,
          !library ? deploy_app : publish_lib,
          regenerate && !ignore.includes(fileName),
        ),
      ),
    Promise.resolve(
      ".github/workflows/continuous-integration-and-deployment.yml",
    ).then((f) =>
      !ignore.includes(f) ? files.removeFile(f) : Promise.resolve(),
    ),
  ]);

  await next();
}

const gitignore_app = `.env.local
.next
node_modules
out`;

const gitignore_lib = `.next
bin
dist
node_modules
*.tgz`;

const readme = "";

async function createChangelogFile(): Promise<string> {
  function filterCommits(commit: string): boolean {
    return (
      commit !== '"chore: bump package version"' &&
      commit !== '"chore(CHANGELOG.md): update file"'
    );
  }

  function transformCommit(commit: string): string {
    const commitInfo = git.getCommitInfo(commit);
    return `- ${!!commitInfo.scope ? `**${commitInfo.scope}**: ` : ""}${commitInfo.message}`;
  }

  const projectName = await getPackageJSON()
    .then((json) => json.name)
    .then((name) => name?.replace("@", ""));

  if (!projectName)
    throw "Project name must be defined within the package.json file";

  let fragments = "";

  if (await git.isInsideRepository()) {
    const initialCommit = await git.getInitialCommit();

    const tags = await git
      .getTags({ merged: true })
      .then((tags) => tags.reverse());

    fragments = await Promise.all(
      tags.map(async (tag, index) => {
        const nextTag =
          index < tags.length - 1 ? tags[index + 1] : initialCommit;

        const commits = await git
          .getCommits(tag, nextTag)
          .then((commits) => commits.filter(filterCommits))
          .then((commits) => commits.map(transformCommit))
          .then((commits) => commits.join(EOL));

        const date = await git.getCreationDate(tag).then((date) =>
          date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            timeZone: "UTC",
            year: "numeric",
          }),
        );

        tag = tag.replace("-temp", "");

        return `## [${tag}](https://github.com/${projectName}/tree/${tag})

> ${date}

${!!commits ? commits : "- No compatible changes to show"}
`;
      }),
    ).then((fragments) => fragments.join(EOL));
  }

  return `# Changelog

All notable changes to this project will be documented in this file.
${!fragments ? "" : `${EOL}${fragments}`}`;
}

const deploy_app = `name: Deploy app
permissions: write-all

on:
  push:
    tags:
      - v[0-9]+.[0-9]+.[0-9]+
  workflow_dispatch:

concurrency:
  group: \${{ github.workflow }}
  cancel-in-progress: true

jobs:
  deploy-app:
    name: Deploy app
    runs-on: ubuntu-latest

    steps:
      - name: Check if the type is 'tag'
        if: \${{ github.event_name == 'workflow_dispatch' && github.ref_type != 'tag' }}
        run: |
          echo "::error::Workflow needs to be dispatched from a tag"
          exit 1
        shell: bash

      - name: Get version from tag
        id: get-version-from-tag
        uses: frabert/replace-string-action@v2
        with:
          pattern: ^v(\\d+)\\.(\\d+)\\.(\\d+)$
          replace-with: $1.$2.$3
          string: \${{ github.ref_name }}

      - name: Checkout
        uses: actions/checkout@v4

      - name: Extract version from package
        id: extract-version-from-package
        uses: sergeysova/jq-action@v2
        with:
          cmd: jq .version package.json -r

      - name: Verify versions match
        if: \${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}
        run: |
          echo "::error::Version in the package.json and tag don't match"
          exit 1
        shell: bash

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          cache: npm
          node-version: 22.14

      - name: Install dependencies
        run: npm ci --ignore-scripts
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Check
        run: npm run check
        shell: bash

      - name: Test
        run: npm test
        shell: bash

      - name: Build
        run: npm run build
        shell: bash
        env:
          BASE_PATH: /\${{ github.event.repository.name }}
          NEXT_PUBLIC_APP_VERSION: \${{ steps.get-version-from-tag.outputs.replaced }}

      - name: Configure pages
        uses: actions/configure-pages@v5
        with:
          token: \${{ secrets.GITHUB_TOKEN }}

      - name: Upload build artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: out

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
        with:
          token: \${{ secrets.GITHUB_TOKEN }}
`;

const publish_lib = `name: Publish lib
permissions: write-all

on:
  push:
    tags:
      - v[0-9]+.[0-9]+.[0-9]+

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref_name }}
  cancel-in-progress: true

jobs:
  publish-lib:
    name: Publish lib
    runs-on: ubuntu-latest

    steps:
      - name: Get version from tag
        id: get-version-from-tag
        uses: frabert/replace-string-action@v2
        with:
          pattern: ^v(\\d+)\\.(\\d+)\\.(\\d+)$
          replace-with: $1.$2.$3
          string: \${{ github.ref_name }}

      - name: Checkout
        uses: actions/checkout@v4

      - name: Extract version from package
        id: extract-version-from-package
        uses: sergeysova/jq-action@v2
        with:
          cmd: jq .version package.json -r

      - name: Verify versions match
        if: \${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}
        run: |
          echo "::error::Version in the package.json and tag don't match"
          exit 1
        shell: bash

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          cache: npm
          node-version: 22.14

      - name: Install dependencies
        run: npm ci --ignore-scripts
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Check
        run: npm run check
        shell: bash

      - name: Test
        run: npm test
        shell: bash

      - name: Publish
        run: npm publish
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
