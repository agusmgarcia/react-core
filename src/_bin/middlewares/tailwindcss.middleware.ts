import { type AsyncFunc } from "#src/utils";

import { files, getCore } from "../utils";

export default async function tailwindcssMiddleware(
  _: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  await Promise.all([
    core === "app" || core === "lib"
      ? files.upsertFile(
          "postcss.config.js",
          postCSSConfig,
          !!regenerate && !ignore.includes("postcss.config.js"),
        )
      : files.removeFile(
          "postcss.config.js",
          !!regenerate && !ignore.includes("postcss.config.js"),
        ),
    core === "app" || core === "lib"
      ? files.upsertFile(
          "tailwind.config.js",
          core === "app" ? tailwindConfig_app : tailwindConfig_lib,
          {
            create: !!regenerate && !ignore.includes("tailwind.config.js"),
            update: false,
          },
        )
      : files.removeFile(
          "tailwind.config.js",
          !!regenerate && !ignore.includes("tailwind.config.js"),
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
