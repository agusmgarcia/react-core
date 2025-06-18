import createMiddleware from "./createMiddleware";

export default createMiddleware<string>({
  path: "src/index.css",
  template: getTemplate,
  valid: ["lib"],
});

function getTemplate() {
  return `@import "tailwindcss";
`;
}
