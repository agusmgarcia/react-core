import createMiddleware, { type Context } from "./createMiddleware";

export default createMiddleware<Record<string, any>>({
  path: "local.settings.json",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(context: Context): Record<string, any> {
  return {
    isEncrypted: false,
    values: {
      APP_VERSION: context.version,
      FUNCTIONS_EXTENSION_VERSION: "~4",
      FUNCTIONS_WORKER_RUNTIME: "node",
      WEBSITE_NODE_DEFAULT_VERSION: "~22",
    },
  };
}
