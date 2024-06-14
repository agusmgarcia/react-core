import { type Func } from "../../utilities";
import { isLibrary, upsertFile } from "../utilities";

export default async function webpackMiddleware(
  next: Func<Promise<void>>,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();
  if (library)
    await upsertFile(
      "webpack.config.js",
      webpackConfig,
      regenerate && !ignore.includes("webpack.config.js"),
    );
  await next();
}

const webpackConfig = `const path = require("path");

const packageJSON = require("./package.json");

/** @type import("webpack").Configuration[] */
module.exports = {
  entry: path.resolve(__dirname, "src", "index.ts"),
  externals: Object.keys(packageJSON.peerDependencies),
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
                jsx: "react",
              },
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
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
`;
