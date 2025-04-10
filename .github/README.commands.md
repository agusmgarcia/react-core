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

In your _package.json_ file, make sure you have set `private: true` in case it is a web application.

```jsonc
// ./package.json

{
  "private": true,
}
```

> Mark it as `false` or not defined it in case it is a library.

Then, place add the following commands within the scripts section of the _package.json_.

```jsonc
// ./package.json

{
  "scripts": {
    "build": "agusmgarcia-react-core-build",
    "check": "agusmgarcia-react-core-check",
    "deploy": "agusmgarcia-react-core-deploy",
    "format": "agusmgarcia-react-core-format",
    "postpack": "agusmgarcia-react-core-postpack",
    "prepack": "agusmgarcia-react-core-prepack",
    "start": "agusmgarcia-react-core-start",
    "regenerate": "agusmgarcia-react-core-regenerate",
    "test": "agusmgarcia-react-core-test",
  },
}
```

In case of library, to link the package with a repository, you need to specify the URL in the _package.json_.

```jsonc
// ./package.json

{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/<REPOSITORY_OWNER>/<REPOSITORY_NAME>.git",
  },
}
```

> For example, this package would be `git+https://github.com/agusmgarcia/react-core.git`.

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

- .env.local
- .github/CHANGELOG.md
- .github/README.md _(just creation phase)_
- .github/workflows/deploy-app.yml
- .github/workflows/publish-lib.yml
- .gitignore
- .npmignore
- .nvmrc
- eslint.config.js
- jest.config.js
- next.config.js
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
