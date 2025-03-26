import { type AsyncFunc } from "#src/utils";

import { files, getCore } from "../utils";

export default async function tailwindcssMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await Promise.all([
    files.upsertFile(
      "postcss.config.js",
      postCSSConfig,
      regenerate && !ignore.includes("postcss.config.js"),
    ),
    files.upsertFile(
      "tailwind.config.js",
      core === "app" ? tailwindConfig_app : tailwindConfig_lib,
      {
        create: regenerate && !ignore.includes("tailwind.config.js"),
        update: false,
      },
    ),
  ]);

  await next();
}

const postCSSConfig = `module.exports = {
  plugins: {
    autoprefixer: {},
    tailwindcss: {},
  },
};
`;

const tailwindConfig_app = `/** @type import('tailwindcss').Config */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
  theme: {},
};
`;

const tailwindConfig_lib = `/** @type import('tailwindcss').Config */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [],
  theme: {},
};
`;
