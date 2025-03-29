import { type AsyncFunc } from "#src/utils";

import { files, getCore } from "../utils";

export default async function webpackMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const core = await getCore();

  if (core === "app") await files.removeFile("webpack.config.js");
  else
    await files.upsertFile(
      "webpack.config.js",
      webpackConfig,
      regenerate && !ignore.includes("webpack.config.js"),
    );

  await next();
}

const webpackConfig = `const fs = require("fs");
const path = require("path");
const RemovePlugin = require("remove-files-webpack-plugin");
const getCustomTransformers = require("ts-transform-paths").default;
const webpack = require("webpack");

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration[] */
module.exports = [
  {
    entry: path.resolve(__dirname, "src", "index.ts"),
    externals: Object.keys(packageJSON.peerDependencies || {}),
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          exclude: /node_modules/,
          test: /\\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  jsx: "react-jsx",
                },
                getCustomTransformers,
              },
            },
          ],
        },
      ],
    },
    output: {
      clean: true,
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
      new RemovePlugin({
        after: { include: [path.resolve(__dirname, "dist", "_bin")] },
      }),
    ],
    resolve: {
      alias: { "#src": path.resolve(__dirname, "src") },
      extensions: [".js", ".jsx", ".ts", ".tsx"],
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
    externals: Object.keys(packageJSON.peerDependencies || {}),
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  declaration: false,
                  jsx: "react-jsx",
                },
                getCustomTransformers,
              },
            },
          ],
        },
      ],
    },
    output: {
      clean: true,
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
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    target: "node",
  },
];
`;
