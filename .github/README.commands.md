# Commands

Set of opinionated commands to build, check, deploy, format, pack, run and test NextJS applications and libraries and Azure functions.

## Setup

In your _package.json_ file, make sure you have set `core: "app"` in case it is a NextJS application, `core: "lib"` for library or `core: "azure-func"` for Azure functions.

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

## Change port

By default `npm start` creates a server from <http://localhost:3000>. In case you want to set another port explicitly, append the `--port=` parameter.

```jsonc
// ./package.json

{
  "scripts": {
    // ...
    "start": "agusmgarcia-react-core-start --port=3001",
  },
}
```

## Interactive mode

When running `npm run deploy`, the process start merging commits into the differents tags. That's made to propagate changes across upper versions automatically. In case you want to go step by step use the `--interactive` flag.

```bash
npm run deploy -- --interactive
```

## Skip regenerating files

When running `npm run regenerate` all the pertinent files will be regenerated. Here the list of the files:

- .github/CHANGELOG.md
- .github/README.md _(just creation phase)_
- .github/workflows/deploy-app.yml
- .github/workflows/deploy-azure-func.yml
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

In case you want to prevent one of the files of being regenerated, use the `--ignore=` flag.

```jsonc
// ./package.json

{
  "scripts": {
    // ...
    "regenerate": "agusmgarcia-react-core-regenerate --ignore=eslint.config.js --ignore=prettier.config.js",
  },
}
```

> In this example, it will ignore `eslint.config.js` and `prettier.config.js` files of being regenerated. The generated files vary on the type of the application.

## Force file regeneration

In case you have changed the core of the project, you may want to run the `regenerate` script with the `--force` flag. That makes to override the user changes.

```bash
npm run regenerate -- --force
```

## Select test files

If you want to run some tests for specific files use the `--pattern` argument to the test script.

```jsonc
// ./package.json

{
  "scripts": {
    // ...
    "test": "agusmgarcia-react-core-test --pattern=src/mytest.test.ts",
  },
}
```

## Watch test files

If you want to watch files for changes and rerun tests related to changed files use the `--watch` argument to the test script.

```bash
npm run test -- --watch
```
