import createMiddleware from "./createMiddleware";

export default createMiddleware<string>({
  path: ".nvmrc",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

function getTemplate(): string {
  return "22.14";
}
