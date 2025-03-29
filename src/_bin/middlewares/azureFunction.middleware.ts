import { type AsyncFunc } from "#src/utils";

import {
  createObjectWithPropertiesSorted,
  files,
  folders,
  getCore,
} from "../utils";

export default async function azureFunctionMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await Promise.all([
    core === "azure-func"
      ? files.upsertFile(
          "host.json",
          await createHostFile(),
          regenerate && !ignore.includes("host.json"),
        )
      : files.removeFile("host.json"),
    core === "azure-func"
      ? files.upsertFile("local.settings.json", localSettingsJSON, {
          create: regenerate && !ignore.includes("local.settings.json"),
          update: false,
        })
      : files.removeFile("local.settings.json"),
    folders.upsertFolder("src").then(() =>
      core === "azure-func"
        ? files
            .upsertFile("src/index.ts", index, {
              create: regenerate && !ignore.includes("src/index.ts"),
              update: false,
            })
            .then(() => folders.upsertFolder("src/functions"))
            .then(() => folders.isEmpty("src/functions"))
            .then((empty) =>
              files.upsertFile("src/functions/httpTrigger1.ts", httpTrigger1, {
                create: empty && regenerate,
                update: false,
              }),
            )
        : deleteAzureFunctions(core),
    ),
    core === "azure-func"
      ? files.upsertFile(
          ".funcignore",
          funcignore,
          regenerate && !ignore.includes(".funcignore"),
        )
      : files.removeFile(".funcignore"),
  ]);

  await next();
}

async function createHostFile(): Promise<string> {
  let hostJSON = await files
    .readFile("host.json")
    .then((result) => (!!result ? JSON.parse(result) : undefined));

  if (!hostJSON) hostJSON = {};

  hostJSON.version = "2.0";

  if (!hostJSON.extensions) hostJSON.extensions = {};
  if (!hostJSON.extensions.http) hostJSON.extensions.http = { routePrefix: "" };

  hostJSON.extensionBundle = {
    id: "Microsoft.Azure.Functions.ExtensionBundle",
    version: "[4.*, 5.0.0)",
  };

  if (!hostJSON.logging) hostJSON.logging = {};
  if (!hostJSON.logging.applicationInsights)
    hostJSON.logging.applicationInsights = {};
  if (!hostJSON.logging.applicationInsights.samplingSettings)
    hostJSON.logging.applicationInsights.samplingSettings = {
      excludedTypes: "Request",
      isEnabled: true,
    };

  hostJSON = createObjectWithPropertiesSorted(hostJSON, ["version"]);

  return JSON.stringify(hostJSON, undefined, 2);
}

async function deleteAzureFunctions(
  core: Exclude<Awaited<ReturnType<typeof getCore>>, "azure-func">,
): Promise<void> {
  const indexFile = await files.readFile("src/index.ts");

  if (core === "app" || index === indexFile)
    await files.removeFile("src/index.ts");

  const insideSrc = await folders.readFolder("src");

  if (
    !insideSrc.length ||
    (insideSrc.length === 1 &&
      insideSrc[0] === "functions" &&
      (await folders
        .readFolder("src/functions")
        .then(
          async (insideFunctions) =>
            !insideFunctions.length ||
            (insideFunctions.length === 1 &&
              insideFunctions[0] === "httpTrigger1.ts" &&
              (await files.readFile("httpTrigger1.ts")) === httpTrigger1),
        )))
  )
    await folders.removeFolder("src");
}

const localSettingsJSON = `{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "APP_VERSION": "1.0.0",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
`;

const index = `import { app } from "@azure/functions";

app.setup({
  enableHttpStream: true,
});
`;

const httpTrigger1 = `import {
  app,
  type HttpRequest,
  type HttpResponseInit,
  type InvocationContext,
} from "@azure/functions";

export async function httpTrigger1(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(\`Http function processed request for url \"\${request.url}"\`);

  const name = request.query.get("name") || (await request.text()) || "world";

  return { body: \`Hello, \${name}!\` };
}

app.http("httpTrigger1", {
  authLevel: "anonymous",
  handler: httpTrigger1,
  methods: ["GET", "POST"],
});
`;

const funcignore = `__azurite_db*__.json
__blobstorage__
__queuestorage__
**/.*
node_modules
src
eslint.config.js
jest.config.js
local.settings.json
prettier.config.js
tsconfig.json
webpack.config.js`;
