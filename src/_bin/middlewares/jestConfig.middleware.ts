import { folders } from "../utils";
import createMiddleware, { type Context } from "./createMiddleware";

const MIDDLEWARE = createMiddleware<string>({
  path: "jest.config.js",
  template: getTemplate,
  valid: ["app", "azure-func", "lib", "node"],
});

export default async function jestConfigMiddleware(
  context: Context,
): Promise<void> {
  await MIDDLEWARE(context);
  context.defer(() => folders.removeFolder(".swc"));
}

function getTemplate(context: Context): string {
  return context.core === "app"
    ? `const nextJest = require("next/jest.js");

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
`
    : context.core === "azure-func"
      ? `const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type import("jest").Config */
const config = {
  cacheDirectory: "node_modules/.jestcache",
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^#src/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  testRegex: ["src\\\\/.*\\\\.test\\\\.[jt]s$"],
};

module.exports = createJestConfig(config);
`
      : context.core === "lib"
        ? `const nextJest = require("next/jest.js");

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
`
        : `const nextJest = require("next/jest.js");

const createJestConfig = nextJest({ dir: "./" });

/** @type import("jest").Config */
const config = {
  cacheDirectory: "node_modules/.jestcache",
  clearMocks: true,
  coverageProvider: "v8",
  moduleNameMapper: {
    "^#src/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  testRegex: ["src\\\\/.*\\\\.test\\\\.[jt]s$"],
};

module.exports = createJestConfig(config);
`;
}
