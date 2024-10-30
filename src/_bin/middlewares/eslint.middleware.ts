import { type AsyncFunc } from "#src/utilities";

import { isLibrary, upsertFile } from "../utilities";

export default async function eslintMiddleware(
  next: AsyncFunc,
  regenerate: boolean,
  ignore: string[],
): Promise<void> {
  const library = await isLibrary();

  await Promise.all([
    upsertFile(
      ".eslintrc",
      !library ? eslintrc_app : eslintrc_lib,
      regenerate && !ignore.includes(".eslintrc"),
    ),
    upsertFile(
      ".eslintignore",
      !library ? eslintIgnore_app : eslintIgnore_lib,
      regenerate && !ignore.includes(".eslintignore"),
    ),
  ]);

  await next();
}

const eslintrc_app = `{
  "env": {
    "es6": true
  },
  "extends": [
    "next/core-web-vitals",
    "plugin:boundaries/strict",
    "plugin:tailwindcss/recommended"
  ],
  "overrides": [
    {
      "files": ["**/*.types.ts"],
      "rules": {
        "unused-imports/no-unused-vars": "off"
      }
    },
    {
      "files": ["**/*.d.ts"],
      "rules": {
        "@typescript-eslint/consistent-type-imports": "off",
        "boundaries/element-types": "off",
        "boundaries/entry-point": "off",
        "boundaries/no-private": "off",
        "boundaries/no-unknown": "off",
        "boundaries/no-unknown-files": "off",
        "import/first": "off",
        "import/newline-after-import": "off",
        "import/no-duplicates": "off",
        "react/jsx-boolean-value": "off",
        "react/jsx-sort-props": "off",
        "simple-import-sort/exports": "off",
        "simple-import-sort/imports": "off",
        "sort/destructuring-properties": "off",
        "sort/export-members": "off",
        "sort/exports": "off",
        "sort/import-members": "off",
        "sort/imports": "off",
        "sort/object-properties": "off",
        "sort/string-enums": "off",
        "sort/string-unions": "off",
        "sort/type-properties": "off",
        "unused-imports/no-unused-imports": "off",
        "unused-imports/no-unused-vars": "off"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "boundaries",
    "import",
    "react",
    "simple-import-sort",
    "sort",
    "unused-imports"
  ],
  "rules": {
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports",
        "disallowTypeAnnotations": true,
        "fixStyle": "inline-type-imports"
      }
    ],
    "boundaries/element-types": [
      "error",
      {
        "default": "disallow",
        "rules": [
          {
            "from": ["root"],
            "allow": ["public", "root", "pages", "store", "utils"]
          },
          {
            "from": ["api"],
            "allow": ["public", "api", "utils"]
          },
          {
            "from": ["components"],
            "allow": ["public", "components", "utils"]
          },
          {
            "from": ["fragments"],
            "allow": ["public", "components", "fragments", "store", "utils"]
          },
          {
            "from": ["pages"],
            "allow": [
              "public",
              "components",
              "fragments",
              "pages",
              "store",
              "utils"
            ]
          },
          {
            "from": ["store"],
            "allow": ["public", "api", "store", "utils"]
          },
          {
            "from": ["utils"],
            "allow": ["public", "utils"]
          }
        ]
      }
    ],
    "boundaries/entry-point": "error",
    "boundaries/no-private": "error",
    "boundaries/no-unknown": "error",
    "boundaries/no-unknown-files": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-sort-props": ["error", { "reservedFirst": true }],
    "simple-import-sort/exports": "off",
    "simple-import-sort/imports": "error",
    "sort/destructuring-properties": "error",
    "sort/export-members": "error",
    "sort/exports": [
      "error",
      {
        "caseSensitive": false,
        "groups": [
          { "order": 5, "type": "default" },
          { "order": 4, "type": "sourceless" },
          { "order": 3, "regex": "^\\\\.+\\\\/" },
          { "order": 1, "type": "dependency" },
          { "order": 2, "type": "other" }
        ],
        "natural": true
      }
    ],
    "sort/import-members": "error",
    "sort/imports": "off",
    "sort/object-properties": "error",
    "sort/string-enums": ["error", { "caseSensitive": false, "natural": true }],
    "sort/string-unions": [
      "error",
      { "caseSensitive": false, "natural": true }
    ],
    "sort/type-properties": [
      "error",
      { "caseSensitive": false, "natural": true }
    ],
    "tailwindcss/classnames-order": "error",
    "tailwindcss/enforces-negative-arbitrary-values": "error",
    "tailwindcss/enforces-shorthand": "error",
    "tailwindcss/no-arbitrary-value": "off",
    "tailwindcss/no-custom-classname": "error",
    "tailwindcss/no-contradicting-classname": "error",
    "tailwindcss/no-unnecessary-arbitrary-value": "error",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "vars": "all",
        "varsIgnorePattern": "^_"
      }
    ]
  },
  "settings": {
    "boundaries/include": [
      "./pages/**/*",
      "./package.json",
      "./public/**/*",
      "./src/**/*",
      "./tailwind.config.js"
    ],
    "boundaries/elements": [
      {
        "mode": "full",
        "pattern": ["./package.json", "./public/**/*", "./tailwind.config.js"],
        "type": "public"
      },
      {
        "mode": "full",
        "pattern": ["./pages/**/*"],
        "type": "root"
      },
      {
        "mode": "full",
        "pattern": ["./src/api/**/*"],
        "type": "api"
      },
      {
        "mode": "full",
        "pattern": ["./src/components/**/*"],
        "type": "components"
      },
      {
        "mode": "full",
        "pattern": ["./src/fragments/**/*"],
        "type": "fragments"
      },
      {
        "mode": "full",
        "pattern": ["./src/pages/**/*"],
        "type": "pages"
      },
      {
        "mode": "full",
        "pattern": ["./src/store/**/*"],
        "type": "store"
      },
      {
        "mode": "full",
        "pattern": ["./src/utils/**/*"],
        "type": "utils"
      }
    ]
  }
}
`;

const eslintrc_lib = `{
  "env": {
    "es6": true
  },
  "extends": ["next/core-web-vitals"],
  "overrides": [
    {
      "files": ["**/*.types.ts"],
      "rules": {
        "unused-imports/no-unused-vars": "off"
      }
    },
    {
      "files": ["**/*.d.ts"],
      "rules": {
        "@typescript-eslint/consistent-type-imports": "off",
        "import/first": "off",
        "import/newline-after-import": "off",
        "import/no-duplicates": "off",
        "react/jsx-boolean-value": "off",
        "react/jsx-sort-props": "off",
        "simple-import-sort/exports": "off",
        "simple-import-sort/imports": "off",
        "sort/destructuring-properties": "off",
        "sort/export-members": "off",
        "sort/exports": "off",
        "sort/import-members": "off",
        "sort/imports": "off",
        "sort/object-properties": "off",
        "sort/string-enums": "off",
        "sort/string-unions": "off",
        "sort/type-properties": "off",
        "unused-imports/no-unused-imports": "off",
        "unused-imports/no-unused-vars": "off"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "import",
    "react",
    "simple-import-sort",
    "sort",
    "unused-imports"
  ],
  "rules": {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        "prefer": "type-imports",
        "disallowTypeAnnotations": true,
        "fixStyle": "inline-type-imports"
      }
    ],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-sort-props": ["error", { "reservedFirst": true }],
    "simple-import-sort/exports": "off",
    "simple-import-sort/imports": "error",
    "sort/destructuring-properties": "error",
    "sort/export-members": "error",
    "sort/exports": [
      "error",
      {
        "caseSensitive": false,
        "groups": [
          { "order": 5, "type": "default" },
          { "order": 4, "type": "sourceless" },
          { "order": 3, "regex": "^\\\\.+\\\\/" },
          { "order": 1, "type": "dependency" },
          { "order": 2, "type": "other" }
        ],
        "natural": true
      }
    ],
    "sort/import-members": "error",
    "sort/imports": "off",
    "sort/object-properties": "error",
    "sort/string-enums": ["error", { "caseSensitive": false, "natural": true }],
    "sort/string-unions": [
      "error",
      { "caseSensitive": false, "natural": true }
    ],
    "sort/type-properties": [
      "error",
      { "caseSensitive": false, "natural": true }
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        "args": "after-used",
        "argsIgnorePattern": "^_",
        "vars": "all",
        "varsIgnorePattern": "^_"
      }
    ]
  }
}
`;

const eslintIgnore_app = `.env.local
.next
node_modules
out`;

const eslintIgnore_lib = `bin
dist
node_modules
*.tgz`;
