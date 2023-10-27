import { createFolder, exists, isLibrary, remove, writeFile } from "../_utils";

export default async function withContext<TResult>(
  callback: () => TResult | Promise<TResult>,
): Promise<TResult> {
  const library = await isLibrary();

  await Promise.all([
    exists("pages").then((pagesExists) =>
      !pagesExists ? createFolder("pages") : Promise.resolve(),
    ),
    writeFile(".eslintrc", !library ? eslintrc_app : eslintrc_lib),
    writeFile(".eslintignore", !library ? eslintIgnore_app : eslintIgnore_lib),
  ]);

  try {
    return await callback();
  } finally {
    await Promise.all([
      library ? remove("next-env.d.ts") : Promise.resolve(),
      library ? remove(".next") : Promise.resolve(),
      library ? remove("pages") : Promise.resolve(),
    ]);
  }
}

const eslintrc_app = `{
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
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "import",
    "react",
    "simple-import-sort",
    "sort",
    "unused-imports"
  ],
  "rules": {
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
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "import",
    "react",
    "simple-import-sort",
    "sort",
    "unused-imports"
  ],
  "rules": {
    "@next/next/no-html-link-for-pages": "off",
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
