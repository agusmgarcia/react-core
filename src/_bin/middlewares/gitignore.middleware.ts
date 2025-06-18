import createMiddleware, { type Context } from "./createMiddleware";

export default createMiddleware<string[]>({
  path: ".gitignore",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(context: Context): string[] {
  return context.core === "app"
    ? [".env*.local", "dist", "node_modules"]
    : context.core === "azure-func"
      ? ["dist", "local.settings.json", "node_modules"]
      : context.core === "lib"
        ? ["bin", "dist", "node_modules", "*.tgz"]
        : [".env*.local", "dist", "node_modules"];
}
