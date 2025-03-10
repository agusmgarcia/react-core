import { type AsyncFunc } from "#src/utils";

import { files, isLibrary } from "../utils";

export default async function jestMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  await files.upsertFile(
    "jest.config.js",
    !library ? jestConfig_app : jestConfig_lib,
    regenerate && !ignore.includes("jest.config.js"),
  );

  await next();
}

const jestConfig_app = `const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type import("jest").Config */
const config = {
  cacheDirectory: "node_modules/.jestcache",
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^#public/(.*)$": "<rootDir>/public/$1",
    "^#src/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
  testRegex: ["pages\\\\/.*\\\\.test\\\\.[jt]sx?$", "src\\\\/.*\\\\.test\\\\.[jt]sx?$"],
};

module.exports = createJestConfig(config);
`;

const jestConfig_lib = `const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type import("jest").Config */
const config = {
  cacheDirectory: "node_modules/.jestcache",
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^#src/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "jsdom",
  testRegex: ["src\\\\/.*\\\\.test\\\\.[jt]sx?$"],
};

module.exports = createJestConfig(config);
`;
