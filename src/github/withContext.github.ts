import { createFolder, exists, isLibrary, writeFile } from "../_utils";

export default async function withContext<TResult>(
  callback: () => TResult | Promise<TResult>,
  options: { skip: string[] },
): Promise<TResult> {
  await exists(".github").then((githubExists) =>
    !githubExists ? createFolder(".github") : Promise.resolve(),
  );

  await Promise.all([
    exists(".github/README.md").then((readmeExists) =>
      writeFile(".github/README.md", readme, readmeExists),
    ),
    exists(".github/CHANGELOG.md").then((changelogExists) =>
      writeFile(".github/CHANGELOG.md", changelog, changelogExists),
    ),
    exists(".github/workflows")
      .then((workflowsExists) =>
        !workflowsExists
          ? createFolder(".github/workflows")
          : Promise.resolve(),
      )
      .then(isLibrary)
      .then((library) =>
        writeFile(
          ".github/workflows/continuous-integration-and-deployment.yml",
          !library ? deployApp : publishLib,
          options.skip.includes("continuous-integration-and-deployment.yml"),
        ),
      ),
  ]);

  return await callback();
}

const readme = "";

const changelog = `# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0](https://github.com/<OWNER>/<NAME>/tree/v1.0.0)
`;

const deployApp = `name: Deploy application
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

      - name: Checkout
        uses: actions/checkout@v3.3.0

      - name: Setup Node
        uses: actions/setup-node@v3.6.0
        with:
          cache: npm
          node-version: 16
          registry-url: https://npm.pkg.github.com
          scope: "@agusmgarcia"

      - name: Install dependencies
        run: npm ci --ignore-scripts
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Lint
        run: npm run check
        shell: bash

      - name: Get version from tag
        id: get-version-from-tag
        uses: frabert/replace-string-action@v2.4
        with:
          pattern: v(.*)
          replace-with: $1
          string: \${{ github.ref_name }}

      - name: Build
        run: npm run build
        shell: bash
        env:
          NEXT_PUBLIC_APP_VERSION: \${{ steps.get-version-from-tag.outputs.replaced }}

      - name: Create release
        if: \${{ github.event_name != 'workflow_dispatch' }}
        uses: ncipollo/release-action@v1.12.0
        with:
          name: Version \${{ steps.get-version-from-tag.outputs.replaced }}
          tag: \${{ github.ref_name }}
          token: \${{ secrets.GITHUB_TOKEN }}

      - name: Deploy
        uses: w9jds/firebase-action@v2.2.2
        with:
          args: deploy
        env:
          FIREBASE_TOKEN: \${{ secrets.FIREBASE_TOKEN }}
`;

const publishLib = `name: Publish library
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
      - name: Checkout
        uses: actions/checkout@v3.3.0

      - name: Setup Node
        uses: actions/setup-node@v3.6.0
        with:
          cache: npm
          node-version: 16
          registry-url: https://npm.pkg.github.com
          scope: "@agusmgarcia"

      - name: Install dependencies
        run: npm ci --ignore-scripts
        shell: bash
        env:
          NODE_AUTH_TOKEN: \${{ secrets.GITHUB_TOKEN }}

      - name: Lint
        run: npm run check
        shell: bash

      - name: Get version from tag
        id: get-version-from-tag
        uses: frabert/replace-string-action@v2.4
        with:
          pattern: v(.*)
          string: \${{ github.ref_name }}
          replace-with: $1

      - name: Extract version from package
        id: extract-version-from-package
        uses: sergeysova/jq-action@v2
        with:
          cmd: jq .version package.json -r

      - name: Verify version match
        if: \${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}
        run: |
          echo "::error::Version in the package.json and tag don't match"
          exit 1
        shell: bash

      - name: Create release
        uses: ncipollo/release-action@v1.12.0
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
