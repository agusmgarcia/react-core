# Commands

Set of opinionated commands to run, check, format and build react applications and libraries. It uses the following packages:

- Eslint
- NextJS
- Prettier
- Typescript
- Webpack

## Setup

In your _package.json_ file, make sure you have set `private: true` in case it is a web application.

```jsonc
// package.json

{
  "private": true,
}
```

> Mark it as `false` or not defined it in case it is a library.

Then, place add the following commands within the scripts section of the _package.json_.

```jsonc
// package.json

{
  "scripts": {
    "build": "agusmgarcia-react-core-build",
    "check": "agusmgarcia-react-core-check",
    "format": "agusmgarcia-react-core-format",
    "start": "agusmgarcia-react-core-start",
    "postpack": "agusmgarcia-react-core-postpack",
    "prepack": "agusmgarcia-react-core-prepack",
    "regenerate": "agusmgarcia-react-core-regenerate",
  },
}
```

## Skip regenerating files

When running `npm run regenerate` all the pertinent files will be regenerated. Here the list of the files:

- .eslintignore
- .eslintrc
- .env
- .env.local
- .github/workflows/continuous-integration-and-deployment.yml
- .gitignore
- .nvmrc
- .prettierignore
- .prettierrc
- next.config.js
- tsconfig.json
- webpack.config.js

In case you want to prevent one of the files of being regenerated, use the `--ignore=` flag.

> For example, `agusmgarcia-react-core-check --ignore=.eslintrc --ignore=.prettierignore`. It will ignore `.eslintrc` and `.prettierignore` files of being regenerated.
