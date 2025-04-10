import { EOL } from "os";

import { type AsyncFunc, merges } from "#src/utils";

import { files, folders, getCore, git } from "../utils";

export default async function githubMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const [core] = await Promise.all([
    getCore(),
    folders.upsertFolder(".github"),
  ]);

  await Promise.all([
    files.upsertFile(
      ".gitignore",
      await createGitignoreFile(core),
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
      .then(() =>
        core === "app"
          ? "deploy-app.yml"
          : core === "azure-func"
            ? "deploy-azure-func.yml"
            : "publish-lib.yml",
      )
      .then((workflowName) => `.github/workflows/${workflowName}`)
      .then((fileName) =>
        files.upsertFile(
          fileName,
          core === "app"
            ? deploy_app
            : core === "azure-func"
              ? deploy_azure_func
              : publish_lib,
          regenerate && !ignore.includes(fileName),
        ),
      ),
    files.removeFile(
      ".github/workflows/continuous-integration-and-deployment.yml",
    ),
    core === "app"
      ? Promise.all([
          files.removeFile(".github/workflows/deploy-azure-func.yml"),
          files.removeFile(".github/workflows/publish-lib.yml"),
        ])
      : core === "azure-func"
        ? Promise.all([
            files.removeFile(".github/workflows/deploy-app.yml"),
            files.removeFile(".github/workflows/publish-lib.yml"),
          ])
        : Promise.all([
            files.removeFile(".github/workflows/deploy-app.yml"),
            files.removeFile(".github/workflows/deploy-azure-func.yml"),
          ]),
  ]);

  await next();
}

async function createGitignoreFile(
  core: Awaited<ReturnType<typeof getCore>>,
): Promise<string> {
  const gitignore = await files
    .readFile(".gitignore")
    .then((result) => (!!result ? result.split(EOL) : []));

  const source =
    core === "app"
      ? [".env.local", ".next", "node_modules", "out"]
      : core === "azure-func"
        ? [".next", "dist", "local.settings.json", "node_modules"]
        : [".next", "bin", "dist", "node_modules", "*.tgz"];

  return merges
    .deep(gitignore, source, {
      arrayConcat: true,
      arrayRemoveDuplicated: true,
      sort: true,
    })
    .join(EOL);
}

const readme = "";

async function createChangelogFile(): Promise<string> {
  function transformCommit({ commit }: { commit: string }): string {
    const commitInfo = git.getCommitInfo(commit);
    return `- ${!!commitInfo.scope ? `**${commitInfo.scope}**: ` : ""}${commitInfo.message}`;
  }

  const remoteURL = await git.getRemoteURL();

  let fragments = "";

  if (await git.isInsideRepository()) {
    const detailedTags = await git.getDetailedTags({ merged: true });

    const detailedCommits = await git.getDetailedCommits();

    fragments = await Promise.all(
      detailedTags
        .map(async (tag, index) => {
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
            .map(transformCommit)
            .reverse()
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

${!!commits ? commits : "- No compatible changes to show"}
`;
        })
        .reverse(),
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

const deploy_azure_func = `name: Deploy Azure func
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
  deploy-azure-func:
    name: Deploy Azure func
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

      - name: Azure login
        id: azure-login
        uses: azure/login@v2
        with:
          allow-no-subscriptions: \${{ vars.AZURE_ALLOW_NO_SUBSCRIPTIONS }}
          audience: \${{ vars.AZURE_AUDIENCE }}
          auth-type: \${{ vars.AZURE_AUTH_TYPE }}
          client-id: \${{ secrets.AZURE_CLIENT_ID }}
          creds: \${{ secrets.AZURE_CREDS }}
          environment: \${{ vars.AZURE_ENVIRONMENT }}
          tenant-id: \${{ secrets.AZURE_TENANT_ID }}
          subscription-id: \${{ secrets.AZURE_SUBSCRIPTION_ID }}

      - name: Add app settings
        uses: azure/appservice-settings@v1
        with:
          app-name: \${{ vars.AZURE_APP_NAME }}
          app-settings-json: |
            [
              {
                "name": "APP_VERSION",
                "value": "\${{ steps.get-version-from-tag.outputs.replaced }}",
                "slotSetting": false
              },
              {
                "name": "FUNCTIONS_EXTENSION_VERSION",
                "value": "~4",
                "slotSetting": false
              },
              {
                "name": "FUNCTIONS_WORKER_RUNTIME",
                "value": "node",
                "slotSetting": false
              },
              {
                "name": "WEBSITE_NODE_DEFAULT_VERSION",
                "value": "~22",
                "slotSetting": false
              }
            ]

      - name: Install dependencies
        run: npm ci --ignore-scripts --omit=dev
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Deploy function
        uses: azure/functions-action@v1
        with:
          app-name: \${{ vars.AZURE_APP_NAME }}
          respect-funcignore: true

      - name: Azure logout
        if: \${{ always() && steps.azure-login.conclusion == 'success' }}
        run: az logout
        shell: bash
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
