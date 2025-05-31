import { EOL } from "os";
import { parse, stringify } from "yaml";

import { type AsyncFunc, equals, merges } from "#src/utils";

import { files, folders, getCore, git, sortProperties } from "../utils";

export default async function githubMiddleware(
  _: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  const [core] = await Promise.all([
    getCore(),
    folders.upsertFolder(".github"),
  ]);

  await Promise.all([
    files.upsertFile(
      ".gitignore",
      await createGitignoreFile(core, regenerate),
      !!regenerate && !ignore.includes(".gitignore"),
    ),
    files.upsertFile(".github/README.md", readme, {
      create: !!regenerate && !ignore.includes(".github/README.md"),
      update: false,
    }),
    files.upsertFile(
      ".github/CHANGELOG.md",
      await createChangelogFile(regenerate),
      !!regenerate && !ignore.includes(".github/CHANGELOG.md"),
    ),
    folders
      .upsertFolder(".github/workflows")
      .then(() =>
        core === "app"
          ? "deploy-app.yml"
          : core === "azure-func"
            ? "deploy-azure-func.yml"
            : core === "lib"
              ? "publish-lib.yml"
              : "deploy-node.yml",
      )
      .then((workflowName) => `.github/workflows/${workflowName}`)
      .then(async (fileName) =>
        files.upsertFile(
          fileName,
          await createYAMLFile(fileName, core, regenerate),
          !!regenerate && !ignore.includes(fileName),
        ),
      ),
    files.removeFile(
      ".github/workflows/continuous-integration-and-deployment.yml",
      true,
    ),
    core === "app"
      ? Promise.all([
          files.removeFile(".github/workflows/deploy-azure-func.yml", true),
          files.removeFile(".github/workflows/publish-lib.yml", true),
          files.removeFile(".github/workflows/deploy-node.yml", true),
        ])
      : core === "azure-func"
        ? Promise.all([
            files.removeFile(".github/workflows/deploy-app.yml", true),
            files.removeFile(".github/workflows/publish-lib.yml", true),
            files.removeFile(".github/workflows/deploy-node.yml", true),
          ])
        : core === "lib"
          ? Promise.all([
              files.removeFile(".github/workflows/deploy-app.yml", true),
              files.removeFile(".github/workflows/deploy-azure-func.yml", true),
              files.removeFile(".github/workflows/deploy-node.yml", true),
            ])
          : Promise.all([
              files.removeFile(".github/workflows/deploy-app.yml", true),
              files.removeFile(".github/workflows/deploy-azure-func.yml", true),
              files.removeFile(".github/workflows/publish-lib.yml", true),
            ]),
  ]);

  await next();
}

async function createGitignoreFile(
  core: Awaited<ReturnType<typeof getCore>>,
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const gitignore =
    regenerate === "soft"
      ? await files
          .readFile(".gitignore")
          .then((result) => (!!result ? result.split(EOL) : []))
      : [];

  const source =
    core === "app"
      ? [".env*.local", ".next", "node_modules", "out"]
      : core === "azure-func"
        ? ["dist", "local.settings.json", "node_modules"]
        : core === "lib"
          ? ["bin", "dist", "node_modules", "*.tgz"]
          : [".env*.local", "dist", "node_modules"];

  return merges.deep(gitignore, source, { sort: true }).join(EOL);
}

const readme = "";

async function createChangelogFile(
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  function transformCommit({ commit }: { commit: string }): string {
    const commitInfo = git.getCommitInfo(commit);
    return `- ${!!commitInfo.scope ? `**${commitInfo.scope}**: ` : ""}${commitInfo.message}`;
  }

  let fragments = "";

  if (await git.isInsideRepository()) {
    const remoteURL = await git.getRemoteURL();
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

async function createYAMLFile(
  fileName: string,
  core: Awaited<ReturnType<typeof getCore>>,
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const yaml =
    regenerate === "soft"
      ? await files
          .readFile(`.github/workflows/${fileName}`)
          .then((result) => (!!result ? parse(EOL) : {}))
      : {};

  const source = sortProperties(
    core === "app"
      ? {
          concurrency: {
            "cancel-in-progress": true,
            group: "${{ github.workflow }}",
          },
          jobs: {
            "deploy-app": {
              name: "Deploy app",
              "runs-on": "ubuntu-latest",
              steps: [
                {
                  if: "${{ github.event_name == 'workflow_dispatch' && github.ref_type != 'tag' }}",
                  name: "Check if the type is 'tag'",
                  run: 'echo "::error::Workflow needs to be dispatched from a tag"\nexit 1\n',
                  shell: "bash",
                },
                {
                  id: "get-version-from-tag",
                  name: "Get version from tag",
                  uses: "frabert/replace-string-action@v2",
                  with: {
                    pattern: "^v(\\d+)\\.(\\d+)\\.(\\d+)$",
                    "replace-with": "$1.$2.$3",
                    string: "${{ github.ref_name }}",
                  },
                },
                {
                  name: "Checkout",
                  uses: "actions/checkout@v4",
                },
                {
                  id: "extract-version-from-package",
                  name: "Extract version from package",
                  uses: "sergeysova/jq-action@v2",
                  with: {
                    cmd: "jq .version package.json -r",
                  },
                },
                {
                  if: "${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}",
                  name: "Verify versions match",
                  run: 'echo "::error::Version in the package.json and tag don\'t match"\nexit 1\n',
                  shell: "bash",
                },
                {
                  name: "Setup Node",
                  uses: "actions/setup-node@v4",
                  with: {
                    cache: "npm",
                    "node-version": 22.14,
                  },
                },
                {
                  env: {
                    NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
                  },
                  name: "Install dependencies",
                  run: "npm ci --ignore-scripts",
                  shell: "bash",
                },
                {
                  name: "Check",
                  run: "npm run check",
                  shell: "bash",
                },
                {
                  name: "Test",
                  run: "npm test",
                  shell: "bash",
                },
                {
                  env: {
                    NEXT_PUBLIC_APP_VERSION:
                      "${{ steps.get-version-from-tag.outputs.replaced }}",
                    NEXT_PUBLIC_BASE_PATH:
                      "/${{ github.event.repository.name }}",
                  },
                  name: "Build",
                  run: "npm run build",
                  shell: "bash",
                },
                {
                  name: "Configure pages",
                  uses: "actions/configure-pages@v5",
                  with: {
                    token: "${{ secrets.GITHUB_TOKEN }}",
                  },
                },
                {
                  name: "Upload build artifact",
                  uses: "actions/upload-pages-artifact@v3",
                  with: {
                    path: "out",
                  },
                },
                {
                  name: "Deploy to GitHub Pages",
                  uses: "actions/deploy-pages@v4",
                  with: {
                    token: "${{ secrets.GITHUB_TOKEN }}",
                  },
                },
              ],
            },
          },
          name: "Deploy app",
          on: {
            push: {
              tags: ["v[0-9]+.[0-9]+.[0-9]+"],
            },
            workflow_dispatch: null,
          },
          permissions: "write-all",
        }
      : core === "azure-func"
        ? {
            concurrency: {
              "cancel-in-progress": true,
              group: "${{ github.workflow }}",
            },
            jobs: {
              "deploy-azure-func": {
                name: "Deploy Azure func",
                "runs-on": "ubuntu-latest",
                steps: [
                  {
                    if: "${{ github.event_name == 'workflow_dispatch' && github.ref_type != 'tag' }}",
                    name: "Check if the type is 'tag'",
                    run: 'echo "::error::Workflow needs to be dispatched from a tag"\nexit 1\n',
                    shell: "bash",
                  },
                  {
                    id: "get-version-from-tag",
                    name: "Get version from tag",
                    uses: "frabert/replace-string-action@v2",
                    with: {
                      pattern: "^v(\\d+)\\.(\\d+)\\.(\\d+)$",
                      "replace-with": "$1.$2.$3",
                      string: "${{ github.ref_name }}",
                    },
                  },
                  {
                    name: "Checkout",
                    uses: "actions/checkout@v4",
                  },
                  {
                    id: "extract-version-from-package",
                    name: "Extract version from package",
                    uses: "sergeysova/jq-action@v2",
                    with: {
                      cmd: "jq .version package.json -r",
                    },
                  },
                  {
                    if: "${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}",
                    name: "Verify versions match",
                    run: 'echo "::error::Version in the package.json and tag don\'t match"\nexit 1\n',
                    shell: "bash",
                  },
                  {
                    name: "Setup Node",
                    uses: "actions/setup-node@v4",
                    with: {
                      cache: "npm",
                      "node-version": 22.14,
                    },
                  },
                  {
                    env: {
                      NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
                    },
                    name: "Install dependencies",
                    run: "npm ci --ignore-scripts",
                    shell: "bash",
                  },
                  {
                    name: "Check",
                    run: "npm run check",
                    shell: "bash",
                  },
                  {
                    name: "Test",
                    run: "npm test",
                    shell: "bash",
                  },
                  {
                    name: "Build",
                    run: "npm run build",
                    shell: "bash",
                  },
                  {
                    id: "azure-login",
                    name: "Azure login",
                    uses: "azure/login@v2",
                    with: {
                      "allow-no-subscriptions":
                        "${{ vars.AZURE_ALLOW_NO_SUBSCRIPTIONS }}",
                      audience: "${{ vars.AZURE_AUDIENCE }}",
                      "auth-type": "${{ vars.AZURE_AUTH_TYPE }}",
                      "client-id": "${{ secrets.AZURE_CLIENT_ID }}",
                      creds: "${{ secrets.AZURE_CREDS }}",
                      environment: "${{ vars.AZURE_ENVIRONMENT }}",
                      "subscription-id": "${{ secrets.AZURE_SUBSCRIPTION_ID }}",
                      "tenant-id": "${{ secrets.AZURE_TENANT_ID }}",
                    },
                  },
                  {
                    name: "Add app settings",
                    uses: "azure/appservice-settings@v1",
                    with: {
                      "app-name": "${{ vars.AZURE_APP_NAME }}",
                      "app-settings-json":
                        '[\n  {\n    "name": "APP_VERSION",\n    "value": "${{ steps.get-version-from-tag.outputs.replaced }}",\n    "slotSetting": false\n  },\n  {\n    "name": "FUNCTIONS_EXTENSION_VERSION",\n    "value": "~4",\n    "slotSetting": false\n  },\n  {\n    "name": "FUNCTIONS_WORKER_RUNTIME",\n    "value": "node",\n    "slotSetting": false\n  },\n  {\n    "name": "WEBSITE_NODE_DEFAULT_VERSION",\n    "value": "~22",\n    "slotSetting": false\n  }\n]\n',
                    },
                  },
                  {
                    env: {
                      NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
                    },
                    name: "Install dependencies for production",
                    run: "npm ci --ignore-scripts --omit=dev",
                    shell: "bash",
                  },
                  {
                    name: "Deploy function",
                    uses: "azure/functions-action@v1",
                    with: {
                      "app-name": "${{ vars.AZURE_APP_NAME }}",
                      "respect-funcignore": true,
                    },
                  },
                  {
                    if: "${{ always() && steps.azure-login.conclusion == 'success' }}",
                    name: "Azure logout",
                    run: "az logout",
                    shell: "bash",
                  },
                ],
              },
            },
            name: "Deploy Azure func",
            on: {
              push: {
                tags: ["v[0-9]+.[0-9]+.[0-9]+"],
              },
              workflow_dispatch: null,
            },
            permissions: "write-all",
          }
        : core === "lib"
          ? {
              concurrency: {
                "cancel-in-progress": true,
                group: "${{ github.workflow }}-${{ github.ref_name }}",
              },
              jobs: {
                "publish-lib": {
                  name: "Publish lib",
                  "runs-on": "ubuntu-latest",
                  steps: [
                    {
                      id: "get-version-from-tag",
                      name: "Get version from tag",
                      uses: "frabert/replace-string-action@v2",
                      with: {
                        pattern: "^v(\\d+)\\.(\\d+)\\.(\\d+)$",
                        "replace-with": "$1.$2.$3",
                        string: "${{ github.ref_name }}",
                      },
                    },
                    {
                      name: "Checkout",
                      uses: "actions/checkout@v4",
                    },
                    {
                      id: "extract-version-from-package",
                      name: "Extract version from package",
                      uses: "sergeysova/jq-action@v2",
                      with: {
                        cmd: "jq .version package.json -r",
                      },
                    },
                    {
                      if: "${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}",
                      name: "Verify versions match",
                      run: 'echo "::error::Version in the package.json and tag don\'t match"\nexit 1\n',
                      shell: "bash",
                    },
                    {
                      name: "Setup Node",
                      uses: "actions/setup-node@v4",
                      with: {
                        cache: "npm",
                        "node-version": 22.14,
                      },
                    },
                    {
                      env: {
                        NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
                      },
                      name: "Install dependencies",
                      run: "npm ci --ignore-scripts",
                      shell: "bash",
                    },
                    {
                      name: "Check",
                      run: "npm run check",
                      shell: "bash",
                    },
                    {
                      name: "Test",
                      run: "npm test",
                      shell: "bash",
                    },
                    {
                      env: {
                        NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
                      },
                      name: "Publish",
                      run: "npm publish",
                      shell: "bash",
                    },
                  ],
                },
              },
              name: "Publish lib",
              on: {
                push: {
                  tags: ["v[0-9]+.[0-9]+.[0-9]+"],
                },
              },
              permissions: "write-all",
            }
          : {
              concurrency: {
                "cancel-in-progress": true,
                group: "${{ github.workflow }}",
              },
              jobs: {
                "deploy-node": {
                  name: "Deploy node",
                  "runs-on": "ubuntu-latest",
                  steps: [
                    {
                      if: "${{ github.event_name == 'workflow_dispatch' && github.ref_type != 'tag' }}",
                      name: "Check if the type is 'tag'",
                      run: 'echo "::error::Workflow needs to be dispatched from a tag"\nexit 1\n',
                      shell: "bash",
                    },
                    {
                      id: "get-version-from-tag",
                      name: "Get version from tag",
                      uses: "frabert/replace-string-action@v2",
                      with: {
                        pattern: "^v(\\d+)\\.(\\d+)\\.(\\d+)$",
                        "replace-with": "$1.$2.$3",
                        string: "${{ github.ref_name }}",
                      },
                    },
                    {
                      name: "Checkout",
                      uses: "actions/checkout@v4",
                    },
                    {
                      id: "extract-version-from-package",
                      name: "Extract version from package",
                      uses: "sergeysova/jq-action@v2",
                      with: {
                        cmd: "jq .version package.json -r",
                      },
                    },
                    {
                      if: "${{ steps.get-version-from-tag.outputs.replaced != steps.extract-version-from-package.outputs.value }}",
                      name: "Verify versions match",
                      run: 'echo "::error::Version in the package.json and tag don\'t match"\nexit 1\n',
                      shell: "bash",
                    },
                    {
                      name: "Setup Node",
                      uses: "actions/setup-node@v4",
                      with: {
                        cache: "npm",
                        "node-version": 22.14,
                      },
                    },
                    {
                      env: {
                        NODE_AUTH_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
                      },
                      name: "Install dependencies",
                      run: "npm ci --ignore-scripts",
                      shell: "bash",
                    },
                    {
                      name: "Check",
                      run: "npm run check",
                      shell: "bash",
                    },
                    {
                      name: "Test",
                      run: "npm test",
                      shell: "bash",
                    },
                    {
                      env: {
                        APP_VERSION:
                          "${{ steps.get-version-from-tag.outputs.replaced }}",
                      },
                      name: "Build",
                      run: "npm run build",
                      shell: "bash",
                    },
                  ],
                },
              },
              name: "Deploy node",
              on: {
                push: {
                  tags: ["v[0-9]+.[0-9]+.[0-9]+"],
                },
                workflow_dispatch: null,
              },
              permissions: "write-all",
            },
    [
      "name",
      "run-name",
      "description",
      "permissions",
      "defaults",
      "on",
      "concurrency",
      "env",
      "jobs",
      "jobs.*.name",
      "jobs.*.runs-on",
      "jobs.*.steps.name",
      "jobs.*.steps.if",
      "jobs.*.steps.continue-on-error",
      "jobs.*.steps.timeout-minutes",
      "jobs.*.steps.id",
      "jobs.*.steps.uses",
      "jobs.*.steps.with",
      "jobs.*.steps.run",
      "jobs.*.steps.shell",
      "jobs.*.steps.env",
    ],
  );

  return stringify(merges.deep(yaml, source, { array: { comparator } }), {
    lineWidth: 0,
    nullStr: "",
  });
}

function comparator(element1: any, element2: any): boolean {
  if (typeof element1 !== typeof element2) return false;
  if (typeof element1 !== "object" && typeof element2 !== "object")
    return equals.deep(element1, element2);
  if (!element1 && !element2) return true;
  if (!element1 || !element2) return false;
  if ("id" in element1 && "id" in element2) return element1.id === element2.id;
  if ("name" in element1 && "name" in element2)
    return element1.name === element2.name;
  return equals.deep(element1, element2);
}
