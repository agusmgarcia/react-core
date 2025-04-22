const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const { defineConfig, globalIgnores } = require("eslint/config");
const react = require("eslint-plugin-react");
const simpleImportSort = require("eslint-plugin-simple-import-sort");
const sort = require("eslint-plugin-sort");
const unusedImports = require("eslint-plugin-unused-imports");

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = defineConfig([
  globalIgnores(["**/bin", "**/dist", "**/node_modules"]),
  {
    extends: compat.extends(
      "next/core-web-vitals",
      "plugin:tailwindcss/recommended",
      "plugin:import/recommended",
    ),

    ignores: ["**/*.d.ts"],

    languageOptions: {
      ecmaVersion: 5,
      globals: {},
      parser: tsParser,
      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": typescriptEslint,
      react,
      "simple-import-sort": simpleImportSort,
      sort,
      "unused-imports": unusedImports,
    },

    rules: {
      "@next/next/no-html-link-for-pages": "off",

      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          fixStyle: "inline-type-imports",
          prefer: "type-imports",
        },
      ],

      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "react/jsx-boolean-value": ["error", "always"],

      "react/jsx-sort-props": [
        "error",
        {
          reservedFirst: true,
        },
      ],

      "simple-import-sort/exports": "off",
      "simple-import-sort/imports": "error",
      "sort/destructuring-properties": "error",
      "sort/export-members": "error",

      "sort/exports": [
        "error",
        {
          caseSensitive: false,

          groups: [
            {
              order: 5,
              type: "default",
            },
            {
              order: 4,
              type: "sourceless",
            },
            {
              order: 3,
              regex: "^\\.+\\/",
            },
            {
              order: 1,
              type: "dependency",
            },
            {
              order: 2,
              type: "other",
            },
          ],

          natural: true,
        },
      ],

      "sort/import-members": "error",
      "sort/imports": "off",
      "sort/object-properties": "error",

      "sort/string-enums": [
        "error",
        {
          caseSensitive: false,
          natural: true,
        },
      ],

      "sort/string-unions": [
        "error",
        {
          caseSensitive: false,
          natural: true,
        },
      ],

      "sort/type-properties": [
        "error",
        {
          caseSensitive: false,
          natural: true,
        },
      ],

      "tailwindcss/classnames-order": "error",
      "tailwindcss/enforces-negative-arbitrary-values": "error",
      "tailwindcss/enforces-shorthand": "error",
      "tailwindcss/no-arbitrary-value": "off",
      "tailwindcss/no-contradicting-classname": "error",
      "tailwindcss/no-custom-classname": "error",
      "tailwindcss/no-unnecessary-arbitrary-value": "error",
      "unused-imports/no-unused-imports": "error",

      "unused-imports/no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
