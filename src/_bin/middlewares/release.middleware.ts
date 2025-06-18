import { files, sortProperties } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<Record<string, any>>({
  mapOutput: (output) =>
    sortProperties(output, [
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
    ]),
  path: ".github/workflows/release.yml",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function releaseMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([
    MIDDLEWARE(context),
    files.removeFile(
      ".github/workflows/continuous-integration-and-deployment.yml",
    ),
    files.removeFile(".github/workflows/deploy-app-func.yml"),
    files.removeFile(".github/workflows/deploy-azure-func.yml"),
    files.removeFile(".github/workflows/deploy-node-func.yml"),
    files.removeFile(".github/workflows/publish-lib.yml"),
  ]);
}

function getTemplate(context: Context): Record<string, any> {
  return context.core === "app"
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
                  NEXT_PUBLIC_BASE_PATH: "/${{ github.event.repository.name }}",
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
                  path: "dist",
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
        name: "Release",
        on: {
          push: {
            tags: ["v[0-9]+.[0-9]+.[0-9]+"],
          },
          workflow_dispatch: null,
        },
        permissions: "write-all",
      }
    : context.core === "azure-func"
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
          name: "Release",
          on: {
            push: {
              tags: ["v[0-9]+.[0-9]+.[0-9]+"],
            },
            workflow_dispatch: null,
          },
          permissions: "write-all",
        }
      : context.core === "lib"
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
            name: "Release",
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
            name: "Release",
            on: {
              push: {
                tags: ["v[0-9]+.[0-9]+.[0-9]+"],
              },
              workflow_dispatch: null,
            },
            permissions: "write-all",
          };
}
