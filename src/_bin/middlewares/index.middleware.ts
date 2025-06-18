import createMiddleware, { type Context } from "./createMiddleware";

export default createMiddleware<string>({
  path: "src/index.ts",
  template: getTemplate,
  valid: ["azure-func", "lib", "node"],
});

function getTemplate(context: Context): string {
  return context.core === "azure-func"
    ? `import { app } from "@azure/functions";

app.setup({
  enableHttpStream: true,
});
`
    : context.core === "lib"
      ? `import "./index.css";
`
      : "";
}
