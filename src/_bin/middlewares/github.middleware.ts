import { EOL } from "os";

import { type AsyncFunc } from "#src/utilities";

import {
  execute,
  getProjectName,
  isLibrary,
  removeFile,
  upsertFile,
  upsertFolder,
} from "../utilities";

export default async function githubMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const [library] = await Promise.all([isLibrary(), upsertFolder(".github")]);

  await Promise.all([
    upsertFile(
      ".gitignore",
      !library ? gitignore_app : gitignore_lib,
      regenerate && !ignore.includes(".gitignore"),
    ),
    upsertFile(".github/README.md", readme, false),
    upsertFile(
      ".github/CHANGELOG.md",
      await createChangelogFile(),
      regenerate && !ignore.includes(".github/CHANGELOG.md"),
    ),
    upsertFolder(".github/workflows")
      .then(() => (!library ? "deploy-app.yml" : "publish-lib.yml"))
      .then((workflowName) => `.github/workflows/${workflowName}`)
      .then((fileName) =>
        upsertFile(
          fileName,
          !library ? deploy_app : publish_lib,
          regenerate && !ignore.includes(fileName),
        ),
      ),
    Promise.resolve(
      ".github/workflows/continuous-integration-and-deployment.yml",
    ).then((f) => (!ignore.includes(f) ? removeFile(f) : Promise.resolve())),
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
  const tagRegexp = /^v([0-9]+)\.([0-9]+)\.([0-9]+)$/;

  function filterTags(tag: string): boolean {
    return tagRegexp.test(tag);
  }

  function sortTags(tag1: string, tag2: string): number {
    const tagInfo1 = tagRegexp.exec(tag1);
    const tagInfo2 = tagRegexp.exec(tag2);

    for (let i = 1; i < 4; i++) {
      const result = +tagInfo1![i] - +tagInfo2![i];
      if (result === 0) continue;
      return -result;
    }

    return 0;
  }

  const commitRegexp = /^"(?:chore|feat|fix|refactor)(?:\((.*)\))?!?:\s(.*)"$/;

  function filterCommits(commit: string): boolean {
    return commitRegexp.test(commit);
  }

  function transformCommit(commit: string): string {
    const commitInfo = commitRegexp.exec(commit);
    const scope = commitInfo![1];
    const message = commitInfo![2];
    return `- ${scope !== undefined ? `**${scope}**: ` : ""}${message}`;
  }

  const projectName = await getProjectName().then((name) =>
    name.replace("@", ""),
  );

  const initialCommit = await execute(
    "git rev-list --max-parents=0 HEAD",
    false,
  ).then((commit) => commit?.replace(EOL, ""));

  const tags = await execute("git tag --merged", false)
    .then((tags) => tags?.split(EOL) ?? [])
    .then((tags) => tags.filter(filterTags))
    .then((tags) => tags.sort(sortTags));

  const fragments = await Promise.all(
    tags.map(async (tag, index) => {
      const nextTag = index < tags.length - 1 ? tags[index + 1] : initialCommit;

      const commits = await execute(
        `git log --pretty=format:"%s" ${tag}...${nextTag}`,
        false,
      )
        .then((commits) => commits?.split(EOL) ?? [])
        .then((commits) => commits.slice(1))
        .then((commits) => commits.filter(filterCommits))
        .then((commits) => commits.map(transformCommit))
        .then((commits) => commits.join(EOL));

      const date = await execute(
        `git show --no-patch --format=%ci ${tag}`,
        false,
      )
        .then((date) => new Date(date))
        .then((date) =>
          date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        );

      return `## [${tag}](https://github.com/${projectName}/tree/${tag})

> ${date}

${commits}
`;
    }),
  ).then((fragments) => fragments.join(EOL));

  return `# Changelog

All notable changes to this project will be documented in this file.
${fragments === "" ? "" : `${EOL}${fragments}`}`;
}

const deploy_app = `name: Deploy application
permissions: write-all

on:
  workflow_dispatch:
  push:
    tags:
      - v*

jobs:
  deploy-app:
    name: Deploy application
    runs-on: ubuntu-latest
    concurrency:
      group: \${{ github.workflow }}-deploy-app
      cancel-in-progress: true

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
          pattern: v(.*)
          replace-with: $1
          string: \${{ github.ref_name }}

      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          cache: npm
          node-version: 20
          registry-url: https://npm.pkg.github.com

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

      - name: Create release
        if: \${{ github.event_name != 'workflow_dispatch' }}
        uses: ncipollo/release-action@v1
        with:
          name: Version \${{ steps.get-version-from-tag.outputs.replaced }}
          tag: \${{ github.ref_name }}
          token: \${{ secrets.GITHUB_TOKEN }}

      - name: Configure pages
        uses: actions/configure-pages@v5

      - name: Upload build artifact
        uses: actions/upload-pages-artifact@v3
        with:
          name: github-pages
          path: out
          retention-days: 1

      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
`;

const publish_lib = `name: Publish library
permissions: write-all

on:
  push:
    tags:
      - v*

jobs:
  publish-lib:
    name: Publish library
    runs-on: ubuntu-latest
    concurrency:
      group: \${{ github.workflow }}-publish-lib
      cancel-in-progress: true

    steps:
      - name: Get version from tag
        id: get-version-from-tag
        uses: frabert/replace-string-action@v2
        with:
          pattern: v(.*)
          string: \${{ github.ref_name }}
          replace-with: $1

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
          node-version: 20
          registry-url: https://npm.pkg.github.com

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

      - name: Create release
        uses: ncipollo/release-action@v1
        with:
          name: Version \${{ steps.get-version-from-tag.outputs.replaced }}
          tag: \${{ github.ref_name }}
          token: \${{ secrets.GITHUB_TOKEN }}

      - name: Publish
        run: npm publish
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`;
