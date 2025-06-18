import createMiddleware from "./createMiddleware";

export default createMiddleware<string>({
  path: "pages/_app.css",
  template: getTemplate,
  valid: ["app"],
});

function getTemplate() {
  return `@import "tailwindcss";
`;
}
