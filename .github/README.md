# React Core

Set of opinionated commands to run, check, format and build react applications and libraries. It uses the following packages:

- Eslint
- NextJS
- Prettier
- Typescript
- Webpack

## Getting started

Create a _.npmrc_ file at the root of your project. This file should look like this:

```.npmrc
@agusmgarcia:registry=https://npm.pkg.github.com
```

Then execute the following command:

```bash
npm i @agusmgarcia/react-core --save-dev
```

## Detect project type

In order to determine whether the project is an app or a library, this package checks the `package.json.private` field. It is a library in case its value is `false` or `undefined`. Check the following snippet:

```typescript
export default async function isLibrary(): Promise<boolean> {
  const packageJSON = JSON.parse(await readFile("package.json"));
  return packageJSON.private === undefined || packageJSON.private === false;
}
```

## Available commands

In your `package.json` file, within the `scripts` section add the following commands based on whether it's an application or a library.

### Application

```jsonc
// package.json

{
  "scripts": {
    "build": "agusmgarcia-build",
    "check": "agusmgarcia-check",
    "format": "agusmgarcia-format",
    "start": "agusmgarcia-start",
  },
}
```

### Library

```jsonc
// package.json

{
  "scripts": {
    "check": "agusmgarcia-check",
    "format": "agusmgarcia-format",
    "postpack": "agusmgarcia-postpack",
    "prepack": "agusmgarcia-prepack",
  },
}
```

## Disable features

You can disable `eslint` by providing the `--no-eslint` option to the commands listed above. You can also disable `prettier`, `typescript` and `webpack` by following the same process.

> For example, in case you want to disable `eslint` for the check command, execute: `agusmgarcia-check --no-eslint`

## Skip creating or overwritting files

Config files are created automatically in order to run commands properly. Those files cannot be changed due they are overwritten every time you execute any command again. In case you want to skip that file of being created or overwritten, use the `--skip` flag.

> For example, `agusmgarcia-check --skip=.eslintrc --skip=.prettierignore`. It will ignore `.eslintrc` and `.prettierignore` files of being created or overwritten.
