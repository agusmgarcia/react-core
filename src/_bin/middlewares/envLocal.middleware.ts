import { files, folders } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<Record<string, any>>({
  path: ".env.local",
  template: getTemplate,
  valid: ["app", "node"],
});

export default async function envLocalMiddleware(
  context: Context,
): Promise<void> {
  await Promise.all([MIDDLEWARE(context), deleteEnvFiles(context)]);
}

async function deleteEnvFiles(context: Context): Promise<void> {
  if (context.core === "app" || context.core === "node") return;
  await folders
    .readFolder(".")
    .then((fs) => fs.filter((f) => f === ".env" || f.startsWith(".env.")))
    .then((fs) => Promise.all(fs.map((f) => files.removeFile(f))));
}

function getTemplate(context: Context): Record<string, any> {
  return context.core === "app"
    ? {
        NEXT_PUBLIC_APP_VERSION: context.version,
        NEXT_PUBLIC_BASE_PATH: "",
      }
    : {
        APP_VERSION: context.version,
      };
}
