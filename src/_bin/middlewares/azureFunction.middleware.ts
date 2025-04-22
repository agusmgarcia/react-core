import { EOL } from "os";

import { type AsyncFunc, merges } from "#src/utils";

import { files, folders, getCore, git, sortProperties } from "../utils";

export default async function azureFunctionMiddleware(
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await Promise.all([
    core === "azure-func"
      ? files.upsertFile(
          "host.json",
          await createHostFile(regenerate),
          !!regenerate && !ignore.includes("host.json"),
        )
      : files.removeFile("host.json"),
    core === "azure-func"
      ? files.upsertFile(
          "local.settings.json",
          await createLocalSettingsFile(regenerate),
          !!regenerate && !ignore.includes("local.settings.json"),
        )
      : files.removeFile("local.settings.json"),
    folders.upsertFolder("src").then(() =>
      core === "azure-func"
        ? files
            .upsertFile("src/index.ts", index, {
              create: !!regenerate && !ignore.includes("src/index.ts"),
              update: false,
            })
            .then(() => folders.upsertFolder("src/functions"))
            .then(() => folders.isEmpty("src/functions"))
            .then((empty) =>
              files.upsertFile("src/functions/httpTrigger1.ts", httpTrigger1, {
                create: empty && !!regenerate,
                update: regenerate === "hard",
              }),
            )
        : deleteAzureFunctions(core),
    ),
    core === "azure-func"
      ? files.upsertFile(
          ".funcignore",
          await createFuncignoreFile(regenerate),
          !!regenerate && !ignore.includes(".funcignore"),
        )
      : files.removeFile(".funcignore"),
  ]);

  await next();
}

async function createHostFile(
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const hostJSON =
    regenerate === "soft"
      ? await files
          .readFile("host.json")
          .then((result) => (!!result ? JSON.parse(result) : {}))
      : {};

  const template = {
    extensions: {
      http: { routePrefix: "" },
    },
    logging: {
      applicationInsights: {
        samplingSettings: {
          excludedTypes: "Request",
          isEnabled: true,
        },
      },
    },
  };

  const source = {
    extensionBundle: {
      id: "Microsoft.Azure.Functions.ExtensionBundle",
      version: "[4.*, 5.0.0)",
    },
    version: "2.0",
  };

  return JSON.stringify(
    sortProperties(
      merges.deep(
        merges.deep(template, hostJSON, {
          arrayConcat: true,
          arrayRemoveDuplicated: true,
          sort: true,
        }),
        source,
        {
          arrayConcat: true,
          arrayRemoveDuplicated: true,
          sort: true,
        },
      ),
      ["version"],
    ),
    undefined,
    2,
  );
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
              (await files.readFile("src/functions/httpTrigger1.ts")) ===
                httpTrigger1),
        )))
  )
    await folders.removeFolder("src");
}

async function createLocalSettingsFile(
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const [localSettings, version] = await Promise.all([
    regenerate === "soft"
      ? files
          .readFile("local.settings.json")
          .then((result) => (!!result ? JSON.parse(result) : {}))
      : Promise.resolve({}),
    git.isInsideRepository().then((inside) =>
      inside
        ? git
            .getTags({ merged: true })
            .then((tags) => tags.at(-1))
            .then((tag) => git.getTagInfo(tag || "v0.0.0"))
            .then((info) => `${info.major}.${info.minor}.${info.patch}`)
        : "0.0.0",
    ),
  ]);

  const source = {
    isEncrypted: false,
    values: {
      APP_VERSION: version,
      FUNCTIONS_EXTENSION_VERSION: "~4",
      FUNCTIONS_WORKER_RUNTIME: "node",
      WEBSITE_NODE_DEFAULT_VERSION: "~22",
    },
  };

  return JSON.stringify(
    merges.deep(localSettings, source, {
      arrayConcat: true,
      arrayRemoveDuplicated: true,
      sort: true,
    }),
    undefined,
    2,
  );
}

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

async function createFuncignoreFile(
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";

  const funcignore =
    regenerate === "soft"
      ? await files
          .readFile(".funcignore")
          .then((result) => (!!result ? result.split(EOL) : []))
      : [];

  const source = [
    "__azurite_db*__.json",
    "__blobstorage__",
    "__queuestorage__",
    "**/.*",
    "src",
    "eslint.config.js",
    "jest.config.js",
    "local.settings.json",
    "package-lock.json",
    "prettier.config.js",
    "tsconfig.json",
    "webpack.config.js",
  ];

  return merges
    .deep(funcignore, source, {
      arrayConcat: true,
      arrayRemoveDuplicated: true,
      sort: true,
    })
    .join(EOL);
}
