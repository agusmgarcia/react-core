import { type AsyncFunc } from "#src/utils";

import { files, folders, getCore, npm } from "../utils";

export default async function webpackMiddleware(
  _: string,
  next: AsyncFunc,
  regenerate: "hard" | "soft" | undefined,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  if (core === "app")
    await files.removeFile(
      "webpack.config.js",
      !!regenerate && !ignore.includes("webpack.config.js"),
    );
  else
    await files.upsertFile(
      "webpack.config.js",
      await createWebpackConfigFile(core, regenerate),
      !!regenerate && !ignore.includes("webpack.config.js"),
    );

  try {
    await next();
  } finally {
    await Promise.all([
      core === "app" ? folders.removeFolder("dist") : Promise.resolve(),
    ]);
  }
}

async function createWebpackConfigFile(
  core: Extract<
    Awaited<ReturnType<typeof getCore>>,
    "azure-func" | "lib" | "node"
  >,
  regenerate: "hard" | "soft" | undefined,
): Promise<string> {
  if (!regenerate) return "";
  if (core === "azure-func")
    return `const fs = require("fs");
const path = require("path");
const getCustomTransformers = require("ts-transform-paths").default;

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration */
module.exports = {
  entry: {
    index: path.resolve(__dirname, "src", "index.ts"),
    ...(fs.existsSync(path.resolve(__dirname, "src", "functions"))
      ? fs
          .readdirSync(path.resolve(__dirname, "src", "functions"))
          .filter(
            (file) =>
              !file.startsWith("_") &&
              !file.endsWith(".test.ts") &&
              file.endsWith(".ts") &&
              file !== "index.ts",
          )
          .reduce((result, file) => {
            result[file.split(".ts")[0]] = path.resolve(
              __dirname,
              "src",
              "functions",
              file,
            );
            return result;
          }, {})
      : {}),
  },
  externals: Object.keys(packageJSON.dependencies || {}),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: { getCustomTransformers },
          },
        ],
      },
    ],
  },
  output: {
    filename: (data) =>
      data.chunk?.name === "index"
        ? "index.js"
        : \`functions\${path.sep}\${data.chunk?.name || "[name]"}.js\`,
    globalObject: "this",
    library: {
      name: packageJSON.name,
      type: "umd",
    },
    path: path.resolve(__dirname, "dist"),
    umdNamedDefine: true,
  },
  resolve: {
    alias: { "#src": path.resolve(__dirname, "src") },
    extensions: [".js", ".ts"],
  },
  target: "node",
  watchOptions: {
    ignored: /node_modules/,
  },
};
`;

  if (core === "lib") {
    const reactAsPeer = await npm.isDependencyInstalled("react", {
      peer: true,
    });

    return `const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const RemovePlugin = require("remove-files-webpack-plugin");
const getCustomTransformers = require("ts-transform-paths").default;
const webpack = require("webpack");

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration[] */
module.exports = [
  {
    entry: path.resolve(__dirname, "src", "index.ts"),
    externals: [
      ...Object.keys(packageJSON.peerDependencies || {}),
      ${reactAsPeer ? `"react/jsx-runtime",` : ""}
    ],
    module: {
      rules: [
        {
          test: /\\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            "style-loader",
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          exclude: /node_modules/,
          test: /\\.ts${reactAsPeer ? "x" : ""}?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                ${
                  reactAsPeer
                    ? `compilerOptions: {
                  jsx: "react-jsx",
                },`
                    : ""
                }
                getCustomTransformers,
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: "index.js",
      globalObject: "this",
      library: {
        name: packageJSON.name,
        type: "umd",
      },
      path: path.resolve(__dirname, "dist"),
      umdNamedDefine: true,
    },
    plugins: [
      new MiniCssExtractPlugin(),
      new RemovePlugin({
        after: { include: [path.resolve(__dirname, "dist", "_bin")] },
      }),
    ],
    resolve: {
      alias: { "#src": path.resolve(__dirname, "src") },
      extensions: [".js"${reactAsPeer ? `, ".jsx"` : ""}, ".ts"${reactAsPeer ? `, ".tsx"` : ""}],
      fallback: {
        assert: false,
        buffer: false,
        console: false,
        constants: false,
        crypto: false,
        domain: false,
        events: false,
        http: false,
        https: false,
        os: false,
        path: false,
        process: false,
        punycode: false,
        querystring: false,
        stream: false,
        string_decoder: false,
        sys: false,
        timers: false,
        tty: false,
        url: false,
        util: false,
        vm: false,
        zlib: false,
      }
    },
  },
  {
    entry: fs.existsSync(path.resolve(__dirname, "src", "_bin"))
      ? fs
          .readdirSync(path.resolve(__dirname, "src", "_bin"))
          .filter((file) => !file.startsWith("_") && file.endsWith(".ts"))
          .reduce((result, file) => {
            result[file.split(".ts")[0]] = path.resolve(
              __dirname,
              "src",
              "_bin",
              file,
            );
            return result;
          }, {})
      : {},
    externals: [
      ...Object.keys(packageJSON.peerDependencies || {}),
      ${reactAsPeer ? `"react/jsx-runtime",` : ""}
    ],
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\\.ts${reactAsPeer ? "x" : ""}?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                ${
                  reactAsPeer
                    ? `compilerOptions: {
                  declaration: false,
                  jsx: "react-jsx",
                },`
                    : ""
                }
                getCustomTransformers,
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: "all",
      },
    },
    output: {
      filename: "[name].js",
      globalObject: "this",
      library: {
        name: packageJSON.name,
        type: "umd",
      },
      path: path.resolve(__dirname, "bin"),
      umdNamedDefine: true,
    },
    plugins: [
      new webpack.BannerPlugin({ banner: "#! /usr/bin/env node", raw: true }),
    ],
    resolve: {
      alias: { "#src": path.resolve(__dirname, "src") },
      extensions: [".js"${reactAsPeer ? `, ".jsx"` : ""}, ".ts"${reactAsPeer ? `, ".tsx"` : ""}],
    },
    target: "node",
  },
];
`;
  }

  return `const path = require("path");
const getCustomTransformers = require("ts-transform-paths").default;

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration */
module.exports = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  externals: Object.keys(packageJSON.dependencies || {}),
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: { getCustomTransformers },
          },
        ],
      },
    ],
  },
  output: {
    filename: "index.js",
    globalObject: "this",
    library: {
      name: packageJSON.name,
      type: "umd",
    },
    path: path.resolve(__dirname, "dist"),
    umdNamedDefine: true,
  },
  resolve: {
    alias: { "#src": path.resolve(__dirname, "src") },
    extensions: [".js", ".ts"],
  },
  target: "node",
  watchOptions: {
    ignored: /node_modules/,
  },
};
`;
}
