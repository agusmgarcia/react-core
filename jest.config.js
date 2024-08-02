const nextJest = require("next/jest.js");

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
  testRegex: ["src\\/.*\\.test\\.[jt]sx?$"],
};

module.exports = createJestConfig(config);
