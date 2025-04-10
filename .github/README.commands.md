# Commands

Set of opinionated commands to run, check, format and build react applications and libraries. It uses the following packages:

- Eslint
- Jest
- NextJS
- Prettier
- TailwindCSS
- Typescript
- Webpack

## Setup

In your _package.json_ file, make sure you have set `core: "app"` in case it is a web application or `core: "lib"` for library.

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

By default `npm start` creates a server from <http://localhost:3000>. It also selects an available port in case 3000 is beign used by another process. In case you want to set the port explicitly, append the `--port=` parameter.

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

- .env _(just creation phase)_
- .env.local _(just creation phase)_
- .github/CHANGELOG.md
- .github/README.md _(just creation phase)_
- .github/workflows/deploy-app.yml
- .github/workflows/publish-lib.yml
- .gitignore
- .npmignore
- .nvmrc
- pages/\_app.tsx _(just creation phase)_
- pages/\_app.css _(just creation phase)_
- eslint.config.js
- jest.config.js
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

> In this example, it will ignore `eslint.config.js` and `prettier.config.js` files of being regenerated.

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

```jsonc
// ./package.json

{
  "scripts": {
    // ...
    "test": "agusmgarcia-react-core-test --watch",
  },
}
```
