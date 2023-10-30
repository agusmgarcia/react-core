import { isLibrary, writeFile } from "../_utils";

export default async function withContext<TResult>(
  callback: () => TResult | Promise<TResult>,
  force: boolean,
): Promise<TResult> {
  const library = await isLibrary();
  if (library) await writeFile("webpack.config.js", webpackConfig, force);

  return await callback();
}

const webpackConfig = `const path = require("path");

const packageJSON = require("./package.json");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.ts"),
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
    path: path.resolve(__dirname, "./dist"),
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
};
`;
