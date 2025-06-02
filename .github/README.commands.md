# Commands

Set of opinionated commands to build, check, deploy, format, pack, run and test NextJS applications and libraries and Azure functions.

## Setup

In your _package.json_ file, make sure you have set `core: "app"` in case it is a NextJS application, `core: "lib"` for library, `core: "azure-func"` for Azure functions or `core: "node"` for NodeJS applications.

```jsonc
// ./package.json

{
  "core": "app",
}
```

Then, add the following command within the scripts section of the _package.json_.

```jsonc
// ./package.json

{
  "scripts": {
    // ...
    "regenerate": "agusmgarcia-react-core-regenerate",
  },
}
```

And run:

```bash
npm run regenerate
```

This will create all the necessary files to run the application.

## Start

```bash
npm start
```

It creates a server to run the applications. Works in the following context:

- app
- azure-func
- node

### Change port

By default the server is created at <http://localhost:3000>. In case you want to set another port explicitly, append the `--port=` parameter.

```bash
npm start -- --port=3001
```

### Run for production

By default `npm start` runs in development mode for NodeJS apps. In case you want to run it for prod, run the following command:

```bash
npm start -- --production
```

## Deploy

```bash
npm run deploy
```

It is a script that automatically creates corresponding Git tags based on the type of the commits. It also forward the changes to the following tags as well. For example, if you make a fix on top of the tag `v1.0.2`, it is going to create `v1.0.3`. But, if there is also a tag like `v1.1.8`, it is going to cherry-pick the fix and merge it on top of that, creating the tag `v1.1.9`. This action is repeated until the last tag. Works in the following context:

- app
- azure-func
- lib
- node

### Interactive mode

When running `npm run deploy`, the process start merging commits into the differents tags. That's made to propagate changes across upper versions automatically. In case you want to go step by step use the `--interactive` flag.

```bash
npm run deploy -- --interactive
```

## Regenerate

```bash
npm run regenerate
```

Regenerate the files with the latest version. Works in the following context:

- app
- azure-func
- lib
- node

Here the list of the files:

- .github/CHANGELOG.md
- .github/README.md _(just creation phase)_
- .github/workflows/deploy-app.yml
- .github/workflows/deploy-azure-func.yml
- .github/workflows/deploy-node.yml
- .github/workflows/publish-lib.yml
- pages/\_app.css _(just creation phase)_
- pages/\_app.tsx _(just creation phase)_
- src/index.ts _(just creation phase)_
- .env.local
- .funcignore
- .gitignore
- .npmignore
- .nvmrc
- eslint.config.js
- host.json
- jest.config.js
- local.settings.json
- next.config.js
- package.json
- postcss.config.js
- prettier.config.js
- tailwind.config.js _(just creation phase)_
- tsconfig.json
- webpack.config.js

### Skip regenerating files

In case you want to prevent one of the files of being regenerated, use the `--ignore=` flag.

```bash
npm run regenerate -- --ignore=eslint.config.js -- --ignore=prettier.config.js
```

### Force file regeneration

In case you have changed the core of the project, you may want to run the `regenerate` script with the `--force` flag. That makes to override the user changes.

```bash
npm run regenerate -- --force
```

## Test

```bash
npm test
```

Runs all the tests files located in the project. Works in the following context:

- app
- azure-func
- lib
- node

### Select test files

If you want to run some tests for specific files use the `--pattern` argument to the test script.

```bash
npm test -- --pattern=src/mytest.test.ts
```

### Watch test files

If you want to watch files for changes and rerun tests related to changed files use the `--watch` argument to the test script.

```bash
npm run test -- --watch
```
