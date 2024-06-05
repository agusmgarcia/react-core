const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration[] */
module.exports = [
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
    externals: [
      ...Object.keys(packageJSON.peerDependencies),
      "./eslint",
      "./github",
      "./prettier",
      "./typescript",
      "./webpack",
    ],
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
  {
    dependencies: ["commands"],
    entry: fs
      .readdirSync(path.resolve(__dirname, "src", "commands"))
      .filter((file) => !file.startsWith("_") && !file.endsWith(".ts"))
      .reduce((result, file) => {
        result[file] = path.resolve(
          __dirname,
          "src",
          "commands",
          file,
          "index.ts",
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
    name: "modules",
    output: {
      filename: "./[name]/index.js",
      globalObject: "this",
      library: {
        name: packageJSON.name,
        type: "umd",
      },
      path: path.resolve(__dirname, "bin"),
      umdNamedDefine: true,
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    },
    target: "node",
  },
];
