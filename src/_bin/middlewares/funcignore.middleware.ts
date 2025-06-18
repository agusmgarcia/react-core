import createMiddleware from "./createMiddleware";

export default createMiddleware<string[]>({
  path: ".funcignore",
  template: getTemplate,
  valid: ["azure-func"],
});

function getTemplate(): string[] {
  return [
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
}
