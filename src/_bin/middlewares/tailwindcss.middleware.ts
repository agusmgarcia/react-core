import { type AsyncFunc } from "#src/utilities";

import { isLibrary, upsertFile } from "../utilities";

export default async function tailwindcssMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();
  if (!library) {
    await Promise.all([
      upsertFile(
        "postcss.config.js",
        postCSSConfig,
        regenerate && !ignore.includes("postcss.config.js"),
      ),
      upsertFile("tailwind.config.js", tailwindConfig, false),
    ]);
  }

  await next();
}

const postCSSConfig = `module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
  },
};
`;

const tailwindConfig = `/** @type import('tailwindcss').Config */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: { extend: {} },
};
`;
