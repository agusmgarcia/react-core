const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration[] */
module.exports = [
  {
    entry: path.resolve(__dirname, "src", "index.ts"),
    externals: Object.keys(packageJSON.peerDependencies),
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  jsx: "react",
                },
              },
            },
          ],
        },
      ],
    },
    name: "source",
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
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
  },
  {
    entry: fs
      .readdirSync(path.resolve(__dirname, "src", "commands"))
      .filter((file) => !file.startsWith("_") && file.endsWith(".ts"))
      .reduce((result, file) => {
        result[file.split(".ts")[0]] = path.resolve(
          __dirname,
          "src",
          "commands",
          file,
        );
        return result;
      }, {}),
    externals: Object.keys(packageJSON.peerDependencies),
    module: {
      rules: [
        {
          exclude: /node_modules/,
          test: /\.tsx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                compilerOptions: {
                  declaration: false,
                  jsx: "react",
                },
              },
            },
          ],
        },
      ],
    },
    name: "commands",
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
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    target: "node",
  },
];
