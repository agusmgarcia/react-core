import { files } from "../utils";

export default async function tailwindConfigMiddleware(): Promise<void> {
  await Promise.all([
    files.removeFile("tailwind.config.js"),
    files.removeFile("tailwind.config.mjs"),
    files.removeFile("tailwind.config.ts"),
  ]);
}
