import { createFolder, exists, isLibrary, remove, writeFile } from "../_utils";

export default async function withContext<TResult>(
  callback: () => TResult | Promise<TResult>,
): Promise<TResult> {
  const library = await isLibrary();

  await Promise.all([
    exists("pages").then((pagesExists) =>
      !pagesExists ? createFolder("pages") : Promise.resolve(),
    ),
    !library ? writeFile("next.config.js", nextConfig) : Promise.resolve(),
  ]);

  try {
    return await callback();
  } finally {
    await Promise.all([
      library ? remove("next-env.d.ts") : Promise.resolve(),
      library ? remove(".next") : Promise.resolve(),
      library ? remove("pages") : Promise.resolve(),
    ]);
  }
}

const nextConfig = `const { PHASE_PRODUCTION_BUILD } = require("next/constants");

/** @type {import('next').NextConfig} */
module.exports = (phase) => ({
  output: phase === PHASE_PRODUCTION_BUILD ? "export" : undefined,
  reactStrictMode: true,
});
`;
